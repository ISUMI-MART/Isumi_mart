
import { prisma } from "../config/Prisma.js";

export class CartRepository {

  async getCart(userId) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            unit: true,
            isActive: true,
            stockConfig: {
              select: {
                quantity: true,
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

  async findCartItem(userId, productId) {
    return await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
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

  async addToCart(userId, productId, quantity) {
    return await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      include: {
        product: true,
      },
    });
  }

  async updateQuantity(userId, productId, quantity) {
    return await prisma.cartItem.updateMany({
      where: {
        userId,
        productId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeFromCart(userId, productId) {
    return await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }

  async clearCart(userId) {
    return await prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
