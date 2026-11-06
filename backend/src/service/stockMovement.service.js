
import { StockMovementRepository } from "../repository/stockMovement.repository.js";

import {
  NotFoundError,
  BadRequestError,
} from "../errors/appError.js";

const stockMovementRepository = new StockMovementRepository();

export class StockMovementService {


  async getAllMovements() {
    return await stockMovementRepository.getAllMovements();
  }

  async getMovementsByProduct(productId) {

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    const product = await stockMovementRepository.findProduct(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return await stockMovementRepository.getMovementsByProduct(productId);
  }

  async createMovement(data) {

    const { productId, quantity, note } = data;

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    if (!Number.isInteger(quantity) || quantity === 0) {
      throw new BadRequestError(
        "Quantity must be a non-zero integer"
      );
    }

    const product = await stockMovementRepository.findProduct(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.isActive) {
      throw new BadRequestError(
        "Cannot update stock for an inactive product"
      );
    }

    try {
      return await stockMovementRepository.createMovement({
        productId,
        quantity,
        note: note?.trim() || null,
      });
    } catch (error) {

      if (error.code === "INSUFFICIENT_STOCK") {
        throw new BadRequestError(
          "Stock quantity cannot become negative"
        );
      }

      throw error;
    }
  }
}
