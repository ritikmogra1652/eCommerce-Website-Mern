import Joi from "joi";
import mongoose from "mongoose";

const reviewValidationSchema = Joi.object({
  rating: Joi.number().min(0).max(5).required(),
  comment: Joi.string().trim(),
  status: Joi.string()
    .valid("approved", "pending", "rejected")
    .default("pending"),
});

export default reviewValidationSchema;
