import { CartRepository } from "../repository/cart.repository.js";
import { NotFoundError, BadRequestError } from "../errors/appError.js";

const cartRepository = new CartRepository();

// Validate quantity based on product unit
function validateProductQuantity(product, quantity) {
  const isWeightProduct = ["kg", "kilogram", "kilograms"].includes(
    product.unit?.trim().toLowerCase(),
  );

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new BadRequestError("Quantity must be greater than 0");
  }

  if (isWeightProduct) {
    if (Math.round(quantity * 1000) !== quantity * 1000) {
      throw new BadRequestError(
        "Weight quantity must be in increments of 1 gram",
      );
    }
  } else if (!Number.isInteger(quantity)) {
    throw new BadRequestError(
      "This product must be purchased in whole quantities",
    );
  }

  return quantity;
}

export class CartService {
  async getCart(userId) {
    return await cartRepository.getCart(userId);
  }

  // Add product to cart
  async addToCart(userId, productId, quantity = 1) {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    const product = await cartRepository.findProduct(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.isActive) {
      throw new BadRequestError("This product is not available");
    }

    // Validate quantity based on product unit
    validateProductQuantity(product, quantity);

    const existingItem = await cartRepository.findCartItem(userId, productId);

    const requestedQuantity = Number(existingItem?.quantity || 0) + quantity;

    // Check available stock
    if (
      !product.stockConfig ||
      requestedQuantity > Number(product.stockConfig.quantity)
    ) {
      throw new BadRequestError("Insufficient stock available");
    }

    return await cartRepository.addToCart(userId, productId, quantity);
  }

  // Update product quantity
  async updateQuantity(userId, productId, quantity) {
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new BadRequestError("Invalid product ID");
    }

    const product = await cartRepository.findProduct(productId);

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found or unavailable");
    }

    // Validate quantity based on product unit
    validateProductQuantity(product, quantity);

    const cartItem = await cartRepository.findCartItem(userId, productId);

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    // Check available stock
    if (
      !product.stockConfig ||
      quantity > Number(product.stockConfig.quantity)
    ) {
      throw new BadRequestError("Insufficient stock available");
    }

    await cartRepository.updateQuantity(userId, productId, quantity);

    return await cartRepository.findCartItem(userId, productId);
  }

  // Remove product from cart
  async removeFromCart(userId, productId) {
    const result = await cartRepository.removeFromCart(userId, productId);

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
