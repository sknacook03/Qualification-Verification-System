import express from "express";
import ExportFileController from "../controllers/exportFile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const ExportFileRouter = express.Router();

ExportFileRouter.post("/export-pdf", ExportFileController.exportStudentPDF);
ExportFileRouter.post("/export-excel", ExportFileController.exportStudentExcel);

export default ExportFileRouter;