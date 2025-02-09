import StudentService from "../services/student.service.js";

const StudentController = {
  getStudentByIdController: async (req, res) => {
    try {
      const studentId = req.params.id;

      if (isNaN(studentId)) {
        return res.status(400).json({ error: "Invalid student ID" });
      }

      const student = await StudentService.getStudentById(studentId);

      const responseData = JSON.parse(
        JSON.stringify(student, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to get student" });
    }
  },
  searchStudents: async (req, res) => {
    try {
      const filterParams = req.body;

      console.log("📥 Received Search Parameters:", filterParams);

      if (!filterParams || Object.keys(filterParams).length === 0) {
        return res.status(400).json({ error: "At least one search parameter is required" });
      }
      const students = await StudentService.getStudentByFilters(filterParams);

      if (students.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }

      const responseData = JSON.parse(
        JSON.stringify(students, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error("Error in searchStudents:", error.message);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Failed to fetch students" });
    }
  },
};

export default StudentController;
