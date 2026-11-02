import { NotFoundError } from "../errors/appError.js";
import { CategoryRepository } from "../repository/category.repository.js";

const categoryRepository = new CategoryRepository();

export class CategoryService {
    async createCategory(data) {
        const category = await categoryRepository.findBySlug(data.slug);

        if (category) {
            throw new NotFoundError("Category slug already exists");
        }
        return await categoryRepository.createCategory(data);
    }
    async getAllCategory() {
        return await categoryRepository.getAll();
    }

    async getCategoryBySlug(slug) {
        const category = await categoryRepository.findBySlug(slug);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return category;
    }

    async updateCategory(slug, data) {
        const category = await categoryRepository.findBySlug(slug);
        if (!category) {
            throw new NotFoundError("category not found");
        }
        return await categoryRepository.updateCategory(slug, data);
    }

    async deleteCategory(slug) {
        const category = await categoryRepository.findBySlug(slug);
        if (!category) {
            throw new NotFoundError("category not found");
        }
        return await categoryRepository.deleteCategory(slug);
    }
}

