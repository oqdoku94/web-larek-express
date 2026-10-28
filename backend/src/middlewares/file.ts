import multer from 'multer';
import path from 'path';

const fileMiddleware = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname) !== '.jpg' && path.extname(file.originalname) !== '.jpeg'
    && path.extname(file.originalname) !== '.png' && path.extname(file.originalname) !== '.gif') {
      cb(new Error('Разрешены только файлы с расширением jpg, jpeg, png, gif.'));
      return;
    }
    cb(null, true);
  },
});

export default fileMiddleware;
