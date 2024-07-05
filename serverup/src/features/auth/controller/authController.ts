import { Request, Response } from "express";
import AuthService from "../service/authServices";
import { IUsers } from "../models/user";

export interface AuthRequest extends Request {
    email?: string;
    userId?: string;
    user?: IUsers;
}

export const register = async(req:Request, res:Response)=>{
    try {
        const body = {
            ...req.body,
        };

        const data = await AuthService.register(body);

        if (data.success) {
        res.status(201).json({
        ...data,
        code: 201,
        });
        } else {
        res.status(409).json({
        ...data,
        code: 409,
        });
        }
    } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const body = {
            ...req.body,
        };

        const data = await AuthService.login(body);

        if (data.success) {
        res.status(200).json({
            ...data,
            code: 200,
        });
        } else {
        res.status(409).json({
            ...data,
            code: 409,
        });
        }
    } catch (error: any) {
        const statusCode = error.output?.statusCode ?? 500;
        const errorMessage = error.message ?? "Internal Server Error";
        res.status(statusCode).json({ error: errorMessage });
    }

}


export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const body = {
        email: req.email,
        };
        const data = await AuthService.getProfile(body);

        if (data.success) {
        res.status(200).json({
            ...data,
            code: 200,
        });
        } else {
        res.status(400).json({
            ...data,
            code: 400,
        });
        }
    } catch (error: any) {
        const statusCode = error.output?.statusCode ?? 500;
        const errorMessage = error.message ?? "Internal Server Error";
        res.status(statusCode).json({ error: errorMessage });
    }
};


export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const email = req.email;
      const body = {
        ...req.body 
        };
        
        const data = await AuthService.updateProfile(email!, body);

    if (data.success) {
      res.status(200).json({
        ...data,
        code: 200,
      });
    } else {
      res.status(400).json({
        ...data,
        code: 400,
      });
    }
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};
