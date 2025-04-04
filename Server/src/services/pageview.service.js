import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PageviewService = {
  createPageview: async ({ agency_id, student_id, faculty, department, action_type, student_certificate }) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const pageView = await prisma.pageView.upsert({
        where: {
          agency_id_student_id: {
            agency_id: Number(agency_id),
            student_id: Number(student_id),
          },
        },
        update: {
          action_type: action_type || "VIEW",
          faculty,
          department,
          student_certificate,
          updated_at: bangkokTime, 
        },
        create: {
          agency_id: Number(agency_id),
          student_id: Number(student_id),
          faculty,
          department,
          student_certificate,
          action_type: action_type || "VIEW",
          created_at: bangkokTime,
          updated_at: bangkokTime, 
        }
      });

      return { 
        success: true, 
        data: {
          ...pageView,
          id: pageView.id.toString(),
          agency_id: pageView.agency_id.toString(),
          student_id: pageView.student_id.toString()
        }
      };

    } catch (error) {
      console.error("Error in PageviewService:", error);
      return { success: false, error: "Internal Server Error" };
    }
  },
};

export default PageviewService;
