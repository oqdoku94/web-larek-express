import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/productRouter';
import orderRouter from "./routes/orderRouter";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

// подключаемся к серверу MongoDB
mongoose.connect(process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek');

app.use(express.static(path.join(__dirname, 'public'))); // теперь клиент имеет доступ только к публичным файлам
app.use('/product/', productRouter);
app.use('/order/', orderRouter);

app.use(errorHandler);

const port = `${process.env.PORT || 3000}`;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
