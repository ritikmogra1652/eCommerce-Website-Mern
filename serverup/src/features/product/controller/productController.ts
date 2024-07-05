import { Request, Response } from "express";
import ProductService from "../service/productService";

export const addProduct = async (req: Request, res: Response) => {
    try {
    const body = {
        ...req.body,
    };

    const data = await ProductService.addProduct(body);
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

export const getProducts = async (req: Request, res: Response) => {
    try {
    const { page = 1, limit = 10, search = ''} = req.query;
    const data = await ProductService.getProducts({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search:search as string
    });
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

export const getProduct = async (req: Request, res: Response) => {
  try {
    const  id = req.params.id;
    const data = await ProductService.getProduct(id as string);
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

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const body = {
        product_id: req.params.id,
        ...req.body,
    };

    const data = await ProductService.updateProduct(body);
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


