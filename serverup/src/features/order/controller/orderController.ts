import { Request, Response } from "express";
import OrderService from "../service/orderService";
import { AuthRequest } from "../../auth/controller/authController";


export const placeOrder = async (req: AuthRequest, res: Response) => {
    try {
        const body = {
            ...req.body,
        };

        const data = await OrderService.placeOrder(body, req.userId as string);

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

export const getOrder = async (req: AuthRequest, res: Response) => {
    
    try {
        const userId = req.userId;

        const data = await OrderService.getOrder(userId as string);

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

// export const getOrderById = async (req: Request, res: Response) => {

//     try {
//         const orderId = req.params.id;
//         const data = await OrderService.getOrderById(orderId as string);

//         if (data.success) {
//         res.status(201).json({
//             ...data,
//             code: 201,
//         });
//         } else {
//         res.status(409).json({
//             ...data,
//             code: 409,
//         });
//         }
//     } catch (error: any) {
//         const statusCode = error.output?.statusCode?? 500;
//         const errorMessage = error.message?? "Internal Server Error";
//         res.status(statusCode).json({ error: errorMessage });
//     }

// }

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const status = req.body.status;

        const data = await OrderService.updateOrderStatus(orderId, status as string);

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