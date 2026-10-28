import {
  Request, Response, NextFunction,
} from 'express';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';
import path from 'path';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  if (!file) {
    next(new Error('Нет файла!'));
    return;
  }

  const newFileName = `${faker.string.ulid()}${path.extname(file.originalname)}`;
  const newFilePath = path.join(__dirname, '../public/images', newFileName);

  fs.copyFile(file.path, newFilePath, (err) => {
    if (err) throw err;

    res.send({
      fileName: `/images/${newFileName}`,
      originalName: file.originalname,
    });
  });
};

export default uploadFile;
