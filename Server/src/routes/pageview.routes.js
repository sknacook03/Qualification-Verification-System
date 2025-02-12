import express from "express";
import PageviewController from "../controllers/pageview.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const PageViewRouter = express.Router();

PageViewRouter.post("/create", authMiddleware, PageviewController.createPageview)

export default PageViewRouter;