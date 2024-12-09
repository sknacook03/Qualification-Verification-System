import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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
  getAgencyById: async (id) => {
    try {
      console.log("Fetching agency by ID:", id);
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
      const existingAgency = await prisma.agency.findUnique({
        where: {
          email: agency.email,
        },
      });

      if (existingAgency) {
        throw new Error("Email already in use");
      }
      const {
        email,
        agency_name,
        department,
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

      console.log("Received type_id:", agency.type_id);

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
        },
      });
    } catch (error) {
      console.error("Error creating agency:", error);
      throw error;
    }
  },
  deleteAgency: async (id) => {
    try {
      const existingAgency = await prisma.agency.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingAgency) {
        throw new Error(`Agency with ID ${id} does not exist.`);
      }

      await prisma.agency.delete({
        where: { id: BigInt(id) },
      });

      return true;
    } catch (error) {
      console.error("Failed to delete agency:", error);
      throw error;
    }
  },
  updateAgency: async (id, updateData) => {
    try {
      const existAgency = await prisma.agency.findUnique({
        where: { id: BigInt(id) }
      });
      
      if (!existAgency) {
        throw new Error(`Agency with ID ${id} does not exist.`);
      }

      const updatedAgency = await prisma.agency.update({
        where: { id: BigInt(id) },
        data: updateData,
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
    return !!existingAgency;
  },
  checkTelephoneExists: async (telephone_number) => {
    const existingTelAgency = await prisma.agency.findUnique({
      where: { telephone_number },
    });
    return !!existingTelAgency;
  }
  
};

export default AgencyService;
