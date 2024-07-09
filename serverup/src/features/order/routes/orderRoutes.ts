import express from "express";

import validateRequest from "../../auth/middleware/validationRequest";
import HandleErrors from "../../auth/middleware/handleErrors";
import orderRequestSchema from "../schema/schema";
import { getOrder, placeOrder, updateOrderStatus } from "../controller/orderController";
import authorization from "../../auth/middleware/authorization";
import { adminValidation } from '../../product/middleware/adminValidation';


const orderRoutes = express.Router();

orderRoutes.post("/order", authorization,validateRequest(orderRequestSchema), HandleErrors(placeOrder));
orderRoutes.get("/get-orders", authorization, HandleErrors(getOrder));
// orderRoutes.get("/get-order/:id", adminValidation, HandleErrors(getOrderById));
orderRoutes.patch('/update-status/:id', adminValidation, HandleErrors(updateOrderStatus));

export { orderRoutes };
