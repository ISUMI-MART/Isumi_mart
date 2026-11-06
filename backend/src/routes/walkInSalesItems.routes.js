import { Router } from "express";

import { WalkInSaleItemsController } from "../controller/walkInSalesItems.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const walkInSaleItemsRouter = Router();

const walkInSaleItemsController = new WalkInSaleItemsController();

walkInSaleItemsRouter.get("/sale/:saleId",requireAuth,requireRole("OWNER"),walkInSaleItemsController.getItemsBySaleId);
walkInSaleItemsRouter.get("/:id",requireAuth,requireRole("OWNER"),walkInSaleItemsController.getItemById);

export default walkInSaleItemsRouter;