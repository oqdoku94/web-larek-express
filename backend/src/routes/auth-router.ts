import express from 'express';
import { loginValidator, registerValidator } from '../validators/auth-validator';
import {
  login, register, refreshAccessToken, getCurrentUser, logout,
} from '../controllers/auth-controller';
import auth from '../middlewares/auth';

const authRouter = express.Router();

authRouter.post('/login', loginValidator, login);
authRouter.post('/register', registerValidator, register);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);
authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
