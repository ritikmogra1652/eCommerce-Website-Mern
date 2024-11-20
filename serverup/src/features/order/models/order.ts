import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IOrderItem extends Document {
  name:string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  userId: ObjectId;
  items: IOrderItem[];
  total: number;
  address: string;
  phone: string;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const OrderItemModel = mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export { OrderModel, OrderItemModel, IOrder, IOrderItem };
