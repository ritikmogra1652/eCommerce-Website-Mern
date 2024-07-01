import mongoose from 'mongoose';
import UserModel from '../../auth/models/user';
// import { placeOrder } from '../controller/orderController';
import { IOrder, OrderModel } from '../models/order';
    interface IResponse {
    message: string;
    data?: unknown;
    success: boolean;
    }

const response: IResponse = { message: "", success: false };

    class OrderService {
        static async placeOrder(data: Partial<IOrder>, id: string): Promise<IResponse> {
        
        try {
        const newOrder = new OrderModel({
            ...data,
            userId: id,  
        });
            const savedOrder = await newOrder.save();
        response.success = true;
        response.data = savedOrder;
        response.message = "Order placed successfully";
        } catch (error:any) {
        response.success = false;
        response.message = error.message;
        }

        return response;
    }

    static async getOrder(userId:string): Promise<IResponse> {
        
        const orders = await OrderModel.find({ userId }).exec();

        if (!orders) {
        response.message = "No Order added";
        response.success = false;
        }

        response.message = "Order Display Successfully";
        response.success = true;
        response.data = orders;
        return response;
    }
}

export default OrderService;
