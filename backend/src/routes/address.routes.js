import { Router } from "express";
import { AddressController } from "../controller/address.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validation.middleware.js";

import {
    createAddressSchema,
    addressIdParamSchema,
    updateAddressSchema
} from "../models/address.schema.js";

const addressRouter = Router();
const controller = new AddressController();

addressRouter.post("/",requireAuth,requireRole("CUSTOMER"),validate(createAddressSchema),controller.create);
addressRouter.get("/",requireAuth,requireRole("CUSTOMER"),controller.getAll);
addressRouter.get("/customer-details",requireAuth,requireRole("CUSTOMER"),controller.getCustomerDetails);
addressRouter.get("/:id",requireAuth,requireRole("CUSTOMER"),validate(addressIdParamSchema),controller.getById);
addressRouter.put("/:id",requireAuth,requireRole("CUSTOMER"),validate(updateAddressSchema),controller.update);
addressRouter.delete("/:id",requireAuth,requireRole("CUSTOMER"),validate(addressIdParamSchema),controller.delete);

export default addressRouter;
