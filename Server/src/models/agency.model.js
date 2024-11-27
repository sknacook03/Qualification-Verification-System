import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createAgency =  async (agency) => {
    const hash = await bcrypt.hash(agency.password, 10);
    return prisma.agency.create({
        data: {
            email: agency.email,

        }
    })
}
