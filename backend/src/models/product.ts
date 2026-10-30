import mongoose from 'mongoose';
import path from 'path';
import * as fs from 'node:fs';

export interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Title обязателен для заполнения.'],
    minlength: [2, 'Title должен содержать больше 2 символов.'],
    maxlength: [30, 'Title должен содержать меньше 30 символов.'],
    unique: true,
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Image.FileName обязателен для заполнения.'],
    },
    originalName: {
      type: String,
      required: [true, 'Image.OriginalName обязателен для заполнения.'],
    },
  },
  category: {
    type: String,
    required: [true, 'Category обязателен для заполнения.'],
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

productSchema.post('findOneAndDelete', (doc) => {
  if (!doc) return;
  const filePath = path.join(__dirname, '../public', doc.image.fileName);

  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
});

export default mongoose.model<IProduct>('product', productSchema);
