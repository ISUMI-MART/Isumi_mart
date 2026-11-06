
import { CartRepository } from "../repository/cart.repository.js";
import {
  NotFoundError,
  BadRequestError,
} from "../errors/appError.js";

const cartRepository = new CartRepository();

export class CartService {


  async getCart(userId) {
    return await cartRepository.getCart(userId);
  }

  async addToCart(userId, productId, quantity = 1) {

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestError("Quantity must be at least 1");
    }

    const product = await cartRepository.findProduct(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.isActive) {
      throw new BadRequestError("This product is not available");
    }

    const existingItem = await cartRepository.findCartItem(
      userId,
      productId
    );

    const requestedQuantity =
      (existingItem?.quantity || 0) + quantity;

    if (!product.stockConfig ||
        requestedQuantity > product.stockConfig.quantity) {
      throw new BadRequestError("Insufficient stock available");
    }

    return await cartRepository.addToCart(
      userId,
      productId,
      quantity
    );
  }

  // Update product quantity
  async updateQuantity(userId, productId, quantity) {

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestError("Quantity must be at least 1");
    }

    const product = await cartRepository.findProduct(productId);

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found or unavailable");
    }

    const cartItem = await cartRepository.findCartItem(
      userId,
      productId
    );

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (!product.stockConfig ||
        quantity > product.stockConfig.quantity) {
      throw new BadRequestError("Insufficient stock available");
    }

    await cartRepository.updateQuantity(
      userId,
      productId,
      quantity
    );

    return await cartRepository.findCartItem(userId, productId);
  }

  // Remove product from cart
  async removeFromCart(userId, productId) {

    const result = await cartRepository.removeFromCart(
      userId,
      productId
    );

    if (result.count === 0) {
      throw new NotFoundError("Cart item not found");
    }

    return result;
  }

  // Clear entire cart
  async clearCart(userId) {
    return await cartRepository.clearCart(userId);
  }
}
