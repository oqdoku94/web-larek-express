import { Request, Response, NextFunction } from 'express';
import { isEmail, isMobilePhone, isEmpty, matches } from 'validator';
import { IOrder } from '../models/order';
import BadRequestError from '../errors/BadRequestError';

const validateOrder = (req: Request, _res: Response, next: NextFunction) => {
  const order : IOrder = req.body;

  if (!order.items || order.items.length === 0) {
    next(new BadRequestError('Отсутствуют товары.'));
  }

  if (order.total <= 0) {
    next(new BadRequestError('Отсутствует общая сумма заказа.'));
  }

  if (isEmpty(order.payment) || (order.payment !== 'card' && order.payment !== 'online')) {
    next(new BadRequestError('Неизвестный способ оплаты.'));
  }

  if (!isEmail(order.email)) {
    next(new BadRequestError('Адрес электронной почты имеет неверный формат.'));
  }

  if (!isMobilePhone(order.phone, 'ru-RU') && !matches(order.phone, /^(?:\+7|8)\d{10}$/)) {
    next(new BadRequestError('Телефон имеет неверный формат.'));
  }

  if (isEmpty(order.address)) {
    next(new BadRequestError('Отсутствует адрес.'));
  }

  next();
};

export default validateOrder;
