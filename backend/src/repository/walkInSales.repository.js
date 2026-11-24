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

  // async createSale(data) {
  //   return await prisma.$transaction(async (tx) => {
  //     const { customerName, paymentStatus, items } = data;

  //     const productIds = items.map((item) => item.productId);

  //     const products = await tx.product.findMany({
  //       where: {
  //         id: { in: productIds },
  //         isActive: true,
  //       },
  //       include: {
  //         stockConfig: true,
  //       },
  //     });

  //     if (products.length !== productIds.length) {
  //       const error = new Error(
  //         "One or more products do not exist or are inactive"
  //       );
  //       error.statusCode = 400;
  //       throw error;
  //     }

  //     const productMap = new Map(
  //       products.map((product) => [product.id, product])
  //     );

  //     let subtotal = 0;

  //     const saleItems = items.map((item) => {
  //       const product = productMap.get(item.productId);

  //       if (!product.stockConfig) {
  //         const error = new Error(
  //           `Stock record not found for ${product.name}`
  //         );
  //         error.statusCode = 400;
  //         throw error;
  //       }

  //       if (product.stockConfig.quantity < item.quantity) {
  //         const error = new Error(
  //           `Insufficient stock for ${product.name}`
  //         );
  //         error.statusCode = 400;
  //         throw error;
  //       }

  //       const price = Number(product.price);
  //       subtotal += price * item.quantity;

  //       return {
  //         productId: product.id,
  //         quantity: item.quantity,
  //         price: product.price,
  //       };
  //     });

  //     const billNumber = `WIS-${Date.now()}`;

  //     // Reduce stock and record stock movements.
  //     for (const item of saleItems) {
  //       const updatedStock = await tx.stock.updateMany({
  //         where: {
  //           productId: item.productId,
  //           quantity: { gte: item.quantity },
  //         },
  //         data: {
  //           quantity: { decrement: item.quantity },
  //         },
  //       });

  //       if (updatedStock.count === 0) {
  //         const error = new Error(
  //           "Insufficient stock. Please refresh and try again."
  //         );
  //         error.statusCode = 400;
  //         throw error;
  //       }

  //       await tx.stockMovement.create({
  //         data: {
  //           productId: item.productId,
  //           quantity: -item.quantity,
  //           note: `Walk-in sale ${billNumber}`,
  //         },
  //       });
  //     }

  //     return await tx.walkInSale.create({
  //       data: {
  //         billNumber,
  //         customerName: customerName || null,
  //         paymentStatus: paymentStatus || "PAID",
  //         subtotal,
  //         totalAmount: subtotal,
  //         items: {
  //           create: saleItems,
  //         },
  //       },
  //       include: {
  //         items: {
  //           include: {
  //             product: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //                 price: true,
  //                 unit: true,
  //                 imageUrl: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   });
  // }

  async createSale(data) {
    return await prisma.$transaction(async (tx) => {
      const { customerName, paymentStatus, items } = data;

      const productIds = [...new Set(items.map((item) => item.productId))];

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
          "One or more products do not exist or are inactive",
        );
        error.statusCode = 400;
        throw error;
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      let subtotalCents = 0;

      const saleItems = items.map((item) => {
        const product = productMap.get(item.productId);
        const quantity = Number(item.quantity);

        const isWeightProduct = ["kg", "kilogram", "kilograms"].includes(
          product.unit?.trim().toLowerCase(),
        );

        if (!Number.isFinite(quantity) || quantity <= 0) {
          const error = new Error(`Invalid quantity for ${product.name}`);
          error.statusCode = 400;
          throw error;
        }

        if (isWeightProduct) {
          if (Math.round(quantity * 1000) !== quantity * 1000) {
            const error = new Error(
              `${product.name} must be sold in increments of 1 gram`,
            );
            error.statusCode = 400;
            throw error;
          }
        } else if (!Number.isInteger(quantity)) {
          const error = new Error(
            `${product.name} must be sold in whole quantities`,
          );
          error.statusCode = 400;
          throw error;
        }

        if (!product.stockConfig) {
          const error = new Error(`Stock record not found for ${product.name}`);
          error.statusCode = 400;
          throw error;
        }

        if (Number(product.stockConfig.quantity) < quantity) {
          const error = new Error(`Insufficient stock for ${product.name}`);
          error.statusCode = 400;
          throw error;
        }

        // Product price is the price per unit (e.g. per kg).
        const priceCents = Math.round(Number(product.price) * 100);
        subtotalCents += Math.round(priceCents * quantity);

        return {
          productId: product.id,
          quantity,
          price: product.price,
        };
      });

      const subtotal = subtotalCents / 100;
      const billNumber = `WIS-${Date.now()}`;

      // Deduct stock and record stock movements.
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

        if (updatedStock.count !== 1) {
          const error = new Error(
            "Insufficient stock. Please refresh and try again.",
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