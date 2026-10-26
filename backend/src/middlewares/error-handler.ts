import {
  Request, Response, NextFunction,
} from 'express';
import StatusError from '../errors/status-error';

const errorHandler = (err: StatusError, _req: Request, res:Response, _next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).send({ message: err.message });
};

export default errorHandler;
