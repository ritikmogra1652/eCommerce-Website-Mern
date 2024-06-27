import express, { Response, Request } from "express";
import HandleErrors from "../../auth/middleware/handleErrors";
import { addProduct, getProducts, updateProduct } from "../controller/productController";
import validateRequest from "../../auth/middleware/validationRequest";
import { productSchema } from "../schema/schema";
import { adminValidation } from "../middleware/adminValidation";

const productRoutes = express.Router();

productRoutes.get("/products/", HandleErrors(getProducts));
productRoutes.post("/add-products", adminValidation, validateRequest(productSchema), HandleErrors(addProduct));
productRoutes.put("/products/:id",adminValidation,validateRequest(productSchema),HandleErrors(updateProduct));


export { productRoutes };
