import mongoose, { Document, Schema } from "mongoose";
export interface IReview extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  productId: mongoose.Schema.Types.ObjectId;
  rating: number | 0;
  comment: string | null;
  status: "approved" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
const ReviewSchema: Schema = new Schema<IReview>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
// ReviewSchema.pre("validate", function (next) {
//   if (!this.rating && !this.comment) {
//     next(new Error("At least one of rating or comment must be present"));
//   } else {
//     next();
//   }
// });

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
export default ReviewModel;
