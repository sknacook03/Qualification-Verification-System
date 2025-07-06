import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ExportFileService = {
  getStudentsByNos: async (studentNos) => {
    try {
      return await prisma.student.findMany({
        where: { student_no: { in: studentNos } },
        orderBy: { student_no: "asc" },
      });
    } catch (err) {
      console.error("Prisma error", err);
      throw new Error("Database error");
    }
  },
};

export default ExportFileService;
