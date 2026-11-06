import { prisma } from "../config/Prisma.js";

export class WalkInSaleItemsRepository {

    async getItemsBySaleId(saleId) {
        return await prisma.walkInSaleItem.findMany({
            where: {
                saleId: saleId,
            },
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
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getItemById(id) {
        return await prisma.walkInSaleItem.findUnique({
            where: {
                id: id,
            },
            include: {
                product: true,
                sale: true,
            },
        });
    }

    async findSaleById(saleId) {
        return await prisma.walkInSale.findUnique({
            where: {
                id: saleId,
            },
        });
    }
}