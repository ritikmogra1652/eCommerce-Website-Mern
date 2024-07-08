import Joi from "joi";

export const categorySchema = Joi.object({
    categoryName:Joi.string().required().min(3).max(30),
});