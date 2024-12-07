import express from "express";
import OfficerController from "../controllers/officer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const OfficerRouter = express.Router();

OfficerRouter.get("/officers", authMiddleware, OfficerController.getOfficerController)
OfficerRouter.get("/logged-in",authMiddleware, OfficerController.getLoggedInController);
OfficerRouter.post("/", OfficerController.createOfficerController)
OfficerRouter.put("/update-officer/:id", OfficerController.updateOfficerController)
OfficerRouter.delete("/delete-officer/:id", OfficerController.deleteOfficerController)
  

export default OfficerRouter;