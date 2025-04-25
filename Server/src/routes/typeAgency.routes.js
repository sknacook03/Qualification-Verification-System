import express from "express";
import TypeAgencyController from "../controllers/typeAgency.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const TypeAgencyRouter = express.Router();

TypeAgencyRouter.get("/", TypeAgencyController.getAgencyController);
TypeAgencyRouter.post("/create-type", authMiddleware,TypeAgencyController.createAgencyController);
TypeAgencyRouter.delete("/delete-type/:id", authMiddleware,TypeAgencyController.deleteTypeAgencyController);
TypeAgencyRouter.put("/update-type/:id", authMiddleware,TypeAgencyController.updateTypeAgencyController);
TypeAgencyRouter.get("/:id", authMiddleware,TypeAgencyController.getTypeAgencyByIdController);

export default TypeAgencyRouter;
