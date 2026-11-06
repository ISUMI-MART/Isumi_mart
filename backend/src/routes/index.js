import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import stockRouter from "./stock.routes.js";
import addressRouter from "./address.routes.js";
import cartRouter from "./cart.routes.js";
import stockMovementRouter from "./stockMovements.routes.js";
import walkInSalesRouter from "./walkInSales.routes.js";

const globalRouter =Router();

globalRouter.use("/users",userRouter);
globalRouter.use("/auth",authRouter);
globalRouter.use("/categories",categoryRouter)
globalRouter.use("/products",productRouter)
globalRouter.use("/stocks",stockRouter)
globalRouter.use("/address",addressRouter)
globalRouter.use("/carts",cartRouter)
globalRouter.use("/stock-movements",stockMovementRouter)
globalRouter.use("/walk-in-sales",walkInSalesRouter)

export default globalRouter;