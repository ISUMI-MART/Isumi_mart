import { prisma } from "../config/Prisma.js";

export class CategoryRepository {
    async findBySlug(slug) {
        return await prisma.category.findUnique({
            where: { slug }
        })
    }
    async getAll() {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' },
        })
    }

    async createCategory(data) {
        return await prisma.category.create({ data });
    }
    async updateCategory(slug, data) {
        return await prisma.category.update({
            where: { slug: slug, },
            data,
        });
    }
    async deleteCategory(slug) {
        return await prisma.category.delete({ 
            where: { slug } });
    }
}