import Joi from "joi";

export const productSchema = Joi.object({
  product_name: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  price: Joi.number().min(0).required(),
  image: Joi.string().default(""),
  stock: Joi.number().min(0).required(),
  createdAt: Joi.date().default(Date.now),
});
