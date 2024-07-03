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
      const orders = await OrderModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $group: {
            _id: "$_id",
            userName: {
              $first: "$userDetails.username",
            },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            total: { $first: "$total" },
            products: {
              $push: {
                product_name: "$productDetails.product_name",
                product_quantity: "$items.quantity",
                product_price: "$items.price",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            order_id: "$_id",
            user_name: "$userName",
            products: 1,
            status: 1,
            created_at: "$createdAt",
            total: 1,
          },
        },
        {
          $sort: {
            created_at: -1, 
          },
        },
      ]);

      if (!orders || orders.length === 0) {
        response.message = 'No orders found';
        response.success = false;
        return response;
      }

      response.message = 'Fetch orders successful';
      response.success = true;
      response.data = orders;
      return response;
  }
    }

  export default AdminService;