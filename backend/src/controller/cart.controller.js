
import { CartService } from "../service/cart.service.js";
import { catchAsync } from "../util/catchAsync.js";

const cartService = new CartService();

export class CartController {

  getCart = catchAsync(async (req, res) => {

    const userId = Number(req.currentUser.id);

    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      cart,
    });
  });

  addToCart = catchAsync(async (req, res) => {

    const userId = Number(req.currentUser.id);

    const { productId, quantity } = req.validated.body;

    const cartItem = await cartService.addToCart(
      userId,
      productId,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cartItem,
    });
  });

  updateQuantity = catchAsync(async (req, res) => {

    const userId = Number(req.currentUser.id);
    const productId = Number(req.params.productId);

    const { quantity } = req.validated.body;

    const cartItem = await cartService.updateQuantity(
      userId,
      productId,
      quantity
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      cartItem,
    });
  });

  removeFromCart = catchAsync(async (req, res) => {

    const userId = Number(req.currentUser.id);
    const productId = Number(req.params.productId);

    await cartService.removeFromCart(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  });

  clearCart = catchAsync(async (req, res) => {

    const userId = Number(req.currentUser.id);

    const result = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      deletedItems: result.count,
    });
  });
}
