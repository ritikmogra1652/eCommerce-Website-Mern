import { Request, Response } from "express";
import AuthService from "../service/authServices";



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
