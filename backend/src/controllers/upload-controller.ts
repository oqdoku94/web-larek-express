import {
  Request, Response, NextFunction,
} from 'express';

export const tempDir = process.env.UPLOAD_PATH_TEMP || 'temp';
export const imagePath = process.env.UPLOAD_PATH || 'images';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  if (!file) {
    next(new Error('Нет файла!'));
    return;
  }

  res.send({
    fileName: `/${imagePath}/${file.filename}`,
    originalName: file.originalname,
  });
};

export default uploadFile;
