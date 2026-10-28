import {
  NextFunction, Request, Response,
} from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';
import InternalServerError from '../errors/internal-server-error';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from '../middlewares/auth';

const signIn = async (user: any, res: Response) => {
  const accessToken = jwt.sign(
    { _id: user._id },
    JWT_ACCESS_SECRET_KEY,
    { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m' } as SignOptions,
  );
  const refreshToken = jwt.sign(
    { _id: user._id },
    JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d' } as SignOptions,
  );

  res.cookie('refreshToken', refreshToken, {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: ms((process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d') as StringValue),
    path: '/',
  });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $push: { tokens: { token: refreshToken } } },
    { new: true },
  );

  if (!updatedUser) {
    throw new InternalServerError('Ошибка при добавления токена доступа пользователю.');
  }

  return {
    accessToken,
    refreshToken,
    user: updatedUser,
  };
};

const authenticate = async (email: string, password: string, res: Response) => {
  const user = await User.findUserByCredentials(email, password);
  return signIn(user, res);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authenticate(email, password, res);
    res.send({
      user: result.user,
      success: true,
      accessToken: result.accessToken,
    });
  } catch (err: any) {
    next(new UnauthorizedError(err.message));
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hash,
    });

    const result = await authenticate(email, password, res);
    res.send({
      user: result.user,
      success: true,
      accessToken: result.accessToken,
    });
  } catch (err: any) {
    let error = new InternalServerError(`Внутреняя ошибка сервера при создании пользователя: ${err.message}`);

    if (err instanceof Error && err.message.includes('E11000')) {
      error = new ConflictError(err.message);
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    next(new BadRequestError('Необходимо авторизоваться.'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY) as { _id: string };
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться.'));
    return;
  }

  const user = await User.findByIdAndUpdate(payload._id, {
    $pull:
      { tokens: { token: refreshToken } },
  }, { new: true });

  if (!user) {
    next(new NotFoundError('Пользователь не найден.'));
    return;
  }

  res.clearCookie('refreshToken', {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  res.send({ success: true });
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    next(new UnauthorizedError('Необходимо авторизоваться.'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY) as { _id: string };
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться.'));
    return;
  }

  const user = await User.findById(payload._id).select('+tokens');

  if (!user) {
    next(new UnauthorizedError('Пользователь не найден.'));
    return;
  }

  if (!user.tokens.find((item) => item.token === refreshToken)) {
    next(new UnauthorizedError('Необходимо авторизоваться.'));
    return;
  }

  const result = await signIn(user, res);
  res.send({
    user: result.user,
    success: true,
    accessToken: result.accessToken,
  });
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
    return;
  }
  const accessToken = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY) as { _id: string };
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться.'));
    return;
  }

  const user = await User.findById(payload._id);

  if (!user) {
    next(new NotFoundError('Пользователь не найден.'));
    return;
  }

  res.send({ user });
};
