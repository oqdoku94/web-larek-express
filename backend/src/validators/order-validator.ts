import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

const orderValidationSchema = Joi.object({
  items: Joi.array().items(Joi.string()).min(1).required(),
  total: Joi.number().positive().required(),
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

const orderValidator = celebrate({ [Segments.BODY]: orderValidationSchema });

export default orderValidator;
