import Joi from "joi";
import mongoose from "mongoose";
const meetingValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": `"userId" should be a type of 'text'`,
    "string.empty": `"userId" cannot be an empty field`,
    "any.required": `"userId" is a required field`,
  }),
  topic: Joi.string().required().messages({
    "string.base": `"topic" should be a type of 'text'`,
    "string.empty": `"topic" cannot be an empty field`,
    "any.required": `"topic" is a required field`,
  }),
  start_time: Joi.date().required().messages({
    "date.base": `"start_time" should be a valid date`,
    "any.required": `"start_time" is a required field`,
  }),
  duration: Joi.number().required().messages({
    "number.base": `"duration" should be a type of 'number'`,
    "any.required": `"duration" is a required field`,
  }),
});
export default meetingValidationSchema;
