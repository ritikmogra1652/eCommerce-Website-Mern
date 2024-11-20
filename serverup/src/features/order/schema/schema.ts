import Joi from "joi";

const orderItemSchema = Joi.object({
    name: Joi.string(),
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().required(),
});

const orderRequestSchema = Joi.object({
    items: Joi.array().items(orderItemSchema).required(),
    total: Joi.number().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
});

export default orderRequestSchema;
