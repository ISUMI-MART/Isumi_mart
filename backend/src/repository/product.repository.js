import { prisma } from "../config/Prisma.js";

export class ProductRepository {
    async findById(id) {
        return await prisma.product.findUnique({
            where: { id }

        })
    }
    async createProduct(data) {
        const { categorySlug, ...productData } = data;

        return await prisma.product.create({
            data: {
                ...productData,
                category: {
                    connect: {
                        slug: categorySlug
                    }
                }
            },
            include: {
                category: true
            }
        });
    }
    async updateProduct(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        return await prisma.product.delete({
            where: { id }
        });
    }


    async getAll(filters = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
            search,
            categorySlug
        } = filters;

        const where = {};

        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ];
        }

        if (categorySlug) {
            where.category = {
                is: {
                    slug: categorySlug
                }
            };
        }

        const skip = (page - 1) * limit;

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder
                },
                include: {
                    category: true
                }
            }),
            prisma.product.count({ where })
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

}