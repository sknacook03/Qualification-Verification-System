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
      const whereCondition = {};
  
      console.log("📥 Corrected Search Parameters:", filterParams);
  
      let name = typeof filterParams.name === "string" ? filterParams.name.trim() : "";
      let lname = typeof filterParams.lname === "string" ? filterParams.lname.trim() : "";
      let student_no = typeof filterParams.student_no === "string" ? filterParams.student_no.trim() : "";
  
      // ตรวจสอบว่าครบทั้ง 3 ช่อง
      if (name === "" || lname === "" || student_no === "") {
        console.log("ต้องกรอก name, lname และ student_no ให้ครบ");
        return []; 
      }
  
      let studentNoFormatted = student_no;
      if (!student_no.includes("-") && student_no.length === 12) {
        studentNoFormatted = student_no.slice(0, 11) + "-" + student_no.slice(11);
      }
  
      whereCondition.AND = [
        { name: { equals: name } },
        { lname: { equals: lname } },
        {
          OR: [
            { student_no: { equals: student_no } },
            { student_no: { equals: studentNoFormatted } },
          ],
        },
      ];
  
      console.log("✅ Prisma Query Conditions:", JSON.stringify(whereCondition, null, 2));
  
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
