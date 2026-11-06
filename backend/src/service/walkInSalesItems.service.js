import { NotFoundError } from "../errors/appError.js";
import { WalkInSaleItemsRepository } from "../repository/walkInSalesItems.repository.js";

const walkInSaleItemsRepository = new WalkInSaleItemsRepository();

export class WalkInSaleItemsService {

    async getItemsBySaleId(saleId) {

        const sale = await walkInSaleItemsRepository.findSaleById(saleId);

        if (!sale) {
            throw new NotFoundError("Walk-in sale not found");
        }

        return await walkInSaleItemsRepository.getItemsBySaleId(saleId);
    }

    async getItemById(id) {

        const item = await walkInSaleItemsRepository.getItemById(id);

        if (!item) {
            throw new NotFoundError("Walk-in sale item not found");
        }

        return item;
    }
}