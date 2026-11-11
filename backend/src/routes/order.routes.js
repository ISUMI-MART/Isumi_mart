import { Router } from "express";
import { OrderController } from "../controller/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParamSchema
} from "../models/order.schema.js";

const orderRouter = Router();
const controller = new OrderController();


orderRouter.post("/", requireAuth, requireRole("CUSTOMER"), validate(createOrderSchema), controller.create);
orderRouter.get("/", requireAuth, requireRole("OWNER", "CUSTOMER"), controller.getAll);
orderRouter.get("/:id", requireAuth, validate(orderIdParamSchema), controller.getById);
orderRouter.put("/:id/status", requireAuth, requireRole("OWNER", "DELIVERY_AGENT"), validate(updateOrderStatusSchema), controller.updateStatus);

export default orderRouter;