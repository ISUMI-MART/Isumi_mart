import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

const authRouter = Router();
const authController = new AuthController();

//authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);


authRouter.post("/register", (req, res, next) => {
  console.log("REGISTER ROUTE HIT");
  next();
}, authController.register);

export default authRouter;
