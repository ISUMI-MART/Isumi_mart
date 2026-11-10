import { prisma } from "../config/Prisma.js";

export class AddressRepository {
    async create(data) {
        return await prisma.address.create({
            data
        });
    }

    async findAllByUserId(userId) {
        return await prisma.address.findMany({
            where: { userId },
            orderBy: {
                isDefault: "desc"
            }
        });
    }
    async findCustomerById(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            firstName: true,
            lastName: true,
            userName: true,
            phone: true
        }
    });
}

    async findById(id) {
        return await prisma.address.findUnique({
            where: { id }
        });
    }

    async update(id, data) {
        return await prisma.address.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await prisma.address.delete({
            where: { id }
        });
    }
}