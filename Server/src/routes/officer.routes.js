import express from "express";
import OfficerController from "../controllers/officer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";

const OfficerRouter = express.Router();

OfficerRouter.get("/officers", authMiddleware, OfficerController.getOfficerController)
OfficerRouter.get("/logged-in", authMiddleware, OfficerController.getLoggedInController);
OfficerRouter.post("/", OfficerController.createOfficerController)
OfficerRouter.post("/send-email", authMiddleware, OfficerController.sendAgency)
OfficerRouter.post("/verify-token", verifyTokenMiddleware, OfficerController.rejectVerifyToken)
OfficerRouter.put("/update-officer/:id", authMiddleware, OfficerController.updateOfficerController)
OfficerRouter.delete("/delete-officer/:id", authMiddleware, OfficerController.deleteOfficerController)
  

export default OfficerRouter;