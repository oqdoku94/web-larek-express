import { Router } from 'express';
import {createProduct, getAllProducts} from '../controllers/productsController';

const productsRouter = Router();

productsRouter.get('/', getAllProducts);
productsRouter.post('/', createProduct);

export default productsRouter;
