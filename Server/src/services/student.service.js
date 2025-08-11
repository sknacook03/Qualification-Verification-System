import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const StudentService = {
  createStudent: async (student) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const existingStudent = await prisma.student.findUnique({
        where: {
          student_no: student.student_no,
        },
      });

      if (existingStudent) {
        throw new Error("Student already exists");
      }

      return prisma.student.create({
        data: {
          ...student,
          created_at: bangkokTime,
          updated_at: bangkokTime,
        },
      });
    } catch (error) {
      console.error("Error creating student:", error);
      throw {
        status: error.message === "Student already exists" ? 400 : 500,
        message: error.message,
      };
    }
  },
  getStudentById: async (id) => {
    try {
      console.log("Fetching student by ID:", id);
      const student = await prisma.student.findUnique({
        where: { id: BigInt(id) },
      });

      if (!student) {
        console.error("No student found for ID:", id);
      }
      return student;
    } catch (error) {
      console.error("Error in getStudentById:", error.message);
      throw error;
    }
  },
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
  getStudentCount: async () => {
    try {
      return await prisma.student.count();
    } catch (error) {
      console.error("Error counting students:", error);
      throw { status: 500, message: "Failed to count students" };
    }
  },
  getStudentByFilters: async (filterParams) => {
    try {
      const whereCondition = {};

      console.log("Corrected Search Parameters:", filterParams);

      let name =
        typeof filterParams.name === "string" ? filterParams.name.trim() : "";
      let lname =
        typeof filterParams.lname === "string" ? filterParams.lname.trim() : "";
      let student_no =
        typeof filterParams.student_no === "string"
          ? filterParams.student_no.trim()
          : "";

      // ตรวจสอบว่าครบทั้ง 3 ช่อง
      if (name === "" || lname === "" || student_no === "") {
        console.log("ต้องกรอก name, lname และ student_no ให้ครบ");
        return [];
      }

      let studentNoFormatted = student_no;
      if (!student_no.includes("-") && student_no.length === 12) {
        studentNoFormatted =
          student_no.slice(0, 11) + "-" + student_no.slice(11);
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

      console.log(
        "Prisma Query Conditions:",
        JSON.stringify(whereCondition, null, 2)
      );

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
