import Joi from 'joi';

export const zoomAccessTokenSchema = Joi.object({
  code: Joi.string().required().label('User code'),
}).options({
  abortEarly: false,
});
