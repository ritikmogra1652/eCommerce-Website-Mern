import express, { Response, Request } from "express";
import authorization from "../../auth/middleware/authorization";
import HandleErrors from "../../auth/middleware/handleErrors";
import validateRequest from "../../auth/middleware/validationRequest";
import { loginSchema } from "../../auth/schema/schema";
import { adminLogin, getAdminProfile, getAllOrders, updateProfile } from "../controller/adminController";
import { adminValidation } from "../../product/middleware/adminValidation";
const adminRoutes = express.Router();

adminRoutes.post("/login", validateRequest(loginSchema), HandleErrors(adminLogin));
adminRoutes.get("/profile", adminValidation, HandleErrors(getAdminProfile));
adminRoutes.get("/getOrders", adminValidation, HandleErrors(getAllOrders));
adminRoutes.patch("/update_profile", adminValidation, HandleErrors(updateProfile));



export { adminRoutes };