import express from "express";
import StudentController from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const StudentRouter = express.Router();

StudentRouter.get("/:id", authMiddleware,StudentController.getStudentByIdController);
StudentRouter.post("/search", authMiddleware,StudentController.searchStudents);

export default StudentRouter;
