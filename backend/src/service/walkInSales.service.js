import { WalkInSaleRepository } from "../repository/walkInSales.repository.js";

export class WalkInSaleService {
  constructor() {
    this.walkInSaleRepository = new WalkInSaleRepository();
  }

  async getAllSales() {
    return await this.walkInSaleRepository.getAllSales();
  }

  async getSaleById(id) {
    if (!id) {
      const error = new Error("Sale ID is required");
      error.statusCode = 400;
      throw error;
    }

    const sale = await this.walkInSaleRepository.getSaleById(id);

    if (!sale) {
      const error = new Error("Walk-in sale not found");
      error.statusCode = 404;
      throw error;
    }

    return sale;
  }

  async createSale(data) {
    const combinedItems = new Map();

    for (const item of data.items) {
      const currentQuantity =
        combinedItems.get(item.productId) || 0;

      combinedItems.set(
        item.productId,
        currentQuantity + item.quantity
      );
    }

    const items = Array.from(
      combinedItems,
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );

    return await this.walkInSaleRepository.createSale({
      ...data,
      items,
    });
  }
}