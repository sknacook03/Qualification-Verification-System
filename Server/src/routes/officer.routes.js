import express from "express";
import OfficerController from "../controllers/officer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import verifyTokenMiddleware from "../middlewares/verifyToken.middleware.js";
import checkTokenExpiry from "../middlewares/tokenExpiry.middleware.js";

const OfficerRouter = express.Router();

OfficerRouter.get("/officers", authMiddleware, OfficerController.getOfficerController)
OfficerRouter.get("/logged-in", checkTokenExpiry, authMiddleware, OfficerController.getLoggedInController);
OfficerRouter.post("/", OfficerController.createOfficerController)
OfficerRouter.post("/send-email", authMiddleware, OfficerController.sendAgency)
OfficerRouter.post("/check-email", authMiddleware, OfficerController.checkOfficerEmail)
OfficerRouter.post("/verify-password/:id", authMiddleware, OfficerController.verifyPasswordOfficerController)
OfficerRouter.post("/verify-token", verifyTokenMiddleware, OfficerController.rejectVerifyToken)
OfficerRouter.put("/update-officer/:id", authMiddleware, OfficerController.updateOfficerController)
OfficerRouter.delete("/delete-officer/:id", authMiddleware, OfficerController.deleteOfficerController)
  

export default OfficerRouter;