import {
  Request, Response, NextFunction,
} from 'express';
import StatusError from '../errors/StatusError';

const errorHandler = (err: StatusError, _req: Request, res:Response, _next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({ message: err.message });
};

export default errorHandler;
