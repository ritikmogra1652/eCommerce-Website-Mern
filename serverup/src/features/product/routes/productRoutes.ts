import express, { Response, Request } from "express";
import HandleErrors from "../../auth/middleware/handleErrors";
import { addProduct, exportProducts, exportSampleExcel, getProduct, getProducts, importExcel, updateProduct } from "../controller/productController";
import validateRequest from "../../auth/middleware/validationRequest";
import { productSchema } from "../schema/schema";
import { adminValidation } from "../middleware/adminValidation";
import multer from "multer";
import ProductModel from "../models/product";
const storage = multer.memoryStorage(); // Use memory storage for testing purposes
const upload = multer({ storage });

const productRoutes = express.Router();

productRoutes.get("/products/", HandleErrors(getProducts));
productRoutes.post("/add-products", adminValidation, validateRequest(productSchema), HandleErrors(addProduct));
productRoutes.patch("/products/:id", adminValidation, validateRequest(productSchema), HandleErrors(updateProduct));
productRoutes.get("/products/:id",HandleErrors(getProduct));



// bulk export import routes

productRoutes.get('/export-products', adminValidation, HandleErrors(exportProducts));
productRoutes.get('/export-sample-excel', adminValidation, HandleErrors(exportSampleExcel));

productRoutes.post("/import-products",adminValidation,upload.single("file"),HandleErrors(importExcel));


export { productRoutes };
