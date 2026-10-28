import { Router } from 'express';
import fileMiddleware from '../middlewares/file';
import uploadFile from '../controllers/upload-controller';

const uploadRouter = Router();

uploadRouter.post('/', fileMiddleware.single('file'), uploadFile);

export default uploadRouter;
