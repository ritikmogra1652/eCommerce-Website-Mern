import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import envConfig from "../../../config/envConfig";
import ProductModel,{IProduct} from '../models/product';
import { ObjectId } from "mongoose";

interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}
interface QueryParams{
  page: number,
  limit: number,
  search?: string
}
interface IObjectId {
    product_id: ObjectId;
}
const response: IResponse = { message: "", success: false };

const env = envConfig();
const secretKey = env.secretKey;

class ProductService {
  static async getProducts({
    page,
    limit,
    search,
  }: QueryParams): Promise<IResponse> {
    const response: IResponse = {
      success: false,
      message: "",
      data: null,
    };

    try {
      let query: any = {};
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
      const products = await ProductModel.find(query).skip(skip).limit(limit);

      if (!products || products.length === 0) {
        response.message = "No Products Found";
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
  static async addProduct(data: Partial<IProduct>): Promise<IResponse> {
    const newProduct = new ProductModel({
      ...data,
    });
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
    console.log(updatedProduct);

    response.message = "Product updated successfully";
    response.success = true;
    response.data = { updatedProduct };
    return response;
  }
}

export default ProductService;