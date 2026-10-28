import express from 'express';
import path from 'path';
import productRouter from './product-router';
import orderRouter from './order-router';
import authRouter from './auth-router';
import uploadRouter from './upload-router';

const indexRouter = express.Router();

indexRouter.use(express.static(path.join(__dirname, 'public'))); // теперь клиент имеет доступ только к публичным файлам
indexRouter.use('/product/', productRouter);
indexRouter.use('/order/', orderRouter);
indexRouter.use('/auth/', authRouter);
indexRouter.use('/upload/', uploadRouter);

export default indexRouter;
