import { prisma } from "../config/Prisma.js";

export class OrderRepository {
  async createOrder(data) {
    const { items, ...orderData } = data;

    return prisma.order.create({
      data: {
        ...orderData,

        items: {
          create: items
        }
      },

      include: {
        items: true
      }
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