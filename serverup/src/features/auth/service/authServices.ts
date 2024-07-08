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

class AuthService {
  static async register(data: Partial<IUsers>): Promise<IResponse> {
    const userExists = await UserModel.findOne({ email: data.email });
    if (userExists) {
      return {
        message: "User Already Exist",
        success: false,
      };
    }
    const hashedpassword = await bcrypt.hash(data.password!, 8);
    const newUser = new UserModel({
      ...data,
      password: hashedpassword,
    });

    await newUser.save();

    response.message = "User created successfully";
    response.success = true;
    return response;
  }

  static async login(data: Partial<IUsers>): Promise<IResponse> {
    const userExists = await UserModel.findOne(
      { email: data.email },
      { _id: 1, __v: 0 }
    );
    if (!userExists || userExists.role !== "user") {
      response.message = "Invalid email does not exist";
      response.success = false;
      return response;
    }

    const isValidPassword = await bcrypt.compare(
      data.password!,
      userExists.password
    );

    if (!isValidPassword) {
      response.message = "Invalid Password";
      response.success = false;
      response.data = [];
      return response;
    }
    const token = jwt.sign(
      {
        email: userExists.email,
        userId: userExists._id,
        role: userExists.role,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    response.message = "User Login successful";
    response.success = true;
    response.data = { userExists, token };
    return response;
  }

  static async getProfile(data: Partial<IUsers>): Promise<IResponse> {
    const userExists = await UserModel.findOne(
      { email: data.email },
      { password: 0 }
    );

    if (!userExists) {
      response.message = "Invalid User email does not exists";
      response.success = false;
      response.data = [];
      return response;
    }
    response.message = "User Profile successful";
    response.success = true;
    response.data = userExists;
    return response;
  }

  static async updateProfile(
    email: string,
    data: Partial<IUsers>
  ): Promise<IResponse> {
    try {
      const userExist = await UserModel.findOne({ email });

      if (!userExist) {
        response.message = "Invalid User: email does not exist";
        response.success = false;
        return response;
      }

      userExist.username = data.username || userExist.username;
      userExist.phone = data.phone || userExist.phone;
      userExist.profileImage = data.profileImage || userExist.profileImage;

      await userExist.save();

      // await UserModel.updateOne({ email }, { $set: data });
      // const updatedUser = await UserModel.findOne(
      //   { email },
      //   { password: 0 }
      // );

      response.message = "User Profile successful";
      response.success = true;
      response.data = {
        username: userExist.username,
        phone: userExist.phone,
        profileImage: userExist.profileImage,
      };
    } catch (error) {
      response.message = "An error occurred while updating the profile";
      console.error("Error updating profile:", error);
    }

    return response;
  }

  static async updatePassword(
    email: string,
    data: Partial<IUsers>
  ): Promise<IResponse> {
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      response.message = "Invalid User email does not exists";
      response.success = false;
      return response;
    }
    if (data.password) {
      userExists.password = await bcrypt.hash(data.password!, 8);
    }

    await userExists.save();
    response.message = "User Password Updated Successfully";
    response.success = true;
    response.data = [];
    return response;
  }
}

export default AuthService;