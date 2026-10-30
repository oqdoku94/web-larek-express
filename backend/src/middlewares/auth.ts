import jwt from 'jsonwebtoken';
import {
  Request, Response, NextFunction,
} from 'express';
import UnauthorizedError from '../errors/unauthorized-error';

export const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY || 'sTrOngSeCrEtKey19934y21nkjvs';
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || '@JIOFNI@*&IUbIU!ijBa32SA4duy1';

export default (req: Request & any, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_ACCESS_SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация.'));
    return;
  }

  req.user = payload;
  next();
};
