import { Router } from "express";
import { OrderItemController } from "../controller/orderItem.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createOrderItemSchema,
    updateOrderItemSchema
} from "../models/orderItem.schema.js";

const orderItemRouter = Router();
const controller = new OrderItemController();

orderItemRouter.get("/", requireAuth, requireRole("CUSTOMER","OWNER"), controller.getAll);
orderItemRouter.post("/", requireAuth, requireRole("CUSTOMER"), validate(createOrderItemSchema), controller.create);
orderItemRouter.put("/:id", requireAuth, requireRole("CUSTOMER"), validate(updateOrderItemSchema), controller.update);
orderItemRouter.delete("/:id", requireAuth, requireRole("CUSTOMER"), validate(updateOrderItemSchema), controller.delete);

export default orderItemRouter;