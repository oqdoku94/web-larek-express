import {
  NextFunction, Request, Response,
} from 'express';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import UnauthorizedError from '../errors/unauthorized-error';

const signIn = (email: string, password: string, res: Response) => User.findUserByCredentials(email, password)
  .then((user: any) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET_KEY ?? 'sTrOngSeCrEtKey19934y21nkjvs');
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET_KEY ?? '@JIOFNI@*&IUbIU!ijBa32SA4duy1');

    res.cookie('refreshToken', refreshToken, {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: ms((process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d') as StringValue),
      path: '/',
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  });

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  signIn(email, password, res)
    .then((result) => {
      res.send({
        user: {
          email: result.user.email,
          name: result.user.name,
        },
        success: true,
        accessToken: result.accessToken,
      });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: any) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      signIn(email, password, res)
        .then((result) => {
          res.send({
            user: {
              email: result.user.email,
              name: result.user.name,
            },
            success: true,
            accessToken: result.accessToken,
          });
        });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
