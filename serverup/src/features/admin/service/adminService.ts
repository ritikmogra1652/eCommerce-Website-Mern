  import bcrypt from 'bcryptjs';
  import jwt from "jsonwebtoken";
  import UserModel, { IUsers } from '../../auth/models/user';
  import envConfig from '../../../config/envConfig';
  import { IOrder, IOrderItem, OrderModel } from '../../order/models/order';

  interface IResponse {
    message: string;
    data?: unknown;
    success: boolean;
  }

  const response: IResponse = { message: "", success: false };

  const env = envConfig();
  const secretKey = env.secretKey;

  class AdminService {
      static async adminLogin(data: Partial<IUsers>): Promise<IResponse> {

        const user = await UserModel.findOne({ email: data.email });
        if (!user || user.role !== 'admin') {
          response.message = "Invalid admin email does not exist";
          response.success = false;
          return response;
        }
    
        const isPasswordValid = await bcrypt.compare(data.password!, user.password);
        if (!isPasswordValid) {
          response.message = "Invalid Password";
          response.success = false;
          return response;
        }
    
        const token = jwt.sign({ id: user._id,email:user.email, role: user.role }, secretKey, { expiresIn: '1h' });
        response.message = "Admin Login successful";
        response.success = true;
        response.data = { user, token };
    
        return response;
      }


      static async getAdminProfile(data: Partial<IUsers>): Promise<IResponse> {
        const userExists = await UserModel.findOne({ email: data.email });
      if (!userExists) {
        response.message = "Invalid admin email does not exists";
        response.success = false;
        return response;
      }
      const  userInfo =  {
        admin: userExists.username,
        email: userExists.email,
        phone: userExists.phone,
        profileImage: userExists.profileImage,
      }
        response.message = "admin Profile successful";
        response.success = true;
        response.data = userInfo;
      return response;
    }


    static async getAllOrders(): Promise<IResponse> {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      if (!orders || orders.length === 0) {
        response.message = 'No orders found';
        return response;
      }

      const ordersInfo = orders.map((order: IOrder) => ({
        _id: order._id,
        items: order.items.map((item: IOrderItem) => ({
          product_Id: item.productId,
          quantity: item.quantity,
        })),
        status: order.status,
        createdAt: order.createdAt, // Keep createdAt as Date
      }));

      response.message = 'Fetch orders successful';
      response.success = true;
      response.data = ordersInfo;
      return response;
  }
    }

  export default AdminService;