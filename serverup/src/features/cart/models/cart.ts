import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface ICart extends Document {
  userId: ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Products" },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
  items: { type: [CartItemSchema], required: true },
  totalPrice: { type: Number, required: true },
});

const CartItemModel = mongoose.model<ICartItem>("CartItem", CartItemSchema);
const CartModel = mongoose.model<ICart>("Cart", CartSchema);

export { CartModel, CartItemModel, ICart, ICartItem };
