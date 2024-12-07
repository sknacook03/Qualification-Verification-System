import express from "express";
import AgencyController from "../controllers/agency.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const AgencyRouter = express.Router();

AgencyRouter.get("/agencies", AgencyController.getAgencyController)
AgencyRouter.get("/logged-in",authMiddleware, AgencyController.getLoggedInController);
AgencyRouter.post("/", AgencyController.createAgencyController)
AgencyRouter.put("/update-agency/:id", AgencyController.updateAgencyController);
AgencyRouter.delete("/delete-agency/:id", AgencyController.deleteAgencyController)
  

export default AgencyRouter;