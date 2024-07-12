import Joi from "joi";


const ImagesSchema = Joi.object({
  imageUrl: Joi.string().required()
})

export const productSchema = Joi.object({
  product_name: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(ImagesSchema).default(""),
  stock: Joi.number().min(0).required(),
  createdAt: Joi.date().default(Date.now),
});
