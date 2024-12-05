import express from "express";
import TypeAgencyController from "../controllers/typeAgency.controller.js";

const TypeAgencyRouter = express.Router();

TypeAgencyRouter.get("/", TypeAgencyController.getAgencyController);
TypeAgencyRouter.post("/create-type", TypeAgencyController.createAgencyController);

export default TypeAgencyRouter;
