import express from 'express';
import createOrder from '../controllers/orderController';
import orderValidator from '../validators/orderValidator';

const orderRouter = express.Router();

orderRouter.post('/', orderValidator, createOrder);

export default orderRouter;
