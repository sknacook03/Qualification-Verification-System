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
}
export default TypeAgencyService;