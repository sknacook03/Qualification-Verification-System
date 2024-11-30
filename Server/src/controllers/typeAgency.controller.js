import TypeAgencyService from "../services/typeAgency.service.js";
const replacer = (key, value) => {
    if (typeof value === "bigint") {
      return value.toString(); 
    }
    return value;
  };
const TypeAgencyController = {
    getAgencyController: async (req, res) => {
      try {
        const typeAgencys = await TypeAgencyService.getTypeAll();
  
        const responseData = JSON.parse(JSON.stringify(typeAgencys, replacer));
  
        res.status(200).json({
          success: true,
          data: responseData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get type agency" });
      }
    },
}
export default TypeAgencyController;