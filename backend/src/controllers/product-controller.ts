import express, {
  Request, Response, NextFunction,
} from 'express';
import Product, { IProduct } from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import ConflictError from '../errors/conflict-error';

export const getAllProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({}).then((products) => {
    res.send({
      items: products.map((item: IProduct & any) => ({
        image: {
          fileName: item.image.fileName,
          originalName: item.image.originalName,
        },
        _id: item._id,
        title: item.title,
        category: item.category,
        description: item.description,
        price: item.price,
      })),
      total: products.length,
    });
  })
    .catch((err) => {
      const error = new InternalServerError(`Внутреняя ошибка сервера при получении товаров: ${err.message}`);
      next(error);
    });
};

export const createProduct = (req: express.Request, res: express.Response, next: NextFunction) => {
  Product.create({
    title: req.body.title,
    image: {
      fileName: req.body.image.fileName,
      originalName: req.body.image.originalName,
    },
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
  }).then((product) => res.status(201).send(
    {
      image: {
        fileName: product.image.fileName,
        originalName: product.image.originalName,
      },
      _id: product._id,
      title: product.title,
      category: product.category,
      description: product.description,
      price: product.price,
    },
  ))
    .catch((err) => {
      let error = new InternalServerError(`Внутреняя ошибка сервера при создании товара: ${err.message}`);

      if (err instanceof Error && err.message.includes('E11000')) {
        error = new ConflictError(err.message);
      }
      next(error);
    });
};
