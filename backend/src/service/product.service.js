import { NotFoundError } from "../errors/appError.js";
import { ProductRepository } from "../repository/product.repository.js";

const productRepository = new ProductRepository();

export class ProductService {
    async createProduct(data) {
        // const product = await productRepository.findById(id);

        // if (product) {
        //     throw new NotFoundError("Product id already exists");
        // }
        return await productRepository.createProduct(data);
    }
    async getAllProduct() {
        return await productRepository.getAll();
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return product;
    }

    async updateProduct(id, data) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new NotFoundError("product not found");
        }
        return await productRepository.updateProduct(id, data);
    }

    async deleteProduct(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new NotFoundError("product not found");
        }
        return await productRepository.deleteProduct(id);
    }
}

