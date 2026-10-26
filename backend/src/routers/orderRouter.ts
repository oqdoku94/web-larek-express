import express from 'express';
import createOrder from '../controllers/orderController';
import validateOrder from '../validators/orderValidator';

const orderRouter = express.Router();

orderRouter.post('/', validateOrder, createOrder);

export default orderRouter;
