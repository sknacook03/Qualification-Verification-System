import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import IndexRouter from "./src/index.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8888", 
    origin: "http://localhost:5173",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(IndexRouter);
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());

export default app;
