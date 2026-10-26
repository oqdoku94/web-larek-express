import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

const loginValidatorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginValidator = celebrate({ [Segments.BODY]: loginValidatorSchema });

const registerValidatorSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerValidator = celebrate({ [Segments.BODY]: registerValidatorSchema });

