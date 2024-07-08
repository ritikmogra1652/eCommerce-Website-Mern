import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

export interface ICategory extends Document {
  categoryName: string;
  createdAt: Date;
}

const CategorySchema: Schema = new Schema({
  categoryName: { type: String, required: true,unique: true },
  createdAt: { type: Date, default: Date.now },
});

const CategoryModel = mongoose.model<ICategory>("ProductCategories", CategorySchema);


export default CategoryModel;