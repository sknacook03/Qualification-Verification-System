import express from "express";
import AgencyController from "../controllers/agency.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const AgencyRouter = express.Router();

AgencyRouter.post("/", AgencyController.createAgencyController)
AgencyRouter.delete("/:id", AgencyController.deleteAgencyController)
AgencyRouter.get("/agencies", authMiddleware, AgencyController.getAgencyController)

export default AgencyRouter;