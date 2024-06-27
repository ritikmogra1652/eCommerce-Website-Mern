import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUsers extends Document {
  username: string;
  phone: string;
  email: string;
  role: string;
  password: string;
  profileImage: string;
  createdAt: Date;
}

const UsersSchema: Schema<IUsers> = new Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUsers>("Users", UsersSchema);

export default UserModel;
