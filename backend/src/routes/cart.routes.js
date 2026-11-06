import { Router } from "express";

import { CartController } from "../controller/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import { addToCartSchema, updateCartSchema } from "../models/cart.schema.js";

const cartRouter = Router();
const cartController = new CartController();

cartRouter.get("/",requireAuth,requireRole("CUSTOMER"),cartController.getCart,);
cartRouter.post("/",requireAuth,requireRole("CUSTOMER"),validate(addToCartSchema),cartController.addToCart,);
cartRouter.put("/:productId",requireAuth,requireRole("CUSTOMER"),validate(updateCartSchema),cartController.updateQuantity,);
cartRouter.delete("/:productId",requireAuth,requireRole("CUSTOMER"),cartController.removeFromCart,);
cartRouter.delete( "/",requireAuth,requireRole("CUSTOMER"),cartController.clearCart,);

export default cartRouter;
