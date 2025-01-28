import express from "express";
import AgencyController from "../controllers/agency.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const AgencyRouter = express.Router();

AgencyRouter.get("/agencies", AgencyController.getAgencyController)
AgencyRouter.get("/logged-in",authMiddleware, AgencyController.getLoggedInController);
AgencyRouter.post("/", AgencyController.createAgencyController)
AgencyRouter.post('/check-email', AgencyController.checkEmailController);
AgencyRouter.post('/check-telphone', AgencyController.checkTelephoneController);
AgencyRouter.put("/update-agency/:id", authMiddleware,AgencyController.updateAgencyController);
AgencyRouter.put("/update-reject-agency/:id",AgencyController.updateRejectionAgencyController);
AgencyRouter.delete("/delete-agency/:id",authMiddleware, AgencyController.deleteAgencyController)
  

export default AgencyRouter;