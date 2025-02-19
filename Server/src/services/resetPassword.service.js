import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const ResetServices = {
    findUserByEmail: async (email) => {
        try {
            return await prisma.agency.findUnique({ where: { email } });
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Database error");
        }
    },

    createOrUpdateResetCode: async (email) => {
        try {
            const resetCode = crypto.randomInt(100000, 999999).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            await prisma.passwordReset.upsert({
                where: { email },
                update: { code: resetCode, expiresAt },
                create: { email, code: resetCode, expiresAt },
            });

            return resetCode;
        } catch (error) {
            console.error("Error creating or updating reset code:", error);
            throw new Error("Database error");
        }
    },

    findResetRecord: async (email, code) => {
        try {
            return await prisma.passwordReset.findFirst({
                where: { email, code, expiresAt: { gte: new Date() } },
            });
        } catch (error) {
            console.error("Error finding reset record:", error);
            throw new Error("Database error");
        }
    },

    updatePassword: async (email, hashedPassword) => {
        try {
            const now = new Date();
            const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
            return await prisma.agency.update({
                where: { email },
                data: { 
                password: hashedPassword,
                updated_at: bangkokTime,
            },
            });
        } catch (error) {
            console.error("Error updating password:", error);
            throw new Error("Database error");
        }
    },

    deleteResetRecord: async (email) => {
        try {
            return await prisma.passwordReset.deleteMany({ where: { email } });
        } catch (error) {
            console.error("Error deleting reset record:", error);
            throw new Error("Database error");
        }
    },
};

export default ResetServices;
