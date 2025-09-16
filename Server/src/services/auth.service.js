import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

const AuthService = {
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

      if (agency.status_approve === "pending") {
        throw new Error("Agency is not approve")
      }

      if (agency.status_approve === "rejected") {
        throw new Error("Agency is rejected")
      }

      const token = jwt.sign(
        { id: agency.id.toString(), email: agency.email, role: agency.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
      );

      return { message: "Login successful", token };
    } catch (error) {
      if (error.message === "Agency not found") {
        throw new Error("Agency not found");
      }
      if (error.message === "Password is incorrect") {
        throw new Error("Password is incorrect");
      }
      if (error.message === "Agency is not approve") {
        throw new Error("Agency is not approve");
      }
      if (error.message === "Agency is rejected") {
        throw new Error("Agency is rejected");
      }
      console.error("Failed to login:", error);
      throw error;
    }
  },

  loginOfficer: async (email, password) => {
    try {
      const officer = await prisma.officer.findUnique({
        where: { email },
      });

      if (!officer) {
        throw new Error("Officer not found");
      }

      const isPasswordValid = await bcrypt.compare(password, officer.password);
      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
        { id: officer.id.toString(), email: officer.email, role: officer.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
      );

      return { message: "Login successful", token };
    } catch (error) {
      if (error.message === "Officer not found") {
        throw new Error("Officer not found");
      }
      if (error.message === "Password is incorrect") {
        throw new Error("Password is incorrect");
      }
      console.error("Failed to login:", error);
      throw error;
    }
  },

  logout: async () => {
    return { message: "Logout successful" };
  },
};
export default AuthService;
