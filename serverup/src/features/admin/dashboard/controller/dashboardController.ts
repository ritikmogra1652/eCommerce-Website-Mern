import { Request, Response } from "express";
import DashboardService from "../service/dashboardService";

export const totalSales = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.totalSales();
        if (data.success) {
        res.status(201).json({
            ...data,
            code: 201,
        });
        } else {
        res.status(400).json({
            ...data,
            code: 400,
        });
        }
    } catch (err) {
        res.status(500).json({
        message: "Internal Server Error",
        code: 500,
        });
    }
};


export const totalProducts = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.totalProducts();
        if (data.success) {
            res.status(201).json({
                ...data,
                code: 201,
            });
        } else {
            res.status(400).json({
                ...data,
                code: 400,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            code: 500,
        });
    }
}

export const totalUsers = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.totalUsers();
        if (data.success) {
            res.status(201).json({
                ...data,
                code: 201,
            });
        } else {
            res.status(400).json({
                ...data,
                code: 400,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            code: 500,
        });
    }
}

export const totalOrders = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.totalOrders();
        if (data.success) {
            res.status(201).json({
                ...data,
                code: 201,
            });
        } else {
            res.status(400).json({
                ...data,
                code: 400,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            code: 500,
        });
    }
}

export const topProducts = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.topProducts();
        if (data.success) {
            res.status(201).json({
                ...data,
                code: 201,
            });
        } else {
            res.status(400).json({
                ...data,
                code: 400,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            code: 500,
        });
    }
}

export const topCustomers = async (req: Request, res: Response) => {
    try {
        const data = await DashboardService.topCustomers();
        if (data.success) {
            res.status(201).json({
                ...data,
                code: 201,
            });
        } else {
            res.status(400).json({
                ...data,
                code: 400,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            code: 500,
        });
    }
}