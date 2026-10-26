import { Router } from 'express';
import { createProduct, getAllProducts } from '../controllers/productController';
import validateProduct from '../validators/productValidator';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', validateProduct, createProduct);

export default productRouter;
