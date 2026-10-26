import express from 'express';
import { loginValidator, registerValidator } from '../validators/auth-validator';
import { login, register } from '../controllers/auth-controller';

const authRouter = express.Router();

authRouter.post('/login', loginValidator, login);
authRouter.post('/register', registerValidator, register);
// authRouter.post('/token', getUserToken);
// authRouter.post('/logout', logout);
// authRouter.post('/user', getUser);

export default authRouter;
