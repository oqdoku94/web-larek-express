import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import notFoundHandler from './middlewares/not-found-handler';
import indexRouter from './routes';

const port = `${process.env.PORT || 3000}`;
const app = express();
app.use(cors({
  origin: process.env.ORIGIN_ALLOW || `http://localhost:${port}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// подключаемся к серверу MongoDB
mongoose.connect(process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek');

app.use(requestLogger);
app.use(indexRouter);
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
