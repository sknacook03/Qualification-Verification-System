import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const PageviewService = {
  getTopFacultyViews: async () => {
    try {
      const topFaculties = await prisma.pageView.groupBy({
        by: ["faculty"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 5,
      });

      const cleaned = topFaculties.map((item) => ({
        faculty: item.faculty,
        count: Number(item._count.id),
      }));
      return {
        success: true,
        data: cleaned,
      };
    } catch (error) {
      console.error("Error in getTopFacultyViews:", error);
      return { success: false, error: "Failed to fetch top faculties" };
    }
  },
  getTopAgencyViews: async () => {
    try {
      const topAgencies = await prisma.pageView.groupBy({
        by: ["agency_id"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: 5,
      });
      const agencyIds = topAgencies.map((a) => a.agency_id);

      const agencies = await prisma.agency.findMany({
        where: {
          id: { in: agencyIds },
        },
        select: {
          id: true,
          agency_name: true,
        },
      });
      const result = topAgencies.map((item) => {
        const matchedAgency = agencies.find((a) => a.id === item.agency_id);
        return {
          agency_id: item.agency_id,
          agency_name: matchedAgency?.agency_name || "ไม่ทราบชื่อ",
          count: item._count.id,
        };
      });
      const cleaned = result.map((item) => ({
        agency_id: Number(item.agency_id),
        agency_name: item.agency_name,
        count: Number(item.count),
      }));
      return {
        success: true,
        data: cleaned,
      };
    } catch (error) {
      console.error("Error in getTopAgencyViews:", error);
      return { success: false, error: "Failed to fetch top agencies" };
    }
  },
  getStatisticsOverTime: async () => {
    try {
      const trend = await prisma.$queryRawUnsafe(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS totalViews,
        COUNT(DISTINCT student_id) AS uniqueStudents
      FROM pageview
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC;
    `);

      const cleaned = trend.map((item) => ({
        date: item.date,
        totalViews: Number(item.totalViews),
        uniqueStudents: Number(item.uniqueStudents),
      }));

      return {
        success: true,
        data: cleaned,
      };
    } catch (error) {
      console.error("Error in getStatisticsOverTime:", error);
      return { success: false, error: "Failed to fetch trend data" };
    }
  },

  getStatistics: async () => {
    try {
      const totalViewsBigInt = await prisma.pageView.count();
      const grouped = await prisma.pageView.groupBy({
        by: ["student_id"],
      });
      const uniqueStudentsBigInt = grouped.length;
      const totalViews = Number(totalViewsBigInt);
      const uniqueStudents = Number(uniqueStudentsBigInt);

      return {
        success: true,
        data: {
          totalViews,
          uniqueStudents,
        },
      };
    } catch (error) {
      console.error("Error in getStatistics:", error);
      return { success: false, error: "Failed to fetch statistics" };
    }
  },
  createPageview: async ({
    agency_id,
    student_id,
    faculty,
    department,
    action_type,
    student_certificate,
  }) => {
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
        },
      });

      return {
        success: true,
        data: {
          ...pageView,
          id: pageView.id.toString(),
          agency_id: pageView.agency_id.toString(),
          student_id: pageView.student_id.toString(),
        },
      };
    } catch (error) {
      console.error("Error in PageviewService:", error);
      return { success: false, error: "Internal Server Error" };
    }
  },
};

export default PageviewService;
