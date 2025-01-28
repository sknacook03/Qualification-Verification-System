import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const StudentService = {
  getStudentAll: async () => {
    try {
      return await prisma.student.findMany();
    } catch (error) {
      console.error("Error fetching students:", error);
      throw {
        status: 500,
        message: "Failed to fetch students",
      };
    }
  },
  getStudentByFilters: async (filterParams) => {
    try {
      const whereCondition = { OR: [] };

      console.log("📥 Corrected Search Parameters:", filterParams);

      // ตรวจสอบว่า name, lname และ student_no เป็น string หรือไม่ ถ้าไม่ใช่ให้กำหนดเป็น ""
      let name = typeof filterParams.name === "string" ? filterParams.name.trim() : "";
      let lname = typeof filterParams.lname === "string" ? filterParams.lname.trim() : "";
      let student_no = typeof filterParams.student_no === "string" ? filterParams.student_no.trim() : "";

      // เพิ่ม name และ lname เข้าไปใน OR ถ้ามีค่า
      if (name !== "") {
        whereCondition.OR.push({ name: { contains: name } });
      }
      if (lname !== "") {
        whereCondition.OR.push({ lname: { contains: lname } });
      }

      // ถ้ามี student_no ให้เพิ่มเข้าไปใน OR
      if (student_no !== "") {
        let studentNoFormatted = student_no;

        // ถ้าไม่มี "-" ให้เพิ่ม "-" ในตำแหน่งที่ถูกต้อง
        if (!student_no.includes("-") && student_no.length === 12) {
          studentNoFormatted = student_no.slice(0, 11) + "-" + student_no.slice(11);
        }

        whereCondition.OR.push({ student_no: { equals: student_no } }); // ค้นหาตรงกับที่ผู้ใช้กรอก
        if (studentNoFormatted !== student_no) {
          whereCondition.OR.push({ student_no: { equals: studentNoFormatted } }); // ค้นหาแบบเพิ่ม "-"
        }
      }

      console.log("Prisma Query Conditions:", JSON.stringify(whereCondition, null, 2));

      // ตรวจสอบว่ามีอย่างน้อยหนึ่งเงื่อนไขก่อน Query
      if (whereCondition.OR.length === 0) {
        console.log("No search conditions were provided.");
        return []; // ถ้าไม่มีเงื่อนไข ให้คืนอาเรย์ว่าง
      }

      const students = await prisma.student.findMany({ where: whereCondition });

      return students;
    } catch (error) {
      console.error("Error in getStudentByFilters:", error.message);
      throw {
        status: 500,
        message: "Failed to fetch students",
        error: error.message,
      };
    }
  },
};

export default StudentService;
