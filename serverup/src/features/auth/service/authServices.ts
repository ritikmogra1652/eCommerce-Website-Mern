import UserModel, { IUsers } from "../models/user";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import envConfig from "../../../config/envConfig";

interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}



const response: IResponse = { message: "", success: false };

const env = envConfig();
const secretKey = env.secretKey;

class AuthService{
    static async register(data: Partial<IUsers>): Promise<IResponse>{
        const userExists = await UserModel.findOne({ email: data.email });
        if (userExists) {
            return {
                message: "User Already Exist",
                success:false
            }
        }
        const hashedpassword = await bcrypt.hash(data.password!, 8);
        const newUser = new UserModel({
            ...data,
            password: hashedpassword,
        });

        await newUser.save();

        response.message = "User created successfully";
        response.success = true;
        console.log(response);

        return response;

    }


    static async login(data: Partial<IUsers>): Promise<IResponse>{
        const userExists = await UserModel.findOne(
        { email: data.email },
        { _id: 1, __v: 0 }
        );
        if (!userExists) {
            response.message = "Invalid User email does not exists";
            response.success = false;
            return response;
        }

        const isValidPassword = await bcrypt.compare(
            data.password!,
            userExists.password
        );

        console.log(userExists.password);
        if (!isValidPassword) {
            response.message = "Invalid Password";
            response.success = false;
            return response;
        }
        const token = jwt.sign({ email: userExists.email , userId:userExists._id, role:userExists.role}, secretKey, {
            expiresIn: "1h",
        });

        response.message = "User Login successful";
        response.success = true;
        response.data = { userExists, token };
        return response;
    }

}

export default AuthService;