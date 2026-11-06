
import { Router } from "express";
import { StockMovementController } from "../controller/stockMovement.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
  createStockMovementSchema,
} from "../models/stockMovements.schema.js";

const stockMovementRouter = Router();

const stockMovementController = new StockMovementController();


stockMovementRouter.get("/",requireAuth,requireRole("OWNER"),stockMovementController.getAllMovements);
stockMovementRouter.get("/product/:productId",requireAuth,requireRole("OWNER"),stockMovementController.getMovementsByProduct);
stockMovementRouter.post("/",requireAuth,requireRole("OWNER"),validate(createStockMovementSchema),stockMovementController.createMovement);

export default stockMovementRouter;
