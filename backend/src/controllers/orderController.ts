import {
  NextFunction, Request, Response,
} from 'express';
import { faker } from '@faker-js/faker';
import { IOrder } from '../models/order';
import Product from '../models/product';
import BadRequestError from '../errors/BadRequestError';

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  const order: IOrder = req.body;

  Product.find({ _id: { $in: order.items } })
    .then((products) => {
      if (products.length !== order.items.length) {
        throw new BadRequestError('Один или более товаров не найдены.');
      }

      const totalPrice = products.reduce((total, product) => {
        if (!product.price) {
          throw new BadRequestError(`Товар с идентификатором ${product._id} не продается. Price = ${product.price}.`);
        }

        return total + product.price;
      }, 0);

      if (order.total !== totalPrice) {
        throw new BadRequestError('Некорректная сумма заказа.');
      }

      res.status(200).send({
        id: faker.string.uuid(),
        total: totalPrice,
      });
    })
    .catch(next);
};

export default createOrder;
