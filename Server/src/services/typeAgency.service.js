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
      createTypeAgency: async (data) => {
        try {
          const newAgency = await prisma.typeAgency.create({
            data,
          });
      
          newAgency.id = newAgency.id.toString();
          
          return newAgency;
        } catch (error) {
          console.error("Error creating type agency:", error);
      
          if (error.code === "P2002") {
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
      
}
export default TypeAgencyService;