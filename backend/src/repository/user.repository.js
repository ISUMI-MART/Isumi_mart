import { prisma } from "../config/Prisma.js";

const userProfileSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  userName: true,
  role: true,
  phone: true,
  address: true,
  agentCode: true,
  createdAt: true,
  updatedAt: true,
};

export class UserRepository {
  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: userProfileSelect,

    });
  }
  
  async createUser(data) {
    return await prisma.user.create({ 
      data ,
    select: userProfileSelect,
  });
  }

  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      select: userProfileSelect,
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({ 
      where: { id } ,
    select: userProfileSelect,
  });
  }
}
