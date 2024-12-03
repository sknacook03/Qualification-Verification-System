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

      const token = jwt.sign(
        { id: agency.id.toString(), email: agency.email, role: "agency" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { message: "Login successful", token };
    } catch (error) {
      if (error.message === "Agency not found") {
        throw new Error("Agency not found"); // เก็บข้อผิดพลาดไว้เพื่อให้ Controller จัดการ
      }
      if (error.message === "Password is incorrect") {
        throw new Error("Password is incorrect");
      }
      console.error("Failed to login:", error);
      throw error; // โยน error ที่เกิดขึ้นให้ Controller จัดการ
    }
  },
};
export default AuthService;
