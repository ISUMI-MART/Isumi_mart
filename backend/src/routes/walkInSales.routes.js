import { Router } from "express";

import { WalkInSaleController } from "../controller/walkInSales.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import { createWalkInSaleSchema } from "../models/walkInSales.schema.js";

const walkInSalesRouter = Router();

const walkInSaleController = new WalkInSaleController();

walkInSalesRouter.get("/",requireAuth,requireRole("OWNER"),walkInSaleController.getAllSales);
walkInSalesRouter.get("/:id",requireAuth,requireRole("OWNER"),walkInSaleController.getSaleById);
walkInSalesRouter.post("/",requireAuth,requireRole("OWNER"),validate(createWalkInSaleSchema),walkInSaleController.createSale);

export default walkInSalesRouter;