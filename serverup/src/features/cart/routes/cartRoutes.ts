import express from "express";
import { addToCartSchema } from "../schema/cartSchema";
import validateRequest from "../../auth/middleware/validationRequest";
import HandleErrors from "../../auth/middleware/handleErrors";
import { addCart, getCart } from "../controller/cartController";

const cartRoutes = express.Router();

cartRoutes.post("/add-to-cart", validateRequest(addToCartSchema), HandleErrors(addCart));
cartRoutes.get("/cart/:userId", HandleErrors(getCart));

export { cartRoutes };