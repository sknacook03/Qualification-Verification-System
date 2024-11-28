import express from 'express';
import bodyParser from 'body-parser';
import IndexRouter from './src/index.route.js';
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(IndexRouter)
app.get('/', (req, res) => {
  res.send('Server is running with Bun!');
});

app.use(bodyParser.json())

export default app;