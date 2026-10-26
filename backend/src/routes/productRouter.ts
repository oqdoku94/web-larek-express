import { Router } from 'express';
import { createProduct, getAllProducts } from '../controllers/productController';
import productValidator from '../validators/productValidator';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', productValidator, createProduct);

export default productRouter;
