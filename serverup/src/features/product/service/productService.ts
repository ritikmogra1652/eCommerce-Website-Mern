import { log } from "console";
import envConfig from "../../../config/envConfig";
import ProductModel, { IProduct } from "../models/product";
import { ObjectId } from "mongoose";
import { Workbook } from "exceljs";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import CategoryModel from "../../product_categories/models/category";

interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}
interface QueryParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
}
interface IObjectId {
  product_id: ObjectId;
}
interface ProductData {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}
const response: IResponse = { message: "", success: false };

const env = envConfig();
const secretKey = env.secretKey;

class ProductService {
  static async getProducts({
    page,
    limit,
    search,
    sort,
  }: QueryParams): Promise<IResponse> {
    try {
      let query = {};
      if (search) {
        query = {
          $or: [
            { product_name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        };
      }

      const skip = (page - 1) * limit;
      const totalProducts = await ProductModel.countDocuments(query);

      let sortoption = {};
      if (sort === "lowToHigh") {
        sortoption = { price: 1 };
      } else if (sort === "highToLow") {
        sortoption = { price: -1 };
      }

      const products = await ProductModel.find(query)
        .sort(sortoption)
        .skip(skip)
        .limit(limit);

      if (!products || products.length === 0) {
        response.message = "No Products Found";
        response.success = true;
        response.data = [];
      } else {
        response.success = true;
        response.message = "Products Displayed Successfully";
        response.data = {
          products,
          total: totalProducts,
          page,
          limit,
        };
      }
    } catch (error) {
      response.message = "No Product Found";
    }

    return response;
  }

  static async getProduct(id: string): Promise<IResponse> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        response.message = "No Products Found";
        response.success = true;
        response.data = [];
      } else {
        response.success = true;
        response.message = "Products Displayed Successfully";
        response.data = product;
      }
    } catch (error) {
      response.message = "No Product Found";
    }
    return response;
  }
  static async addProduct(data: Partial<IProduct>): Promise<IResponse> {
    const newProduct = new ProductModel({
      ...data,
    });

    const productExists = await ProductModel.findOne({
      product_name: data.product_name,
    });
    if (productExists) {
      response.message = "Product already exists";
      response.success = false;
      return response;
    }
    await newProduct.save();

    response.message = "Product added successfully";
    response.success = true;
    return response;
  }

  static async updateProduct(
    data: Partial<IProduct & IObjectId>
  ): Promise<IResponse> {
    const productExists = await ProductModel.findOne({ _id: data.product_id });
    if (!productExists) {
      response.message = "Product does not exists";
      response.success = false;
      return response;
    }
    await ProductModel.updateOne({ _id: data.product_id }, { $set: data });

    const updatedProduct = await ProductModel.findOne({
      _id: data.product_id,
    });

    response.message = "Product updated successfully";
    response.success = true;
    response.data = { updatedProduct };
    return response;
  }

  static async exportProducts(req: Request, res: Response) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Products");
    worksheet.columns = [
      { header: "S No.", key: "s_no", width: 15 },
      { header: "Name", key: "product_name", width: 30 },
      { header: "Price", key: "price", width: 15 },
      { header: "Stock", key: "stock", width: 15 },
      { header: "Category", key: "category", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Created At", key: "createdAt", width: 30 },
    ];
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE0B2" }, // Light orange color
      };
    });

    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "productcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          _id: 1,
          product_name: 1,
          price: 1,
          stock: 1,
          description: 1,
          category: { $first: "$category.categoryName" },
          createdAt: 1,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    let count = 1;
    products.forEach((product) => {
      product.s_no = count++;
      worksheet.addRow(product);
    });
    const filePath = path.join(__dirname, "products.xlsx");
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "products.xlsx", (err: any) => {
      if (err) {
        console.error(err);
        response.success = false;
        response.message = "Failed to export products";
      } else {
        response.success = true;
        response.message = "Products exported successfully";
      }
      fs.unlinkSync(filePath); // Remove the file after sending it
    });
  }

  static async exportSampleExcel(req: Request, res: Response) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sample");
    const categories = await CategoryModel.find(
      {},
      { _id: 0, categoryName: 1 }
    );
    const Categories_name: string[] = [];
    categories.forEach((category) => {
      Categories_name.push(category.categoryName);
    });
    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Price", key: "price", width: 15 },
      { header: `Stock`, key: "stock", width: 15 },
      { header: `Category[${Categories_name}]`, key: "category", width: 70 },
      { header: "Description", key: "description", width: 50 },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      (cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "dashDot" },
      }),
        (cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFB0C4DE" },
        });
    });
    const filePath = path.join(__dirname, "products.xlsx");
    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "products.xlsx", (err: any) => {
      if (err) {
        console.error(err);
        response.success = false;
        response.message = "Failed to export products";
      } else {
        response.success = true;
        response.message = "Products exported successfully";
      }
      fs.unlinkSync(filePath);
    });
  }

  static async importExcel(data: ProductData[]) {
    console.log("Data:", data);
    const problematicRows: number[] = [];
    try {
      const categories = await CategoryModel.find({});
      const categoryMap: { [key: string]: string } = {};
      categories.forEach((category) => {
        categoryMap[category.categoryName] = category._id as unknown as string;
      });

      const validateNumber = (
        value: string | number,
        fieldName: string,
        rowIndex: number
      ) => {
        if (isNaN(Number(value))) {
          problematicRows.push(rowIndex);
          return null;
        }
        return Number(value);
      };
      const products = [];
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const { name, price, stock, category, description } = row;
        const validatedPrice = validateNumber(price, "Price", i + 1);
        const validatedQuantity = validateNumber(stock, "Stock", i + 1);
        if (validatedPrice === null || validatedQuantity === null) {
          continue;
        }

        const existingProduct = await ProductModel.findOne({ product_name: name });
          if (existingProduct) {
            problematicRows.push(i + 1);
            continue;
          }

        let category_id = categoryMap[category];
        if (!category_id) {
          const newCategory = await CategoryModel.create({
            name: category,
          });
          category_id = newCategory._id as unknown as string;
          categoryMap[category] = category_id;
        }

        products.push({
          product_name: name,
          price: validatedPrice,
          stock: validatedQuantity,
          images: "",
          category_id,
          description,
          createdAt: new Date(),
        });
      }

      if (products.length > 0) {
        await ProductModel.insertMany(products);
      }

      if (problematicRows.length > 0) {
        response.success = false;
        response.message =
          "There were problems with some rows." +
          problematicRows +
          "others rows were successfully created.";
      } else {
        response.success = true;
        response.message = "Products imported successfully.";
      }
    } catch (error) {
      console.error(error);
      response.success = false;
      response.message = `An error occurred while importing the products: ${error}`;
    }

    return response;
  }
}

export default ProductService;
