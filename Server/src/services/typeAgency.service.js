import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const TypeAgencyService = {
  getTypeAll: async () => {
    try {
      return await prisma.typeAgency.findMany();
    } catch (error) {
      console.error("Error fetching type agencies:", error);
      throw {
        status: 500,
        message: "Failed to fetch type agencies",
      };
    }
  },
  getTypeById: async (id) => {
    try {
      const agency = await prisma.typeAgency.findUnique({
        where: {
          id: BigInt(id),
        },
      });
  
      if (!agency) {
        throw {
          status: 404,
          message: `ไม่พบประเภทหน่วยงานที่มี ID = ${id}`,
        };
      }
  
      return agency;
    } catch (error) {
      console.error("Error fetching type agency by ID:", error);
      throw {
        status: 500,
        message: "ไม่สามารถดึงข้อมูลประเภทหน่วยงานได้",
      };
    }
  },     
  createTypeAgency: async (data) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const newAgency = await prisma.typeAgency.create({
        data: {
          ...data,
          created_at: bangkokTime,
          updated_at: bangkokTime,
        },
      });

      newAgency.id = newAgency.id.toString();

      return newAgency;
    } catch (error) {
      console.error("Error creating type agency:", error);

      if (error?.code === "P2002") {
        throw {
          status: 409,
          message: "ชื่อประเภทนี้มีอยู่แล้ว",
        };
      }

      throw {
        status: 500,
        message: "ไม่สามารถสร้างประเภทหน่วยงานได้",
      };
    }
  },
  deleteTypeAgency: async (id) => {
    try {
      const existingTypeAgency = await prisma.typeAgency.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingTypeAgency) {
        throw new Error(`Type Agency with ID ${id} does not exist.`);
      }

      await prisma.typeAgency.delete({
        where: { id: BigInt(id) },
      });

      return true;
    } catch (error) {
      console.error("Failed to delete type agency:", error);
      throw error;
    }
  },
  updateTypeAgency: async (id, updateData) => {
    try {
      const now = new Date();
      const bangkokTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const existingTypeAgency = await prisma.typeAgency.findUnique({
        where: { id: BigInt(id) },
      });

      if (!existingTypeAgency) {
        throw new Error(`TypeAgency with ID ${id} does not exist.`);
      }
      const updatedTypeAgency = await prisma.typeAgency.update({
        where: { id: BigInt(id) },
        data: {
          ...updateData,
          updated_at: bangkokTime,
        },
      });

      return updatedTypeAgency;

    } catch (error) {
      console.error("Failed to update type agency:", error);
      throw error;
    }
  },
};
export default TypeAgencyService;
