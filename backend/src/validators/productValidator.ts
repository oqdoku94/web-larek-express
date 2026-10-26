import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

const productValidationSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  description: Joi.string(),
  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  price: Joi.number(),
});

const productValidator = celebrate({ [Segments.BODY]: productValidationSchema });

export default productValidator;
