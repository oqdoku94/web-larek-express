import {
  isEmpty, isLength,
} from 'validator';
import { NextFunction, Request, Response } from 'express';
import { IProduct } from '../models/product';
import BadRequestError from '../errors/BadRequestError';

const validateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const product : IProduct = req.body;

  if (!product.title || isEmpty(product.title)) {
    next(new BadRequestError('Title обязателен для заполнения.'));
  }

  if (!isLength(product.title, { min: 2, max: 30 })) {
    next(new BadRequestError('title должен быть больше 2 и меньше 30 символов.'));
  }

  if (!product.image.fileName || isEmpty(product.image.fileName)) {
    next(new BadRequestError('image.fileName обязателен для заполнения.'));
  }

  if (!product.image.originalName || isEmpty(product.image.originalName)) {
    next(new BadRequestError('image.originalName обязателен для заполнения.'));
  }

  if (!product.category || isEmpty(product.category)) {
    next(new BadRequestError('category обязателен для заполнения.'));
  }

  next();
};

export default validateProduct;
