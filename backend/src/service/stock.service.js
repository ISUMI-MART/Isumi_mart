
import { NotFoundError } from "../errors/appError.js";
import { StockRepository } from "../repository/stock.repository.js";

const stockRepository = new StockRepository();

export class StockService {
    async createStock(data) {
        const productExists =
            await stockRepository.productExists(data.productId);

        if (!productExists) {
            throw new NotFoundError("Product not found");
        }

        const existingStock =
            await stockRepository.findByProductId(data.productId);

        if (existingStock) {
            throw new Error("Stock already exists for this product");
        }

        return await stockRepository.createStock(data);
    }

    async getAllStock() {
        return await stockRepository.getAll();
    }

    async getStockById(id) {
        const stock = await stockRepository.findById(id);

        if (!stock) {
            throw new NotFoundError("Stock record not found");
        }

        return stock;
    }

    async updateStock(id, data) {
        const stock = await stockRepository.findById(id);

        if (!stock) {
            throw new NotFoundError("Stock record not found");
        }

        return await stockRepository.updateStock(id, data);
    }

    async deleteStock(id) {
        const stock = await stockRepository.findById(id);

        if (!stock) {
            throw new NotFoundError("Stock record not found");
        }

        return await stockRepository.deleteStock(id);
    }
}
