import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AgencyService = {
  getAgencyAll: async () => {
    try {
      return await prisma.agency.findMany();
    } catch (error) {
      console.error("Error fetching agencies:", error);
      throw {
        status: 500,
        message: "Failed to fetch agencies",
      };
    }
  },
  getAgencyAllForDropdown: async () => {
    try {
      return await prisma.agency.findMany({
        select: {
          id: true,
          agency_name: true,
        },
      });
    } catch (error) {
      console.error("Error fetching agencies:", error);
      throw {
        status: 500,
        message: "Failed to fetch agencies",
      };
    }
  },
  getAgencyById: async (id) => {
    try {
      const agency = await prisma.agency.findUnique({
        where: { id: BigInt(id) },
      });

      if (!agency) {
        console.error("No agency found for ID:", id);
      }
      return agency;
    } catch (error) {
      console.error("Error in getAgencyById:", error.message);
      throw error;
    }
  },
  createAgency: async (agency) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      
      const existingAgency = await prisma.agency.findUnique({
        where: {
          email: agency.email,
        },
      });

      if (existingAgency) {
        throw new Error("Email already in use by another agency");
      }

      const existingOfficer = await prisma.officer.findUnique({
        where: {
          email: agency.email,
        },
      });

      if (existingOfficer) {
        throw new Error("Email already in use by an officer");
      }

      const {
        email,
        agency_name,
        department,
        name = "",
        telephone_number,
        address,
        subdistrict,
        district,
        province,
        postal_code,
        type_id,
        password,
        certificate = null,
        role = "agency",
        status_approve = "pending",
      } = agency;

      if (!type_id) {
        throw new Error("Type ID is required");
      }

      const typeAgency = await prisma.typeAgency.findUnique({
        where: { id: type_id },
      });

      if (!typeAgency) {
        throw new Error("Invalid Type ID");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return prisma.agency.create({
        data: {
          email,
          agency_name,
          department,
          name: name ? name.trim() : "",
          telephone_number,
          address: address || "-",
          subdistrict: subdistrict || "-",
          district: district || "-",
          province: province || "-",
          postal_code: postal_code || "-",
          typeAgency: {
            connect: { id: type_id },
          },
          password: hashedPassword,
          certificate,
          role,
          status_approve,
          created_at: bangkokTime,
          updated_at: bangkokTime,
        },
      });
    } catch (error) {
      console.error("Error creating agency:", error);
      throw error;
    }
  },
  deleteAgency: async (id) => {
    try {
      const agencyId = BigInt(id);

      const existingAgency = await prisma.agency.findUnique({
        where: { id: agencyId },
      });
      if (!existingAgency) {
        const error = new Error(`Agency with ID ${id} does not exist.`);
        error.code = 'NOT_FOUND';
        error.statusCode = 404;
        throw error;
      }

      await prisma.$transaction([
        prisma.approvalLog.deleteMany({
          where: { agency_id: agencyId },
        }),

        prisma.agency.delete({
          where: { id: agencyId },
        }),
      ]);

      return true;
    } catch (error) {
      console.error("Failed to delete agency:", error);
      
      if (error.code === 'P2003') {
        const constraintError = new Error('Cannot delete agency because it has related data');
        constraintError.code = 'FOREIGN_KEY_CONSTRAINT';
        constraintError.statusCode = 409;
        throw constraintError;
      }
      
      if (error.code === 'P2025') {
        const notFoundError = new Error('Agency not found');
        notFoundError.code = 'NOT_FOUND';
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      
      throw error;
    }
  },
  findAllOfficerEmailsAndNames: async () => {
    try {
      const officers = await prisma.officer.findMany({
        select: {
          email: true,
          first_name: true,
        },
      });

      if (!officers || officers.length === 0) {
        console.error("No officers found.");
      }

      return officers.map((officer) => ({
        email: officer.email,
        first_name: officer.first_name,
      }));
    } catch (error) {
      console.error("Error finding officers' emails:", error);
      throw new Error("Database error");
    }
  },

  updateRejectionAgency: async (id, updateData) => {
    try {
      const existAgency = await prisma.agency.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existAgency) {
        throw new Error(`Agency with ID ${id} does not exist.`);
      }
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      let updatePayload = { ...updateData, updated_at: bangkokTime };

      if (typeof updatePayload.name === "string") {
        updatePayload.name = updatePayload.name.trim();
      }

      if (Array.isArray(updateData.subdistrict)) {
        updatePayload.subdistrict = updateData.subdistrict[0] || '';
      }
      if (Array.isArray(updateData.district)) {
        updatePayload.district = updateData.district[0] || '';
      }
      if (Array.isArray(updateData.province)) {
        updatePayload.province = updateData.province[0] || '';
      }

      if (updateData.password) {
        updatePayload.password = await bcrypt.hash(updateData.password, 10);
      } else {
        delete updatePayload.password;
      }

      if (updateData.postalCode) {
        updatePayload.postal_code = updateData.postalCode;
        delete updatePayload.postalCode;
      }

      if (updateData.type_id) {
        updatePayload.typeAgency = {
          connect: { id: parseInt(updateData.type_id) },
        };
        delete updatePayload.type_id;
      }

      const updatedAgency = await prisma.agency.update({
        where: { id: BigInt(id) },
        data: updatePayload,
      });

      return updatedAgency;
    } catch (error) {
      console.error("Failed to update agency:", error);
      throw error;
    }
  },
  updateAgency: async (id, updateData) => {
    try {
      const { password, ...restData } = updateData;

      const data = { ...restData };

      if (typeof data.name === "string") {
        data.name = data.name.trim();
      }

      if (password) {
        data.password = await bcrypt.hash(password, 10);
      }

      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      data.updated_at = bangkokTime;

      const updatedAgency = await prisma.agency.update({
        where: { id: BigInt(id) },
        data,
      });

      return updatedAgency;
    } catch (error) {
      console.error("Failed to update agency:", error);
      throw error;
    }
  },
  getLastAgency: async () => {
    try {
      const agency = await prisma.agency.findFirst({
        orderBy: {
          id: "desc",
        },
      });
      return agency;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get last agency");
    }
  },
  resetAutoIncrement: async () => {
    try {
      const maxIdResult = await prisma.agency.aggregate({
        _max: {
          id: true,
        },
      });

      const maxId = maxIdResult._max.id ? maxIdResult._max.id.toString() : "0";

      const newAutoIncrement = BigInt(maxId) + 1n;

      await prisma.$executeRawUnsafe(
        `ALTER TABLE agency AUTO_INCREMENT = ${newAutoIncrement}`
      );
    } catch (error) {
      console.error("Failed to reset AUTO_INCREMENT:", error);
      throw new Error("Failed to reset AUTO_INCREMENT");
    }
  },
  checkEmailExists: async (email) => {
    
    const existingAgency = await prisma.agency.findUnique({
      where: { email },
    });
    
    const existingOfficer = await prisma.officer.findUnique({
      where: { email },
    });
    
    return !!(existingAgency || existingOfficer);
  },
  checkTelephoneExists: async (telephone_number) => {
    const existingTelAgency = await prisma.agency.findUnique({
      where: { telephone_number },
    });
    return !!existingTelAgency;
  },
  verifyPassword: async (id, plainPassword) => {
    const agency = await AgencyService.getAgencyById(id);
    if (!agency) {
      const err = new Error("ไม่พบหน่วยงาน");
      err.status = 404;
      throw err;
    }
    const match = await bcrypt.compare(plainPassword, agency.password);
    if (!match) {
      const err = new Error("รหัสผ่านไม่ถูกต้อง");
      err.status = 401;
      throw err;
    }
    return true;
  },
  latestSearch: async (id) => {
    try {
      const Latest = await prisma.pageView.findMany({
        orderBy: {
          updated_at: "desc",
        },
        where: {
          agency_id: BigInt(id),
        },
        include: {
          agency: true,
          student: true,
        },
      });
      const converted = JSON.parse(
        JSON.stringify(Latest, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      return converted;
    } catch (error) {
      console.error("Failed to latestSearch:", error);
      throw new Error("Failed to latestSearch");
    }
  },
};

export default AgencyService;
