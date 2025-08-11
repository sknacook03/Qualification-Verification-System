import express from "express";
import StudentController from "../controllers/student.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import handleUploadError from "../middlewares/error-handling.middleware.js";
import multer from "multer";

const StudentRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads_FileExcel/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().endsWith('.xlsx')) {
      return cb(new Error('Only .xlsx files are allowed'), false);
    }
    cb(null, true);
  }
});
StudentRouter.get("/count", authMiddleware,StudentController.getStudentCountController);
StudentRouter.post("/search", authMiddleware,StudentController.searchStudents);
StudentRouter.post( "/upload-excel",authMiddleware,upload.single("file"),handleUploadError,StudentController.uploadExcel);
StudentRouter.get("/:id", authMiddleware,StudentController.getStudentByIdController);
export default StudentRouter;
