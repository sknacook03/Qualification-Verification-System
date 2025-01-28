import express from "express";
import StudentController from "../controllers/student.controller.js";

const StudentRouter = express.Router();

StudentRouter.get("/:id", StudentController.getStudentByIdController);
StudentRouter.post("/search", StudentController.searchStudents);

export default StudentRouter;
