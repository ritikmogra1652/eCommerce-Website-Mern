import Joi from "joi";


export const signUpSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    phone: Joi.string().length(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp ('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{5,}$')).required().
    messages
        ({    
        'string.min':'Password must be at least 8 characters long',    
        'string.pattern.base':'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',    
        'string.empty': 'Password is required',
        }),
    profileImage:Joi.string().required()
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "string.empty": "Password is required",
  }),
});
