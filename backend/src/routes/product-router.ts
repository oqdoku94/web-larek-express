import { Router } from 'express';
import auth from '../middlewares/auth';
import {
  createProduct, deleteProduct, getAllProducts, updateProduct,
} from '../controllers/product-controller';
import productValidator from '../validators/product-validator';

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.post('/', auth, productValidator, createProduct);
productRouter.patch('/:productId', auth, updateProduct);
productRouter.delete('/:productId', auth, deleteProduct);

export default productRouter;
