import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import IndexRouter from "./src/index.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    exposedHeaders: ['x-token-expiry', 'x-token-ttl', 'x-token-expired'],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(IndexRouter);
app.use("/uploads", express.static("uploads"));
app.use("/uploads_certificate", express.static("uploads_certificate"));

app.use(bodyParser.json());

export default app;
