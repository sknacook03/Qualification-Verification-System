import express from "express";
import TypeAgencyController from "../controllers/typeAgency.controller.js";

const TypeAgencyRouter = express.Router();

TypeAgencyRouter.get("/", TypeAgencyController.getAgencyController);
TypeAgencyRouter.post("/create-type", TypeAgencyController.createAgencyController);
TypeAgencyRouter.delete("/delete-type/:id", TypeAgencyController.deleteTypeAgencyController);
TypeAgencyRouter.put("/update-type/:id", TypeAgencyController.updateTypeAgencyController);

export default TypeAgencyRouter;
