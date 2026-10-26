import express from 'express';
import createOrder from '../controllers/order-controller';
import orderValidator from '../validators/order-validator';

const orderRouter = express.Router();

orderRouter.post('/', orderValidator, createOrder);

export default orderRouter;
