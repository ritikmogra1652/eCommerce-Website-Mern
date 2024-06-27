
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IProduct extends Document {
    product_name: string;
    description: string;
    category_id: ObjectId;
    price: number;
    image: string;
    stock: number;
    createdAt: Date;
}

const ProductsSchema: Schema = new Schema({
    product_name: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, required: true, ref:'productscategories'},
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ProductModel =  mongoose.model<IProduct>("Product", ProductsSchema);


export default ProductModel