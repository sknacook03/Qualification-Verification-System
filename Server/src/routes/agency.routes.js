import express from "express";
import AgencyController from "../controllers/agency.controller.js";

const AgencyRouter = express.Router();

AgencyRouter.post("/", AgencyController.createAgencyController)
AgencyRouter.get("/", AgencyController.getAgencyController)
AgencyRouter.delete("/:id", AgencyController.deleteAgencyController)


export default AgencyRouter;