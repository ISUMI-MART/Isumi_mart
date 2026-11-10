import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const categoryRouter = Router();
const controller = new CategoryController();

categoryRouter.get("/",controller.getAll)
categoryRouter.get("/:slug",controller.getBySlug)
categoryRouter.put("/:slug",requireAuth,requireRole("OWNER"),controller.update)
categoryRouter.post("/",requireAuth,requireRole("OWNER"),controller.create)
categoryRouter.delete("/:slug",requireAuth,requireRole("OWNER"),controller.delete)

export default categoryRouter