import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import stockRouter from "./stock.routes.js";

const globalRouter =Router();

globalRouter.use("/users",userRouter);
globalRouter.use("/auth",authRouter);
globalRouter.use("/categories",categoryRouter)
globalRouter.use("/products",productRouter)
globalRouter.use("/stocks",stockRouter)

export default globalRouter;