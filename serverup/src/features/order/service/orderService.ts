import { placeOrder } from '../controller/orderController';
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
            console.log(id);
            
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
}

export default OrderService;
