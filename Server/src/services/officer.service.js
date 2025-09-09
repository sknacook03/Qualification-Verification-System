import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const OfficerService = {
  getOfficerAll: async () => {
    try {
      return await prisma.officer.findMany();
    } catch (error) {
      console.error("Error fetching officer:", error);
      throw {
        status: 500,
        message: "Failed to fetch officer",
      };
    }
  },
  createOfficer: async (officer) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      
      const existingOfficer = await prisma.officer.findUnique({
        where: {
          email: officer.email,
        },
      });

      if (existingOfficer) {
        throw new Error("Email already in use by another officer");
      }

      const existingAgency = await prisma.agency.findUnique({
        where: {
          email: officer.email,
        },
      });

      if (existingAgency) {
        throw new Error("Email already in use by an agency");
      }

      const {
        email,
        password,
        first_name,
        last_name,
        role = "admin",
      } = officer;

      const hashedPassword = await bcrypt.hash(password, 10);

      return prisma.officer.create({
        data: {
          email,
          password: hashedPassword,
          first_name,
          last_name,
          role,
          created_at: bangkokTime,
          updated_at: bangkokTime,
        },
      });
    } catch (error) {
      console.error("Error creating officer:", error);
      throw error;
    }
  },
  deleteOfficer: async (id) => {
    try {
      const existingOfficer = await prisma.officer.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingOfficer) {
        const error = new Error(`Officer with ID ${id} does not exist.`);
        error.code = 'NOT_FOUND';
        error.statusCode = 404;
        throw error;
      }

      await prisma.officer.delete({
        where: { id: BigInt(id) },
      });

      return true;
    } catch (error) {
      console.error("Failed to delete officer:", error);
      
      if (error.code === 'P2003') {
        const constraintError = new Error('Cannot delete officer because they have related data');
        constraintError.code = 'FOREIGN_KEY_CONSTRAINT';
        constraintError.statusCode = 409;
        throw constraintError;
      }
      
      if (error.code === 'P2025') {
        const notFoundError = new Error('Officer not found');
        notFoundError.code = 'NOT_FOUND';
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      
      throw error;
    }
  },
  updateOfficer: async (id, updateData) => {
    const { first_name, last_name, email, password } = updateData;

    const data = { first_name, last_name, email };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const now = new Date();
    data.updated_at = new Date(now.getTime() + 7 * 3600 * 1000);

    const updated = await prisma.officer.update({
      where: { id: BigInt(id) },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    return {
      ...updated,
      id: updated.id.toString(),
    };
  },
  getLastOfficer: async () => {
    try {
      const officer = await prisma.officer.findFirst({
        orderBy: {
          id: "desc",
        },
      });
      return officer;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get last officer");
    }
  },
  resetAutoIncrement: async () => {
    try {
      const maxIdResult = await prisma.officer.aggregate({
        _max: {
          id: true,
        },
      });

      const maxId = maxIdResult._max.id ? maxIdResult._max.id.toString() : "0";

      const newAutoIncrement = BigInt(maxId) + 1n;

      await prisma.$executeRawUnsafe(
        `ALTER TABLE officer AUTO_INCREMENT = ${newAutoIncrement}`
      );
    } catch (error) {
      console.error("Failed to reset AUTO_INCREMENT:", error);
      throw new Error("Failed to reset AUTO_INCREMENT");
    }
  },
  getOfficerById: async (id) => {
    try {
      const officer = await prisma.officer.findUnique({
        where: { id: BigInt(id) },
      });

      if (!officer) {
        console.error("No officer found for ID:", id);
      }
      return officer;
    } catch (error) {
      console.error("Error in getOfficerById:", error.message);
      throw error;
    }
  },
  findUserByEmail: async (email) => {
    try {
      const agency = await prisma.agency.findUnique({ where: { email } });
      if (!agency) {
        console.error("Agency not found for email:", email);
      }
      return agency;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database error");
    }
  },
  verifyPassword: async (id, plainPassword) => {
    const officer = await OfficerService.getOfficerById(id);
    if (!officer) {
      const err = new Error("ไม่พบเจ้าหน้าที่");
      err.status = 404;
      throw err;
    }
    const match = await bcrypt.compare(plainPassword, officer.password);
    if (!match) {
      const err = new Error("รหัสผ่านไม่ถูกต้อง");
      err.status = 401;
      throw err;
    }
    return true;
  },
  checkEmailOfficerExists: async (email) => {
    const officer = await prisma.officer.findUnique({
      where: { email },
    });

    const agency = await prisma.agency.findUnique({
      where: { email },
    });
    
    return !!(officer || agency);
  },
};
export default OfficerService;
