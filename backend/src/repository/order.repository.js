import { prisma } from "../config/Prisma.js";
import { ORDER_CONFIG } from "../config/order.config.js";

function createOrderError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export class OrderRepository {
  async createOrder(data) {
    const { items, ...orderData } = data;

    return prisma.$transaction(async (tx) => {
      // 1. Get actual product details and stock from database
      const productIds = items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
        include: {
          stockConfig: true,
        },
      });

      // 2. Check that every requested product exists
      if (products.length !== items.length) {
        throw createOrderError(
          "One or more products could not be found."
        );
      }

      const productMap = new Map(
        products.map((product) => [product.id, product])
      );

      let subtotalCents = 0;

      const orderItems = [];

      // 3. Validate products and calculate subtotal
      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product || !product.isActive) {
          throw createOrderError(
            `Product ${item.productId} is unavailable.`
          );
        }

        const stock = product.stockConfig;

        if (!stock) {
          throw createOrderError(
            `${product.name} has no stock record.`
          );
        }

        if (stock.quantity < item.quantity) {
          throw createOrderError(
            `Insufficient stock for ${product.name}. Available quantity: ${stock.quantity}.`
          );
        }

        // Use the database price, not a frontend price
        const priceCents = Math.round(
          Number(product.price) * 100
        );

        if (!Number.isSafeInteger(priceCents) || priceCents <= 0) {
          throw createOrderError(
            `Invalid price for ${product.name}.`
          );
        }

        subtotalCents += priceCents * item.quantity;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 4. Calculate delivery fee, discount and total
      const deliveryFeeCents = Math.round(
        ORDER_CONFIG.DELIVERY_FEE * 100
      );

      const discountCents = Math.round(
        ORDER_CONFIG.DISCOUNT * 100
      );

      const totalCents =
        subtotalCents + deliveryFeeCents - discountCents;

      if (!Number.isSafeInteger(subtotalCents) || totalCents <= 0) {
        throw createOrderError("Invalid order total.");
      }

      // 5. Reduce stock safely
      // updateMany checks the available quantity in the database.
      for (const item of items) {
        const stockUpdate = await tx.stock.updateMany({
          where: {
            productId: item.productId,
            quantity: {
              gte: item.quantity,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw createOrderError(
            `Stock changed while placing your order. Please check your cart and try again.`,
            409
          );
        }
      }

      // 6. Create order and order items together
      const order = await tx.order.create({
        data: {
          ...orderData,

          subtotal: subtotalCents / 100,
          deliveryFee: deliveryFeeCents / 100,
          discount: discountCents / 100,
          totalAmount: totalCents / 100,

          items: {
            create: orderItems,
          },
        },

        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    });
  }

  async getAll() {
    return await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async updateStatus(id, status) {
    return await prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}