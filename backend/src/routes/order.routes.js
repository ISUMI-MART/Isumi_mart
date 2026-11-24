import { Router } from "express";
import { OrderController } from "../controller/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParamSchema,
    assignDeliveryAgentSchema
} from "../models/order.schema.js";

const orderRouter = Router();
const controller = new OrderController();


orderRouter.post("/", requireAuth, requireRole("CUSTOMER"), validate(createOrderSchema), controller.create);
orderRouter.get("/", requireAuth, requireRole("OWNER", "CUSTOMER","DELIVERY_AGENT"), controller.getAll);
orderRouter.get("/:id", requireAuth, validate(orderIdParamSchema), controller.getById);
orderRouter.put("/:id/status", requireAuth, requireRole("OWNER","CUSTOMER", "DELIVERY_AGENT"), validate(updateOrderStatusSchema), controller.updateStatus);
orderRouter.put("/:id/assign-agent",requireAuth,requireRole("OWNER"),validate(assignDeliveryAgentSchema),controller.assignAgent);

export default orderRouter;