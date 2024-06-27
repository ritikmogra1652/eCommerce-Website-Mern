import mongoose, { ObjectId, Types } from "mongoose";
import { CartItemModel, CartModel, ICart, ICartItem } from "../models/cart";

interface IResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
const response: IResponse = { message: "", success: false };

interface AddToCartBody {
    userId: string;
    productId: string;
    quantity: number;
    price: number;
}
class CartServcie {
    static async addCart(data: AddToCartBody): Promise<IResponse> {
        const userId = new mongoose.Types.ObjectId(data.userId);
        const productId = new mongoose.Types.ObjectId(data.productId);

        let cart = await CartModel.findOne({ userId });
        if (!cart) {
        cart = new CartModel({
            userId,
            items: [],
            totalPrice: 0,
        });
        }
        const existingCartItem = cart.items.find((item) =>
        item.productId.equals(productId)
        );

        if (existingCartItem) {
        existingCartItem.quantity += data.quantity;
        cart.totalPrice += data.quantity * data.price;
        } else {

        const newCartItem: ICartItem = new CartItemModel({
            productId,
            quantity: data.quantity,
            price: data.price,
        });

        cart.items.push(newCartItem);
        cart.totalPrice += data.quantity * data.price;
        }

        await cart.save();

        response.message = "Cart updated successfully";
        response.success = true;
        response.data = cart;

        return response;
    }

    static async getCart(userId:string): Promise<IResponse> {
        const cart = await CartModel.find({userId});

        if (!cart) {
        response.message = "No Products added";
        response.success = false;
        }

        response.message = "Cart Display Successfully";
        response.success = true;
        response.data = cart;
        return response;
    }
}

export default CartServcie;