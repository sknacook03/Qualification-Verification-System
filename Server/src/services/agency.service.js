import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
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
            connect: { id: type_id },  // ใส่ type_id หรือ type_name ที่ตรงกับฐานข้อมูลของคุณ
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
  loginAgency: async (email, password) => {
    try {
      const agency = await prisma.agency.findUnique({
        where: { email },
      });

      if (!agency) {
        throw new Error("Agency not found");
      }
      
      const isPasswordValid = await bcrypt.compare(password, agency.password);
      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
        { id: agency.id.toString(), email: agency.email, role: 'agency' },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { message: "Login successful", token };
    } catch (error) {
      if (error.message === "Agency not found") {
        throw new Error("Agency not found");  // เก็บข้อผิดพลาดไว้เพื่อให้ Controller จัดการ
      }
      if (error.message === "Password is incorrect") {
        throw new Error("Password is incorrect");
      }
      console.error("Failed to login:", error);
      throw error; // โยน error ที่เกิดขึ้นให้ Controller จัดการ
    }
  },
};

export default AgencyService;
