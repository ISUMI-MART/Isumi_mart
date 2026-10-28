
import { Router } from "express";
import { StockController } from "../controller/stock.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createStockSchema,
    stockIdParamSchema,
    updateStockSchema
} from "../models/stock.schema.js";

const stockRouter = Router();
const controller = new StockController();

stockRouter.use(requireAuth);

stockRouter.get("/", requireRole("OWNER", "CUSTOMER"),controller.getAll);
stockRouter.get("/:id",requireRole("OWNER", "CUSTOMER"),validate(stockIdParamSchema),controller.getById);
stockRouter.post("/",requireRole("OWNER"),validate(createStockSchema),controller.create);
stockRouter.put("/:id",requireRole("OWNER"),validate(updateStockSchema),controller.update);
stockRouter.delete("/:id",requireRole("OWNER"),validate(stockIdParamSchema),controller.delete);

export default stockRouter;
