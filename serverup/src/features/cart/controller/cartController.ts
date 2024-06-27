import { Request, Response } from "express";
import CartService from "../service/cartService";

export const addCart = async (req: Request, res: Response) => {
    try {
        const body = {
            ...req.body,
        };

        const data = await CartService.addCart(body);

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
};

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const data = await CartService.getCart(userId);
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
};
