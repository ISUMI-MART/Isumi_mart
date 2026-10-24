import { NotFoundError } from "../errors/appError";
import { CategoryRepository } from "../repository/category.repository";

const categoryRepository = new CategoryRepository();

export class CategoryService {
    async createCategory(id) {
        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return category;
    }
    async getAllCategory() {
        return await categoryRepository.getAll();
    }

    async getCategoryById(id) {
        const category = await tagRepository.findById(id);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        return tag;
    }

    async updateCategory(id, data) {
        const category = await tagRepository.findById(id);
        if (!category) {
            throw new NotFoundError("Tag not found");
        }
        return await categoryRepository.updateCategory(id, data);
    }

    async deleteCategory(id) {
        const category = await tagRepository.findById(id);
        if (category) {
            throw new NotFoundError("Tag not found");
        }
        return await categoryRepository.deleteCategory(id);
    }
}

