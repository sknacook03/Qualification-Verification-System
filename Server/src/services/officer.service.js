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
      const existingOfficer = await prisma.officer.findUnique({
        where: {
          email: officer.email,
        },
      });

      if (existingOfficer) {
        throw new Error("Email already in use");
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
        throw new Error(`Officer with ID ${id} does not exist.`);
      }

      await prisma.officer.delete({
        where: { id: BigInt(id) },
      });

      return true;
    } catch (error) {
      console.error("Failed to delete officer:", error);
      throw error;
    }
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
      console.log("Fetching officer by ID:", id);
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
};
export default OfficerService;
