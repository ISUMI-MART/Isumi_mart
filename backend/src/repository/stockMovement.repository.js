
import { prisma } from "../config/Prisma.js";

export class StockMovementRepository {

  async getAllMovements() {
    return await prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMovementsByProduct(productId) {
    return await prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findProduct(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stockConfig: true,
      },
    });
  }


async createMovement(data) {
  return await prisma.$transaction(async (tx) => {

    const { productId, quantity, note } = data;

    // Ensure stock record exists
    await tx.stock.upsert({
      where: { productId },
      create: {
        productId,
        quantity: 0,
      },
      update: {},
    });

    // Update stock atomically
    const updated = await tx.stock.updateMany({
      where: {
        productId,
        ...(quantity < 0
          ? { quantity: { gte: Math.abs(quantity) } }
          : {}),
      },
      data: {
        quantity:
          quantity > 0
            ? { increment: quantity }
            : { decrement: Math.abs(quantity) },
      },
    });

    if (updated.count === 0) {
      const error = new Error("Insufficient stock");
      error.code = "INSUFFICIENT_STOCK";
      throw error;
    }

    // Create stock movement history
    const movement = await tx.stockMovement.create({
      data: {
        productId,
        quantity,
        note,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
      },
    });

    const stock = await tx.stock.findUnique({
      where: { productId },
    });

    return {
      movement,
      stock,
    };
  });
}

}
