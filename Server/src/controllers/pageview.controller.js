import PageviewService from "../services/pageview.service.js";

const PageviewController = {
  createPageview: async (req, res) => {
    try {
      const { student_id, action_type, faculty = "Unknown", department = "Unknown", student_certificate } = req.body;
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
  },
};

export default PageviewController;
