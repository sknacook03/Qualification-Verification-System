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

      let name = typeof filterParams.name === "string" ? filterParams.name.trim() : "";
      let lname = typeof filterParams.lname === "string" ? filterParams.lname.trim() : "";
      let student_no = typeof filterParams.student_no === "string" ? filterParams.student_no.trim() : "";

      if (name !== "") {
        whereCondition.OR.push({ name: { contains: name } });
      }
      if (lname !== "") {
        whereCondition.OR.push({ lname: { contains: lname } });
      }

      if (student_no !== "") {
        let studentNoFormatted = student_no;

        if (!student_no.includes("-") && student_no.length === 12) {
          studentNoFormatted = student_no.slice(0, 11) + "-" + student_no.slice(11);
        }

        whereCondition.OR.push({ student_no: { equals: student_no } }); 
        if (studentNoFormatted !== student_no) {
          whereCondition.OR.push({ student_no: { equals: studentNoFormatted } }); 
        }
      }

      console.log("Prisma Query Conditions:", JSON.stringify(whereCondition, null, 2));


      if (whereCondition.OR.length === 0) {
        console.log("No search conditions were provided.");
        return []; 
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
