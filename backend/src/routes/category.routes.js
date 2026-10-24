import { Router } from "express";
import { CategoryController } from "../controller/category.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const categoryRouter = Router();
const controller = new CategoryController();

categoryRouter.get("/",requireAuth,requireRole("OWNER", "CUSTOMER"),controller.getAll)