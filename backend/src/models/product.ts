import mongoose from 'mongoose';

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

export default mongoose.model<IProduct>('product', productSchema);
