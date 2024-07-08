import express from 'express';
import { categorySchema } from '../schema/schema';
import { adminValidation } from '../../product/middleware/adminValidation';
import HandleErrors from '../../auth/middleware/handleErrors';
import validationRequest from '../../auth/middleware/validationRequest';
import { addCategory, getAllCategories } from '../controller/categoryController';

const categoryRotues = express.Router();


categoryRotues.post("/add-category", adminValidation, validationRequest(categorySchema), HandleErrors(addCategory));
categoryRotues.get("/categories", adminValidation, HandleErrors(getAllCategories));

export { categoryRotues };