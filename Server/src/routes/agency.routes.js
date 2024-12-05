import express from "express";
import AgencyController from "../controllers/agency.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const AgencyRouter = express.Router();

AgencyRouter.post("/", AgencyController.createAgencyController)
AgencyRouter.delete("/:id", AgencyController.deleteAgencyController)
AgencyRouter.get("/agencies", AgencyController.getAgencyController)
AgencyRouter.get("/logged-in",authMiddleware, AgencyController.getLoggedInController);
  

export default AgencyRouter;