import { Router } from 'express';
import fileMiddleware from '../middlewares/file';
import uploadFile from '../controllers/upload-controller';
import auth from '../middlewares/auth';

const uploadRouter = Router();

uploadRouter.post('/', fileMiddleware.single('file'), auth, uploadFile);

export default uploadRouter;
