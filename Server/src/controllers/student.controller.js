import StudentService from "../services/student.service.js";
import xlsx from "xlsx";
import fs from "fs/promises";

const StudentController = {
  uploadExcel: async (req, res) => {
    let filePath;
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      filePath = req.file.path;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      const success = [];
      const failed = [];
      for (const row of data) {
        try {
          const studentData = {
            year_no: row.YEARNO,
            semester_no: row.SEMESTER_ID,
            student_no: row.STUDENT_NO?.toString().trim(),
            std_year_no: row.STDYEARNO,
            prefix_name: row.PREFIX_NAME?.trim(),
            name: row.NAME?.trim(),
            lname: row.LNAME?.trim(),
            cca: row.CCA ? parseInt(row.CCA) : null,
            gpa: row.GPA ? parseFloat(row.GPA) : null,
            status_graduate: row.STATUS_GRADUATE
              ? parseInt(row.STATUS_GRADUATE)
              : null,
            graduate_date: (() => {
              const raw = row.GRADUATED_DATE;
              if (!raw) return null;

              if (typeof raw === "string") {
                const [day, month, year] = raw.split("/");
                return new Date(`${year}-${month}-${day}`);
              } else if (typeof raw === "number") {
                const excelEpoch = new Date(1899, 11, 30);
                return new Date(excelEpoch.getTime() + raw * 86400000);
              } else {
                return null;
              }
            })(),

            deg_name: row.DEG_NAME?.trim() || null,
            honors: row.HONORS?.trim() || null,
            thesis_topic_th: row.THESIS_TOPIC_TH?.trim() || null,
            thesis_topic_en: row.THESIS_TOPIC_EN?.trim() || null,
            dept_code: row.DEPT_CODE ? parseInt(row.DEPT_CODE) : null,
            curr_name: row.CURR_NAME?.trim() || null,
          };

          if (
            studentData.student_no &&
            studentData.name &&
            studentData.lname &&
            studentData.year_no
          ) {
            await StudentService.createStudent(studentData);
            success.push(studentData);
          } else {
            failed.push({ ...studentData, error: "Missing required fields" });
          }
        } catch (err) {
          failed.push({ ...row, error: err.message });
        }
      }

      res.status(200).json({
        message: "File processed",
        successCount: success.length,
        failedCount: failed.length,
        failedData: failed,
      });
    } catch (error) {
      console.error("Excel Upload Error:", error);
      res
        .status(500)
        .json({ error: "Failed to upload and process Excel file" });
    } finally {
      try {
        await fs.unlink(filePath);
      } catch (unlinkErr) {
        console.error("Error removing file:", unlinkErr);
      }
    }
  },
  getStudentByIdController: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(id);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
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

      console.log("Received Search Parameters:", filterParams);

      if (!filterParams || Object.keys(filterParams).length === 0) {
        return res
          .status(400)
          .json({ error: "At least one search parameter is required" });
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
