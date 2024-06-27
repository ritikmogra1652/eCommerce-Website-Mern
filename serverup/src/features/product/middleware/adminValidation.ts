import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envConfig from "../../../config/envConfig";
import { ObjectId } from "mongoose";

const env = envConfig();
const secretKey = env.secretKey;

export interface AuthRequest extends Request {
  user?: {
    userId: ObjectId;
    role: string;
    email: string;
  };
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

      req.user = { userId: decoded.userId, role: decoded.role, email: decoded.email };
      console.log(req.user);
      
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admin users can perform this action.",
      });
    }

    // If user is an admin, proceed to the next middleware
    next();
  } catch (error) {
    // If token is invalid, return an unauthorized error
    return res.status(401).json({ message: "Invalid token." });
  }
};
