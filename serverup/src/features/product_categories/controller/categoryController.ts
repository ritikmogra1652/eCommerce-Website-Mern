import { Request, Response } from "express";
import CategoryService from "../service/categoryService";



export const addCategory = async (req: Request, res: Response) => {
    try {
        const body = {
        ...req.body,
        };

        const data = await CategoryService.addCategory(body);

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

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.getAllCategories();
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