import { Request, Response } from "express";
import ReviewService from "../service/reviewService";
import { AuthRequest } from "../../auth/middleware/authorization";

export const addReview = async (req: AuthRequest, res: Response) => {
    const body = {
        ...req.body,
        userId: req.userId,
        productId: req.params.productId,
    };
    try {
        console.log(body);
        
        const data = await ReviewService.addReview(body);
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

    export const getReviews = async (req: Request, res: Response) => {
    const productId = req.params.productId;
    try {
        const data = await ReviewService.getReviews(productId);
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
