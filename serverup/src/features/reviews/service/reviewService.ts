import mongoose from "mongoose";
import ReviewModel, { IReview } from "../models/review";

interface IResponse {
  message: string;
  data?: unknown;
  success: boolean;
}

const response: IResponse = { message: "", success: false };

class ReviewService {
    static async addReview(data: Partial<IReview>): Promise<IResponse> {
        if (!(data.rating || data.comment)) {
            response.message = "Either Rating and comment are required";
            response.success = false;
            response.data = [];
            return response;
        }

        const reviewExist = await ReviewModel.find({ userId: data.userId, productId: data.productId, status:["approved"] });
        if (reviewExist.length > 0) {
            response.message = "Review already exists";
            response.data = [];
            response.success = false;
            return response;
        };
        
        const newReview = new ReviewModel({ ...data });
        await newReview.save();
        response.message = "Review created successfully";
        response.success = true;
        response.data = newReview;
        return response;
    };

    static async getReviews(productId: string): Promise<IResponse> {
        const reviews = await ReviewModel.aggregate([
            {
                $match: {
                productId: new mongoose.Types.ObjectId(productId),
                status: { $in: ["approved"] },
                },
            },
            {
                $lookup: {
                from: "users", 
                localField: "userId",
                foreignField: "_id",
                as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                from: "products", 
                localField: "productId",
                foreignField: "_id",
                as: "product",
                },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                _id: 1,
                rating: 1,
                comment: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                "user._id": 1,
                "user.username": 1,
                "user.profileImage": 1,
                "product._id": 1,
                "product.product_name": 1,
                "product.image": 1,
                },
            },
        ]);
        if (!reviews || reviews.length === 0) { 
            response.message = "No reviews found";
            response.success = false;
            response.data = [];
            return response;
        }
        response.message = "Reviews fetched successfully";
        response.success = true;
        response.data = reviews;
        return response;
    }
}

export default ReviewService;