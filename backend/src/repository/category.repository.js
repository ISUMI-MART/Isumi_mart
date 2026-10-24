import { prisma } from "../config/Prisma";

export class CategoryRepository {
    async findById(id) {
        return await prisma.category.findUnique({
            where: { id }
        })
    }
    async getAll(){
        return await prisma.category.findMany({
orderBy :{name :'asc'},
        })
    }

    async createCategory(data) {
        return await prisma.category.create({ data });
    }
    async updateCategory(id, data) {
        return await prisma.category.create({
            Where: { id },
            data,
        });
    }
    async deleteCategory(id) {
        return await prisma.category.delete({ where: { id } });
    }
}