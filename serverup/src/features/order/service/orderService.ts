import mongoose from "mongoose";
import UserModel from "../../auth/models/user";
// import { placeOrder } from '../controller/orderController';
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
                { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match orders for the given userId
                {
                    $lookup: {
                        from: "products",
                        localField: "items.productId",
                        foreignField: "_id",
                        as: "items",
                    },
                },
                {
                    $unwind: "$items",
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        _id: 1,
                        items: {
                            _id: "$items._id",
                            product_name: "$items.product_name",
                            image: "$items.image",
                            price: 1,
                        },
                        total: 1,
                        address: 1,
                        phone: 1,
                        status: 1,
                        createdAt: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        updatedAt: {
                            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
                        },
                        username: "$user.username",
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
            ]);

            if (orders.length === 0) {
                response.message = "No orders found for the user";
                response.success = false;
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
