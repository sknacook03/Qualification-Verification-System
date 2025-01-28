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
      const filterParams = req.body; // รับค่าทั้งหมดจาก Body ตรงๆ

      console.log("📥 Received Search Parameters:", filterParams);

      // ตรวจสอบว่ามีพารามิเตอร์ที่ใช้ค้นหาหรือไม่
      if (!filterParams || Object.keys(filterParams).length === 0) {
        return res.status(400).json({ error: "At least one search parameter is required" });
      }

      // เรียกใช้งาน Service พร้อมส่งค่าที่ได้รับจาก req.body
      const students = await StudentService.getStudentByFilters(filterParams);

      // ถ้าผลลัพธ์เป็นอาเรย์ว่าง แสดงว่าไม่มีข้อมูลที่ตรงกัน
      if (students.length === 0) {
        return res.status(404).json({ error: "No students found" });
      }

      // แปลง BigInt เป็น string เพื่อให้ JSON.stringify ทำงานได้
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
