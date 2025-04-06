import multer from "multer";
import path from "path";
import PageviewService from "../services/pageview.service.js";

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
  createPageview: async (req, res) => {
    upload(req, res, async (err) => {
    try {
      const { student_id, action_type, faculty = "Unknown", department = "Unknown" } = req.body;
      const student_certificate = req.file ? req.file.path : "no_certificate_uploaded";
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
  })
  },
};

export default PageviewController;
