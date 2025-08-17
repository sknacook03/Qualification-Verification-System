import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const buildDateFilter = (startDate, endDate) => {
  if (startDate && endDate) {
    return {
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate + "T23:59:59"),
      },
    };
  }
  return {};
};

const fullName = (s) => {
  if (!s) return null;
  const strip = (x) => (x ?? "").toString().trim();

  const prefixAndName = strip(s.prefix_name) + strip(s.name);
  const last = strip(s.lname);

  const result = [prefixAndName, last].filter(Boolean).join(" ").trim();
  return result || null;
};

const PageviewService = {
  getTopFacultyViews: async (startDate, endDate, agencyId) => {
    try {
      const dateFilter = buildDateFilter(startDate, endDate);
      const topFaculties = await prisma.pageView.groupBy({
        by: ["faculty"],
        where: {
          ...dateFilter,
          ...(agencyId && { agency_id: agencyId }),
        },
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
  getTopDepartmentsViews: async (startDate, endDate, agencyId) => {
    try {
      const dateFilter = buildDateFilter(startDate, endDate);
      const topDepartments = await prisma.pageView.groupBy({
        by: ["department"],
        where: {
          ...dateFilter,
          ...(agencyId && { agency_id: agencyId }),
        },
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

      const cleaned = topDepartments.map((item) => ({
        department: item.department,
        count: Number(item._count.id),
      }));
      return {
        success: true,
        data: cleaned,
      };
    } catch (error) {
      console.error("Error in getTopDepartmentsViews:", error);
      return { success: false, error: "Failed to fetch top departments" };
    }
  },
  getTopAgencyViews: async (startDate, endDate) => {
    try {
      const dateFilter = buildDateFilter(startDate, endDate);
      const topAgencies = await prisma.pageView.groupBy({
        by: ["agency_id"],
        where: {
          ...dateFilter,
        },
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
  getAllFaculties: async () => {
    try {
      const students = await prisma.student.findMany({
        where: {
          curr_name: { not: null },
          dept_code: { not: null },
        },
        select: {
          curr_name: true,
          dept_code: true,
        },
      });

      const mapped = students
        .map((s) => {
          const faculty = s.curr_name?.split("(")[0].trim();
          const code = Number(s.dept_code);
          if (!faculty || !code) return null;

          const normalizedCode = Math.floor(code / 100) * 100;

          return {
            code: normalizedCode,
            faculty,
          };
        })
        .filter(Boolean);

      const uniqueSet = new Set();
      const result = mapped.filter((item) => {
        const key = `${item.code}__${item.faculty}`;
        if (uniqueSet.has(key)) return false;
        uniqueSet.add(key);
        return true;
      });

      return result; 
    } catch (error) {
      console.error("Error fetching faculties:", error);
      throw error; 
    }
  },
  getAllDepartments: async (req, res) => {
    try {
      const departments = await prisma.pageView.findMany({
        distinct: ["department"],
        select: {
          department: true,
        },
        where: {
          department: {
            not: "",
          },
        },
      });

      const cleaned = departments.map((d) => d.department).filter((d) => !!d);

      return cleaned;
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return res.status(500).json({ error: "Failed to fetch faculties" });
    }
  },
  getTopAgenciesByFaculty: async (faculty, limit = 5, startDate, endDate) => {
    if (!faculty) {
      return {
        success: false,
        error: "faculty parameter is required",
      };
    }

    const take = Number(limit) || 5;
    const dateFilter = buildDateFilter(startDate, endDate);
    try {
      const topAgencies = await prisma.pageView.groupBy({
        by: ["agency_id"],
        where: {
          faculty: faculty,
          ...dateFilter,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: take,
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
          agency_id: Number(item.agency_id),
          agency_name: matchedAgency?.agency_name || "ไม่ทราบชื่อ",
          count: Number(item._count.id),
        };
      });

      return { success: true, data: result };
    } catch (error) {
      console.error("Error in getTopAgenciesByFaculty:", error);
      return { success: false, error: "Internal server error" };
    }
  },
  getTopAgenciesByDepartment: async (
    department,
    limit = 5,
    startDate,
    endDate
  ) => {
    if (!department) {
      return {
        success: false,
        error: "department parameter is required",
      };
    }

    const take = Number(limit) || 5;
    const dateFilter = buildDateFilter(startDate, endDate);
    try {
      const topAgencies = await prisma.pageView.groupBy({
        by: ["agency_id"],
        where: {
          department: department,
          ...dateFilter,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
        take: take,
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
          agency_id: Number(item.agency_id),
          agency_name: matchedAgency?.agency_name || "ไม่ทราบชื่อ",
          count: Number(item._count.id),
        };
      });

      return { success: true, data: result };
    } catch (error) {
      console.error("Error in getTopAgenciesByDepartment:", error);
      return { success: false, error: "Internal server error" };
    }
  },
  getDepartmentsByFaculty: async (faculty) => {
    if (!faculty) {
      return {
        success: false,
        error: "faculty parameter is required",
      };
    }

    try {
      const students = await prisma.student.findMany({
        select: { curr_name: true },
        where: {
          curr_name: { not: null },
        },
      });

      const rawList = students.map((s) => s.curr_name).filter(Boolean);

      const parsedList = rawList
        .map((curr) => {
          const match = curr.match(/^(.+)\((.+)\)$/);
          if (!match) return null;
          return {
            faculty: match[1].trim(),
            department: match[2].trim(),
          };
        })
        .filter(Boolean);

      const departments = [
        ...new Set(
          parsedList
            .filter((item) => item.faculty === faculty)
            .map((item) => item.department)
        ),
      ];

      return { success: true, data: departments };
    } catch (error) {
      console.error("Error parsing curr_name:", error);
      return {
        success: false,
        error: "Failed to fetch departments",
      };
    }
  },
  countStudentViewsByAgency: async (agency_id, startDate, endDate) => {
    try {
      const dateFilter = buildDateFilter(startDate, endDate);
      const agency = await prisma.pageView.groupBy({
        by: ["agency_id"],
        where: {
          agency_id: Number(agency_id),
          ...dateFilter,
        },
        _count: {
          id: true,
        },
      });
      return { success: true, data: agency };
    } catch (error) {
      console.error("Error in getStudentByAgency", error);
      return { success: false, error: "Internal server error" };
    }
  },
  getStatisticsOverTime: async (startDate, endDate) => {
    try {
      let trend;

      if (startDate && endDate) {
        trend = await prisma.$queryRaw`
        SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS totalViews,
          COUNT(DISTINCT student_id) AS uniqueStudents
        FROM pageview
        WHERE DATE(created_at) BETWEEN ${startDate} AND ${endDate}
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC;
      `;
      } else {
        trend = await prisma.$queryRaw`
        SELECT 
          DATE(created_at) AS date,
          COUNT(*) AS totalViews,
          COUNT(DISTINCT student_id) AS uniqueStudents
        FROM pageview
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC;
      `;
      }

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

  getStatistics: async (startDate, endDate) => {
    try {
      const dateFilter = buildDateFilter(startDate, endDate);
      const totalViewsBigInt = await prisma.pageView.count({
        where: {
          ...dateFilter,
        },
      });
      const grouped = await prisma.pageView.groupBy({
        by: ["student_id"],
        where: {
          ...dateFilter,
        },
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
  getAllPageviewsWithNames: async () => {
    const rows = await prisma.pageView.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        faculty: true,
        department: true,
        student_certificate: true,
        action_type: true,
        created_at: true,
        updated_at: true,
        agency:  { select: { agency_name: true } },
        student: { select: { prefix_name: true, name: true, lname: true } },
      },
    });
  
    return rows.map(r => ({
      id: r.id.toString(),
      faculty: r.faculty,
      department: r.department,
      student_certificate: r.student_certificate,
      action_type: r.action_type,
      created_at: r.created_at,
      updated_at: r.updated_at,
      agency_name: r.agency?.agency_name ?? null,
      student_name: fullName(r.student),
    }));
  },
};

export default PageviewService;
