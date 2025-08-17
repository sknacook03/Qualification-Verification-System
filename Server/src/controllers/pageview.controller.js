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

const facultyMap = {
  103: "คณะระบบรางและการขนส่ง",
  104: "คณะนวัตกรรมและเทคโนโลยีการเกษตร",
  15: "คณะบริหารธุรกิจ",
  16: "คณะวิทยาศาสตร์และศิลปศาสตร์",
  17: "คณะวิศวกรรมศาสตร์และเทคโนโลยี",
  18: "คณะสถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์",
  19: "สถาบันสหสรรพศาสตร์",
};

const getFacultyName = (deptCode) => {
  const code = deptCode.toString();
  if (facultyMap[code.substring(0, 3)]) {
    return facultyMap[code.substring(0, 3)];
  }

  if (facultyMap[code.substring(0, 2)]) {
    return facultyMap[code.substring(0, 2)];
  }

  return "-";
};
const PageviewController = {
  getTopFacultyViewsController: async (req, res) => {
    try {
      const { startDate, endDate, agencyId } = req.query;
      const agencyIdParam =
        agencyId && agencyId !== "null" && agencyId !== "undefined"
          ? agencyId
          : null;
      const result = await PageviewService.getTopFacultyViews(
        startDate,
        endDate,
        agencyIdParam
      );

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
  getTopDepartmentsViewsController: async (req, res) => {
    try {
      const { startDate, endDate, agencyId } = req.query;
      const agencyIdParam =
        agencyId && agencyId !== "null" && agencyId !== "undefined"
          ? agencyId
          : null;
      const result = await PageviewService.getTopDepartmentsViews(
        startDate,
        endDate,
        agencyIdParam
      );

      if (result.success) {
        res.json(result.data);
      } else {
        res
          .status(500)
          .json({ error: result.error || "Failed to fetch top departments" });
      }
    } catch (error) {
      console.error("Error in getTopDepartmentsViewsController:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTopAgencyViewsController: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const result = await PageviewService.getTopAgencyViews(
        startDate,
        endDate
      );

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
      const { startDate, endDate } = req.query;
      const result = await PageviewService.getStatisticsOverTime(
        startDate,
        endDate
      );
      res.json(result.data);
    } catch (error) {
      console.error("Error in getStatisticsOverTimeController:", error);
    }
  },
  getStatisticsController: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const result = await PageviewService.getStatistics(startDate, endDate);
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
  getAllAgenciesController: async (req, res) => {
    try {
      const result = await PageviewService.getAllAgencies();
      res.json(result);
    } catch (error) {
      console.error("Error in getAllAgenciesController", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTopAgenciesByFacultyController: async (req, res) => {
    try {
      const { faculty, limit, startDate, endDate } = req.query;
      const result = await PageviewService.getTopAgenciesByFaculty(
        faculty,
        limit,
        startDate,
        endDate
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getTopAgenciesByFacultyController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTopAgenciesByDepartmentController: async (req, res) => {
    try {
      const { department, limit, startDate, endDate } = req.query;
      const result = await PageviewService.getTopAgenciesByDepartment(
        department,
        limit,
        startDate,
        endDate
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getTopAgenciesByDepartmentController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getDepartmentsByFacultyController: async (req, res) => {
    try {
      const { faculty } = req.query;
      const result = await PageviewService.getDepartmentsByFaculty(faculty);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      return res.json(result.data);
    } catch (error) {
      console.error("Error in getDepartmentsByFacultyController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  countStudentViewsByAgencyController: async (req, res) => {
    try {
      const { agency_id, startDate, endDate } = req.params;
      const result = await PageviewService.countStudentViewsByAgency(
        agency_id,
        startDate,
        endDate
      );

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      const formatted = result.data.map((item) => ({
        agency_id: item.agency_id.toString(),
        count: Number(item._count.id),
      }));

      return res.json(formatted);
    } catch (error) {
      console.error("Error in countStudentViewsByAgencyController", error);
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
        const facultyName = getFacultyName(faculty);

        const result = await PageviewService.createPageview({
          agency_id,
          student_id: studentId,
          faculty: facultyName,
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
  getPageviewWithNameController: async (req, res) => {
    try {
      const items = await PageviewService.getAllPageviewsWithNames();
      res.status(200).json({ success: true, count: items.length, items });
    } catch (err) {
      const status = err.status || 500;
      res.status(status).json({
        success: false,
        message: err.status ? err.message : "Failed to get pageviews",
        code: err.code,
      });
    }
  },
};

export default PageviewController;
