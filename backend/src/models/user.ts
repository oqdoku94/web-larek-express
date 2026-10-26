import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: {
    token: string;
  }[]
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'name должен содержать больше 1 символов.'],
    maxlength: [30, 'name должен содержать меньше 30 символов.'],
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: [true, 'email обязателен для заполнения.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password обязателен для заполнения.'],
  },
  tokens: [
    {
      token: {
        type: String,
        required: [true, 'Токен обязателен для заполнения.'],
      },
    },
  ],
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .then((user: any) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильная почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
