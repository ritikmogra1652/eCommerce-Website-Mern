import express from "express";

import validateRequest from "../../auth/middleware/validationRequest";
import HandleErrors from "../../auth/middleware/handleErrors";
import orderRequestSchema from "../schema/schema";
import { placeOrder } from "../controller/orderController";
import authorization from "../../auth/middleware/authorization";


const orderRoutes = express.Router();

orderRoutes.post("/order", authorization,validateRequest(orderRequestSchema), HandleErrors(placeOrder));
// orderRoutes.get("/cart/:userId", HandleErrors(getCart));

export { orderRoutes };
