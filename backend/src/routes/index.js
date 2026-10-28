import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";

const globalRouter =Router();

globalRouter.use("/users",userRouter);
globalRouter.use("/auth",authRouter);
globalRouter.use("/categories",categoryRouter)
globalRouter.use("/products",productRouter)

export default globalRouter;