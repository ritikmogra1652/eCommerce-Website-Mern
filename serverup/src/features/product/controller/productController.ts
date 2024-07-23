import { Request, Response } from "express";
import ProductService from "../service/productService";
import ExcelJS from "exceljs";


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
    const { page = 1, limit = 10, search = '', sort = ''} = req.query;
    const data = await ProductService.getProducts({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        sort: sort as string,
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

export const exportProducts = async (req: Request, res: Response) => {
    try {
      const data = await ProductService.exportProducts(req, res);

    } catch (error: any) {
      const statusCode = error.output?.statusCode ?? 500;
      const errorMessage = error.message ?? "Internal Server Error";
      res.status(statusCode).json({ error: errorMessage });
  }
};

export const exportSampleExcel = async (req: Request, res: Response) => {
  try {
    const data = await ProductService.exportSampleExcel(req, res);
  } catch (error: any) {
    const statusCode = error.output?.statusCode ?? 500;
    const errorMessage = error.message ?? "Internal Server Error";
    res.status(statusCode).json({ error: errorMessage });
  }
};

export const importExcel = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const file = req.file;
    console.log("File received:", file);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(file.buffer); // Use buffer instead of reading from disk
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        return res
          .status(400)
          .json({
            success: false,
            message: "No worksheet found in the Excel file",
          });
      }
      const expectedHeaders = ["Name", "Price", "Stock", "Category", "Description"];
      const headerRow = worksheet.getRow(1);

      if (!headerRow || !Array.isArray(headerRow.values)) {
        return res.status(200).json({
          success: false,
          message: "Invalid headers. Expected headers are: " + expectedHeaders.join(", "),
        });
      }

      const actualHeaders = headerRow.values
        .slice(1)
        .map((value) =>
          typeof value === "string"
            ? value.trim().toLowerCase()
            : value?.toString().toLowerCase() ?? ""
        );
      const headersMatch = expectedHeaders.every((expectedHeader) => {
        const expectedNormalized = expectedHeader.toLowerCase();
        return actualHeaders.some((actualHeader) =>
          actualHeader.includes(expectedNormalized)
        );
      });

      if (!headersMatch) {
        return res.status(200).json({
          success: false,
          message: `Invalid headers. Expected headers to contain: ${expectedHeaders.join(
            ", "
          )}, but found: ${actualHeaders.join(", ")}`,
        });
      }
      const data: any[] = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Skip header row
          const rowData = {
            name: row.getCell(1).value,
            price: row.getCell(2).value,
            stock: row.getCell(3).value,
            category: row.getCell(4).value,
            description: row.getCell(5).value,
          };
          data.push(rowData);
        }
      });

      const result = await ProductService.importExcel(data);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error loading Excel file:", error);
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid Excel file format or corrupted file",
        });
    }
  } catch (error:any) {
    res.status(400).json(error);
    
  }
};


