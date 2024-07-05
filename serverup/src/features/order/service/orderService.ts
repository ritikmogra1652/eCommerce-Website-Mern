import mongoose from "mongoose";

import { IOrder, OrderModel } from "../models/order";
interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}

const response: IResponse = { message: "", success: false };

class OrderService {
    static async placeOrder(
        data: Partial<IOrder>,
        id: string
    ): Promise<IResponse> {
        try {
            const newOrder = new OrderModel({
                ...data,
                userId: id,
            });
            const savedOrder = await newOrder.save();
            response.success = true;
            response.data = savedOrder;
            response.message = "Order placed successfully";
        } catch (error: any) {
            response.success = false;
            response.message = error.message;
        }

        return response;
    }

    static async getOrder(userId: string): Promise<IResponse> {
        const response: IResponse = { message: "", success: false };

        try {
          const orders = await OrderModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
              {
                $lookup: {
                  from: "products",
                  localField: "items.productId",
                  foreignField: "_id",
                  as: "ProductDetails",
                },
              },
              {
                $unwind: "$items",
              },
              {
                $lookup: {
                  from: "products",
                  localField: "items.productId",
                  foreignField: "_id",
                  as: "ProductDetails",
                },
              },
              {
                $unwind: "$ProductDetails",
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "UserDetails",
                },
              },
              {
                $unwind: "$UserDetails",
              },
              {
                $project: {
                  _id: 1,
                  items: {
                    _id: "$items._id",
                    productId: "$items.productId",
                    product_name: "$ProductDetails.product_name",
                    image: "$ProductDetails.image",
                    quantity: "$items.quantity",
                    price: "$items.price",
                  },
                  total: 1,
                  address: 1,
                  phone: 1,
                  status: 1,
                  createdAt: 1,
                  updatedAt: {
                    $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
                  },
                  username: "$UserDetails.username",
                },
              },
              {
                $group: {
                  _id: "$_id",
                  items: { $push: "$items" },
                  total: { $first: "$total" },
                  address: { $first: "$address" },
                  phone: { $first: "$phone" },
                  status: { $first: "$status" },
                  createdAt: { $first: "$createdAt" },
                  updatedAt: { $first: "$updatedAt" },
                  username: { $first: "$username" },
                },
              },
              {
                $sort: {
                  createdAt: -1,
                },
              },

          ]);
            
            if (orders.length === 0) {
                response.message = "No orders found for the user";
                response.success = true;
            } else {
                response.message = "Orders fetched successfully";
                response.success = true;
                response.data = orders;
            }
        } catch (error: any) {
            response.message = error.message;
            response.success = false;
        }

        return response;
    }


}
export default OrderService;
