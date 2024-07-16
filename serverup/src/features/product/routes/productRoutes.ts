import express, { Response, Request } from "express";
import HandleErrors from "../../auth/middleware/handleErrors";
import { addProduct, getProduct, getProducts, updateProduct } from "../controller/productController";
import validateRequest from "../../auth/middleware/validationRequest";
import { productSchema } from "../schema/schema";
import { adminValidation } from "../middleware/adminValidation";

const productRoutes = express.Router();

productRoutes.get("/products/", HandleErrors(getProducts));
productRoutes.post("/add-products", adminValidation, validateRequest(productSchema), HandleErrors(addProduct));
productRoutes.patch("/products/:id", adminValidation, validateRequest(productSchema), HandleErrors(updateProduct));
productRoutes.get("/products/:id",HandleErrors(getProduct));


export { productRoutes };
