import multer from 'multer';
import path from 'path';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';
import { tempDir } from '../controllers/upload-controller';

const storage = multer.diskStorage(
  {
    destination: (_req, _file, callback) => {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      callback(null, tempDir);
    },
    filename: (_req, file, callback) => {
      callback(null, `${faker.string.alpha(32)}${path.extname(file.originalname)}`);
    },
  },
);

const fileMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/svg+xml'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      cb(new Error(`Разрешены только файлы с расширением: ${allowedExtensions.join(', ')}`));
      return;
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error(`Недопустимый тип файла. Разрешены только: ${allowedMimeTypes.join(', ')}`));
      return;
    }

    cb(null, true);
  },
});

export const moveToShareDirectory = (filePath: string, dirName: string) => {
  const tempFilePath = path.join(__dirname, '../../', tempDir, path.basename(filePath));
  const newFilePath = path.join(__dirname, '../public/', dirName, path.basename(filePath));

  const exists = fs.existsSync(tempFilePath);
  if (exists) {
    fs.copyFileSync(tempFilePath, newFilePath); // rename в docker падал, из-за монтирования папки
    fs.rmSync(tempFilePath);
  }
};

export default fileMiddleware;
