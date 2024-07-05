import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envConfig from "../../../config/envConfig";
import { ObjectId } from "mongoose";

const env = envConfig();
const secretKey = env.secretKey;

export interface AuthRequest extends Request {
  userId?:string,
  role?:string,
  email?:string,
}

export const adminValidation = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      secretKey
    ) as jwt.JwtPayload;

      req.userId = decoded.userId;
      req.role = decoded.role;
      req.email = decoded.email;
      
    if (req.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admin can perform this action.",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
