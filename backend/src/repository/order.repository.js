import { prisma } from "../config/Prisma.js";
import { ORDER_CONFIG } from "../config/order.config.js";

function createOrderError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
function validateOrderQuantity(product, quantity) {
  const isWeightProduct = ["kg", "kilogram", "kilograms"].includes(
    product.unit?.trim().toLowerCase(),
  );

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw createOrderError(`Invalid quantity for ${product.name}.`);
  }

  if (isWeightProduct) {
    if (Math.round(quantity * 1000) !== quantity * 1000) {
      throw createOrderError(
        `${product.name} must be ordered in increments of 1 gram.`,
      );
    }
  } else if (!Number.isInteger(quantity)) {
    throw createOrderError(
      `${product.name} must be ordered in whole quantities.`,
    );
  }
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
        throw createOrderError("One or more products could not be found.");
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      let subtotalCents = 0;

      const orderItems = [];

      // 3. Validate products and calculate subtotal
      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product || !product.isActive) {
          throw createOrderError(`Product ${item.productId} is unavailable.`);
        }

        const stock = product.stockConfig;

        if (!stock) {
          throw createOrderError(`${product.name} has no stock record.`);
        }

        validateOrderQuantity(product, Number(item.quantity));

        // Use the database price, not a frontend price
        const priceCents = Math.round(Number(product.price) * 100);

        if (!Number.isSafeInteger(priceCents) || priceCents <= 0) {
          throw createOrderError(`Invalid price for ${product.name}.`);
        }

        subtotalCents += Math.round(priceCents * Number(item.quantity));
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // 4. Calculate delivery fee, discount and total
      const deliveryFeeCents = Math.round(ORDER_CONFIG.DELIVERY_FEE * 100);

      const discountCents = Math.round(ORDER_CONFIG.DISCOUNT * 100);

      const totalCents = subtotalCents + deliveryFeeCents - discountCents;

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
            409,
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

  async getAll(userId, role) {
    let where = {};

    if (role === "CUSTOMER") {
      where = { userId };
    } else if (role === "DELIVERY_AGENT") {
      where = { deliveryAgentId: userId };
    } else if (role !== "OWNER") {
      throw new Error("You are not allowed to view orders.");
    }

    return await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        deliveryAgent: true,
      },
      orderBy: {
        createdAt: "desc",
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

  async updateStatus(id, status, extraData = {}) {
    // CUSTOMER ORDER CANCELLATION
    if (status === "CANCELLED") {
      return await prisma.$transaction(async (tx) => {
        // Get the order and its items
        const order = await tx.order.findUnique({
          where: { id },
          include: {
            items: true,
          },
        });

        if (!order) {
          throw createOrderError("Order not found.", 404);
        }

        // Allow cancellation only before delivery starts
        if (!["ORDER_PLACED", "ASSIGNED"].includes(order.status)) {
          throw createOrderError("This order can no longer be cancelled.");
        }

        // Update only if the order is still cancellable
        const updated = await tx.order.updateMany({
          where: {
            id,
            status: {
              in: ["ORDER_PLACED", "ASSIGNED"],
            },
          },
          data: {
            status: "CANCELLED",
          },
        });

        if (updated.count !== 1) {
          throw createOrderError("This order has already been updated.");
        }

        // Restore the stock for every ordered product
        for (const item of order.items) {
          const stockUpdate = await tx.stock.updateMany({
            where: {
              productId: item.productId,
            },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });

          if (stockUpdate.count !== 1) {
            throw createOrderError(
              `Unable to restore stock for product ${item.productId}.`,
            );
          }
        }

        // Return the updated order
        return await tx.order.findUnique({
          where: { id },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            user: true,
            deliveryAgent: true,
          },
        });
      });
    }

    const data = { status };

    if (status === "PICKED_UP") {
      data.pickedUpAt = new Date();
    }

    if (status === "DELIVERED") {
      data.deliveredAt = new Date();
      data.paymentStatus = "PAID";
    }

    if (status === "DELIVERY_FAILED") {
      data.deliveryFailedAt = new Date();
      data.deliveryFailureReason = extraData.deliveryFailureReason;
      data.deliveryFailureNote = extraData.deliveryFailureNote || null;
    }

    return await prisma.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        deliveryAgent: true,
      },
    });
  }

  async assignAgent(orderId, deliveryAgentId) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw createOrderError("Order not found.", 404);
      }

      // Prevent assignment to completed or cancelled orders
      if (order.status === "DELIVERED" || order.status === "CANCELLED") {
        throw createOrderError(
          "Cannot assign an agent to a delivered or cancelled order.",
        );
      }

      // Check whether the selected user is a delivery agent
      const agent = await tx.user.findFirst({
        where: {
          id: deliveryAgentId,
          role: "DELIVERY_AGENT",
        },
        select: {
          id: true,
        },
      });

      if (!agent) {
        throw createOrderError("Delivery agent not found.", 404);
      }

      // Assign the agent
      return await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          deliveryAgentId: deliveryAgentId,
          status: "ASSIGNED",
          deliveryAssignedAt: new Date(),
        },
        include: {
          items: true,
          user: true,
          deliveryAgent: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userName: true,
              email: true,
            },
          },
        },
      });
    });
  }
}
