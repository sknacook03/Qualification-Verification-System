import multer from "multer";
import path from "path";
import PageviewService from "../services/pageview.service.js";
import { get } from "http";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads_certificate/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".png", ".jpg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
}).single("student_certificate");

const PageviewController = {
  getTopFacultyViewsController: async (req, res) => {
    try {
      const result = await PageviewService.getTopFacultyViews();

      if (result.success) {
        res.json(result.data);
      } else {
        res
          .status(500)
          .json({ error: result.error || "Failed to fetch top faculty" });
      }
    } catch (error) {
      console.error("Error in getTopFacultyViewsController:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTopAgencyViewsController: async (req, res) => {
    try {
      const result = await PageviewService.getTopAgencyViews();

      if (result.success) {
        res.json(result.data);
      } else {
        res
          .status(500)
          .json({ error: result.error || "Failed to fetch top agencies" });
      }
    } catch (error) {
      console.error("Error in getTopAgencyViewsController:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getStatisticsOverTimeController: async (req, res) => {
    try {
      const result = await PageviewService.getStatisticsOverTime();
      res.json(result.data);
    } catch (error) {
      console.error("Error in getStatisticsOverTimeController:", error);
    }
  },
  getStatisticsController: async (req, res) => {
    try {
      const result = await PageviewService.getStatistics();
      res.json(result.data);
    } catch (error) {
      console.error("Error in getStatisticsController:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllFacultiesController: async (req, res) => {
    try {
      const result = await PageviewService.getAllFaculties();
      res.json(result);
    } catch (error) {
      console.error("Error in getAllFacultiesController", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllDepartmentsController: async (req, res) => {
    try {
      const result = await PageviewService.getAllDepartments();
      res.json(result);
    } catch (error) {
      console.error("Error in getAllDepartmentsController", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTopAgenciesByFacultyController: async (req, res) => {
    try {
      const { faculty, limit } = req.query;
      const result = await PageviewService.getTopAgenciesByFaculty(
        faculty,
        limit
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getTopAgenciesByFacultyController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
    getTopAgenciesByDepartmentController: async (req, res) => {
    try {
      const { department, limit } = req.query;
      const result = await PageviewService.getTopAgenciesByDepartment(
        department,
        limit
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getTopAgenciesByDepartmentController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createPageview: async (req, res) => {
    upload(req, res, async (err) => {
      try {
        const {
          student_id,
          action_type,
          faculty = "Unknown",
          department = "Unknown",
        } = req.body;
        const student_certificate = req.file
          ? req.file.path
          : "no_certificate_uploaded";
        const agency_id = Number(req.agency?.id);
        const studentId = Number(student_id);

        if (!agency_id || !studentId) {
          return res.status(401).json({ error: "Invalid ID format" });
        }

        const result = await PageviewService.createPageview({
          agency_id,
          student_id: studentId,
          faculty,
          department,
          student_certificate,
          action_type,
        });

        if (!result.success) {
          return res.status(500).json({ error: result.error });
        }

        res.json(result);
      } catch (error) {
        console.error("Error in PageviewController:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },
};

export default PageviewController;
