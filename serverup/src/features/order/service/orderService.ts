import mongoose from "mongoose";

import { IOrder, OrderModel } from "../models/order";
import { Response } from 'express';
import ProductModel from "../../product/models/product";
interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}

const response: IResponse = { message: "", success: false };

class OrderService {
    static async placeOrder(
        data: IOrder,
        id: string
    ): Promise<IResponse> {
        try {
          // Check inventory
          for (const item of data.items) {
            const product = await ProductModel.findById(item.productId);
            if (!product) {
              response.message = `Product with ID ${item.productId} not found`;
              return response;
            }
            if (product.stock < item.quantity) {
              response.message = `Not enough stock for product ${product.product_name}`;
              response.success = false;
              return response;
            }
          }


          for (const item of data.items) {
            await ProductModel.findByIdAndUpdate(item.productId, {
              $inc: { stock: -item.quantity },
            });
          }

          // Create order
          const newOrder = new OrderModel({
            ...data,
            userId:id,
            status: "Pending",
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
                    images: "$ProductDetails.images",
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
  

  static async updateOrderStatus(orderId: string, status: 'Pending' | 'Shipped' | 'Delivered'): Promise<IResponse> {
    const allowedStatuses = ["Pending", "Shipped", "Delivered"];
    try {


      if (!allowedStatuses.includes(status)) {
        response.message = "invalid status: " + status;
        response.success = false;
        return response;
        }
        const order = await OrderModel.findById(orderId);

        if (!order) {
          response.message = "Order not found";
          response.success = false;
          return response;
        }
        const currentStatus = order.status;
        if (
          (currentStatus === "Shipped" && status === "Pending") ||
          (currentStatus === "Delivered" && status !== "Delivered")
        ) {
          response.message = "Invalid status transition";
          response.success = false;
          return response;
        }

        
        order.status = status;
        await order.save();
      response.message = "Order status updated successfully";
      response.success = true;
      response.data = order;
    } catch (error: any) {
      response.message = error.message;
      response.success = false;
    }
    return response;  
  }




}
export default OrderService;
