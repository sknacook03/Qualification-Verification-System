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
  getStudentById: async (id) => {
    try {
      console.log("Fetching Student by ID:", id);
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
};
