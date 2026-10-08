// routes/user.routes.js
import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { requireAuth} from "../middleware/auth.middleware.js";
import { updateUserSchema } from "../models/user.schema.js";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/profile",requireAuth,requireRole("OWNER", "CUSTOMER", "DELIVERY_AGENT"),userController.getProfile)
userRouter.put("/profile",requireAuth,requireRole("OWNER", "CUSTOMER", "DELIVERY_AGENT"),validate(updateUserSchema),userController.updateProfile);
userRouter.delete("/profile",requireAuth,requireRole("OWNER", "CUSTOMER", "DELIVERY_AGENT"),userController.deleteProfile)
userRouter.get("/profile/:id",requireAuth,requireRole("OWNER", "CUSTOMER", "DELIVERY_AGENT"),userController.getProfile)

export default userRouter;
