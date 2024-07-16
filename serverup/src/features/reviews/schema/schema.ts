import Joi from "joi";
import mongoose from "mongoose";

const reviewValidationSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().trim().optional(),
  status: Joi.string()
    .valid("approved", "pending", "rejected")
    .default("pending"),
});

export default reviewValidationSchema;
