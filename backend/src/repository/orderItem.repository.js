import { prisma } from "../config/Prisma.js";

export class OrderItemRepository {
  async createItem(data) {
    return await prisma.orderItem.create({
      data,
    });
  }

  async getItemById(id) {
    return await prisma.orderItem.findUnique({
      where: { id: Number(id) },
    });
  }

  async getAll() {
    return await prisma.orderItem.findMany({
      orderBy: { createdAt: 'desc' }, include: {
        order: true,
        product: true
      }
    })
  }

  async updateItem(id, data) {
    return await prisma.orderItem.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteItem(id) {
    return await prisma.orderItem.delete({
      where: { id: Number(id) },
    });
  }
}