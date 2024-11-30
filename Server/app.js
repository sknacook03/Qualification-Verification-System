import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import IndexRouter from './src/index.route.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // กำหนดแหล่งที่มาที่อนุญาตให้เข้าถึง
  methods: ['GET', 'POST'],       // กำหนดวิธีที่อนุญาต
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(IndexRouter);
app.use("/uploads", express.static("uploads"));


app.use(bodyParser.json());


export default app;
