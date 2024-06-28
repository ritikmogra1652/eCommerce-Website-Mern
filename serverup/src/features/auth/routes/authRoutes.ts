import express, { Response, Request } from "express";
import { getProfile, login, register } from "../controller/authController";
import validateRequest from '../middleware/validationRequest';
import { loginSchema, signUpSchema } from "../schema/schema";
import HandleErrors from "../middleware/handleErrors";
import authorization from "../middleware/authorization";

const authRoutes = express.Router();

authRoutes.post("/register", validateRequest(signUpSchema), HandleErrors(register));
authRoutes.post("/login", validateRequest(loginSchema), HandleErrors(login));
authRoutes.get("/profile", authorization, HandleErrors(getProfile));


export { authRoutes };
