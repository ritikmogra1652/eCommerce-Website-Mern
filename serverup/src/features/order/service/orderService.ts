import mongoose from "mongoose";

import { IOrder, OrderModel } from "../models/order";
import { Response } from "express";
import ProductModel from "../../product/models/product";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51QNoyMLUUdEwqEnJK4e5AQ2xEAsFjuGxSuQbHPy7ViUKfpH1U6QLQdxhLDcwsoCjXaOMyBNFTT9hWZRHAhoRPIvE00xeiBqYVO",
  { apiVersion: "2022-11-15" as Stripe.LatestApiVersion }
);
interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}

const response: IResponse = { message: "", success: false };

class OrderService {
  static async placeOrder(data: IOrder, userId: string): Promise<IResponse> {
    
    const response: IResponse = { message: "", success: false };

    try {
      // Validate product availability
      for (const item of data.items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          response.message = `Product with ID ${item.productId} not found.`;
          return response;
        }
        if (product.stock < item.quantity) {
          response.message = `Not enough stock for product: ${product.product_name}.`;
          return response;
        }
      }

      // // Prepare line items for Stripe Checkout Session


      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: await Promise.all(
          data.items.map(async (item) => {
            const product = await ProductModel.findById(item.productId);
            if (!product) {
              throw new Error(`Product with ID ${item.productId} not found`);
            }

            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: product.product_name, // Product name from the database
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects smallest currency unit
              },
              quantity: item.quantity,
            };
          })
        ),
        mode: "payment",
        success_url: `http://localhost:5173`,
        cancel_url: `http://localhost:5173/myprofile`,
      });

      //  res.json({ success: true, sessionId: session.id });

      // Response with session ID for frontend
      response.success = true;
      response.data = {
        sessionId: session.id,
      };
      response.message =
        "Checkout session created successfully. Redirect to payment.";
    } catch (error: any) {
      response.success = false;
      response.message = error.message || "Failed to create checkout session.";
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
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "ProductDetails",
          },
        },
        { $unwind: "$ProductDetails" },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "UserDetails",
          },
        },
        { $unwind: "$UserDetails" },
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
        { $sort: { createdAt: -1 } },
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

  static async updateOrderStatus(
    orderId: string,
    status: "Pending" | "Shipped" | "Delivered"
  ): Promise<IResponse> {
    const response: IResponse = { message: "", success: false };
    const allowedStatuses = ["Pending", "Shipped", "Delivered"];
    try {
      if (!allowedStatuses.includes(status)) {
        response.message = "Invalid status: " + status;
        return response;
      }

      const order = await OrderModel.findById(orderId);
      if (!order) {
        response.message = "Order not found";
        return response;
      }

      const currentStatus = order.status;
      if (
        (currentStatus === "Shipped" && status === "Pending") ||
        (currentStatus === "Delivered" && status !== "Delivered")
      ) {
        response.message = "Invalid status transition";
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
