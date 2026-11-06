import { prisma } from "../config/Prisma.js";

export class WalkInSaleRepository {
  async getAllSales() {
    return await prisma.walkInSale.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                unit: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSaleById(id) {
    return await prisma.walkInSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                unit: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async createSale(data) {
    return await prisma.$transaction(async (tx) => {
      const { customerName, paymentStatus, items } = data;

      const productIds = items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
        include: {
          stockConfig: true,
        },
      });

      if (products.length !== productIds.length) {
        const error = new Error(
          "One or more products do not exist or are inactive"
        );
        error.statusCode = 400;
        throw error;
      }

      const productMap = new Map(
        products.map((product) => [product.id, product])
      );

      let subtotal = 0;

      const saleItems = items.map((item) => {
        const product = productMap.get(item.productId);

        if (!product.stockConfig) {
          const error = new Error(
            `Stock record not found for ${product.name}`
          );
          error.statusCode = 400;
          throw error;
        }

        if (product.stockConfig.quantity < item.quantity) {
          const error = new Error(
            `Insufficient stock for ${product.name}`
          );
          error.statusCode = 400;
          throw error;
        }

        const price = Number(product.price);
        subtotal += price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const billNumber = `WIS-${Date.now()}`;

      // Reduce stock and record stock movements.
      for (const item of saleItems) {
        const updatedStock = await tx.stock.updateMany({
          where: {
            productId: item.productId,
            quantity: { gte: item.quantity },
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        if (updatedStock.count === 0) {
          const error = new Error(
            "Insufficient stock. Please refresh and try again."
          );
          error.statusCode = 400;
          throw error;
        }

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: -item.quantity,
            note: `Walk-in sale ${billNumber}`,
          },
        });
      }

      return await tx.walkInSale.create({
        data: {
          billNumber,
          customerName: customerName || null,
          paymentStatus: paymentStatus || "PAID",
          subtotal,
          totalAmount: subtotal,
          items: {
            create: saleItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  unit: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    });
  }
}