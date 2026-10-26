import { Router } from 'express';
import { createProduct, getAllProducts } from '../controllers/product-controller';
import productValidator from '../validators/product-validator';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', productValidator, createProduct);

export default productRouter;
