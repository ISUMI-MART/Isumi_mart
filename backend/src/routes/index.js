import { Router } from "express";
import userRouter from "./user.routes.js";
import authRouter from "./auth.routes.js";

const globalRouter =Router();

globalRouter.use("/users",userRouter);
globalRouter.use("/auth",authRouter);

export default globalRouter;