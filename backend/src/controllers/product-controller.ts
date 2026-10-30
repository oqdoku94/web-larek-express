import express, {
  Request, Response, NextFunction,
} from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import ConflictError from '../errors/conflict-error';
import { moveToShareDirectory } from '../middlewares/file';
import { imagePath } from './upload-controller';
import NotFoundError from '../errors/not-found-error';

export const getAllProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find({}).then((products) => {
    res.send({
      items: products,
      total: products.length,
    });
  })
    .catch((err) => {
      const error = new InternalServerError(`Внутреняя ошибка сервера при получении товаров: ${err.message}`);
      next(error);
    });
};

export const createProduct = (req: express.Request, res: express.Response, next: NextFunction) => {
  moveToShareDirectory(req.body.image.fileName, imagePath);
  Product.create(req.body)
    .then((product) => res.status(201).send(product))
    .catch((err) => {
      let error = new InternalServerError(`Внутреняя ошибка сервера при создании товара: ${err.message}`);

      if (err instanceof Error && err.message.includes('E11000')) {
        error = new ConflictError(err.message);
      }
      next(error);
    });
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.image && req.body.image.fileName) {
    moveToShareDirectory(req.body.image.fileName, imagePath);
  }

  const { productId } = req.params;

  return Product.findByIdAndUpdate(
    productId,
    { $set: req.body },
    {
      new: true, runValidators: true,
    },
  )
    .then((product) => {
      if (!product) {
        next(new NotFoundError('Товар не найден.'));
        return;
      }

      res.send(product);
    })
    .catch((err) => {
      const error = new InternalServerError(`Внутреняя ошибка сервера при изменении товара: ${err.message}`);
      next(error);
    });
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  return Product.findByIdAndDelete(productId).then((product) => {
    if (!product) {
      next(new NotFoundError('Товар не найден.'));
      return;
    }

    res.send(product);
  });
};
