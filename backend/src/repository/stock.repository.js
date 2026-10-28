
import { prisma } from "../config/Prisma.js";

export class StockRepository {
    async findById(id) {
        return await prisma.stock.findUnique({
            where: { id },
            include: { product: true }
        });
    }

    async findByProductId(productId) {
        return await prisma.stock.findUnique({
            where: { productId }
        });
    }

    async productExists(productId) {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true }
        });

        return Boolean(product);
    }

    async createStock(data) {
        return await prisma.stock.create({
            data,
            include: { product: true }
        });
    }

    async getAll() {
        return await prisma.stock.findMany({
            include: { product: true },
            orderBy: { id: "desc" }
        });
    }

    async updateStock(id, data) {
        return await prisma.stock.update({
            where: { id },
            data,
            include: { product: true }
        });
    }

    async deleteStock(id) {
        return await prisma.stock.delete({
            where: { id }
        });
    }
}
