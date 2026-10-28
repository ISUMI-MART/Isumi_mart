import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { createProductSchema, getProductsQuerySchema, productIdParamSchema, updateProductSchema } from "../models/product.schema.js";
import { validate } from "../middleware/validation.middleware.js";

const productRouter = Router();
const controller = new ProductController();

productRouter.get("/",requireAuth,requireRole("OWNER", "CUSTOMER"),validate(getProductsQuerySchema),controller.getAll)
productRouter.get("/:id",requireAuth,requireRole("OWNER", "CUSTOMER"),validate(productIdParamSchema),controller.getById)
productRouter.put("/:id",requireAuth,requireRole("OWNER"),validate(updateProductSchema),controller.update)
productRouter.post("/",requireAuth,requireRole("OWNER"),validate(createProductSchema),controller.create)
productRouter.delete("/:id",requireAuth,requireRole("OWNER"),controller.delete)

export default productRouter
