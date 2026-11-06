import { NotFoundError, BadRequestError } from "../errors/appError.js";
import { WalkInSaleRepository } from "../repository/walkInSales.repository.js";

const walkInSaleRepository = new WalkInSaleRepository();

export class WalkInSaleService {

    async createSale(data) {
        if (!data.items || data.items.length === 0) {
            throw new BadRequestError("At least one product is required");
        }

        return await walkInSaleRepository.createSale(data);
    }

    async getAllSales() {
        return await walkInSaleRepository.getAllSales();
    }

    async getSaleById(id) {
        const sale = await walkInSaleRepository.getSaleById(id);

        if (!sale) {
            throw new NotFoundError("Walk-in sale not found");
        }

        return sale;
    }

}