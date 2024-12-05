import express from "express";
import OfficerController from "../controllers/officer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const OfficerRouter = express.Router();

OfficerRouter.post("/", OfficerController.createOfficerController)
OfficerRouter.delete("/:id", OfficerController.deleteOfficerController)
OfficerRouter.get("/officers", authMiddleware, OfficerController.getOfficerController)
OfficerRouter.get("/logged-in",authMiddleware, OfficerController.getLoggedInController);
  

export default OfficerRouter;