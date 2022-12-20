import Joi from 'joi';

export const authLoginSchema = {
  email: Joi.string().email().label('Email').required(),
  password: Joi.string().label('Password').required(),
};

export const loginSchema = Joi.object({
  ...authLoginSchema,
}).options({
  abortEarly: false,
});

export const registerUserSchema = Joi.object({
  ...authLoginSchema,
  name: Joi.string().label('Name'),
}).options({
  abortEarly: false,
});
