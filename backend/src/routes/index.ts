import express from 'express';
import path from 'path';
import productRouter from './product-router';
import orderRouter from './order-router';

const indexRouter = express.Router();

indexRouter.use(express.static(path.join(__dirname, 'public'))); // теперь клиент имеет доступ только к публичным файлам
indexRouter.use('/product/', productRouter);
indexRouter.use('/order/', orderRouter);

export default indexRouter;
