import { prisma } from "../config/Prisma.js";

export class UserRepository {
  async findByClerkId(clerkId) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        address: true,
        phone: true,
      },
    });
  }

  async createUser(data) {
    return await prisma.user.create({ data });
  }

  async findByUserName(userName) {
    return await prisma.user.findUnique({ where: { userName } });
  }

  async updateRole(userId, role) {

    return await prisma.user.update({
      where: { id: userId },
      data: role,
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({ where: { id } });
  }
}
