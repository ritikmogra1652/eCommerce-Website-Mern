import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import envConfig from "../../../config/envConfig";
import { IUsers } from '../models/user';
export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
}
const { secretKey } = envConfig();

const authorization = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      secretKey
    ) as jwt.JwtPayload;
    
    req.email = decoded.email;
    req.userId = decoded.userId;
    req.role = decoded.role;
    if (req.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Only users can perform this action.",

      });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authorization;
