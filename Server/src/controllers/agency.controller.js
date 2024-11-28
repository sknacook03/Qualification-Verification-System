import AgencyService from "../services/agency.service.js";

// Custom replacer function สำหรับแปลง BigInt เป็น String
const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString(); // แปลง BigInt เป็น String
  }
  return value;
};

const AgencyController = {
  getAgencyController: async (req, res) => {
    try {
      const agencys = await AgencyService.getAgencyAll();

      // ใช้ JSON.stringify กับ replacer function เพื่อแปลง BigInt เป็น String
      const responseData = JSON.parse(JSON.stringify(agencys, replacer));

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get agency" });
    }
  },

  createAgencyController: async (req, res) => {
    try {
      const {
        email,
        agency_name,
        telephone_number,
        address,
        subdistrict,
        district,
        province,
        postal_code,
        type_id,
        password,
        certificate,
      } = req.body;

      const lastAgency = await AgencyService.getLastAgency();
      const newId = lastAgency ? Number(lastAgency.id) + 1 : 1;

      const agencyData = {
        id: newId,
        email,
        agency_name,
        telephone_number,
        address,
        subdistrict,
        district,
        province,
        postal_code,
        type_id,
        password,
        certificate,
      };

      const agency = await AgencyService.createAgency(agencyData);

      // ใช้ JSON.stringify กับ replacer function เพื่อแปลง BigInt เป็น String
      const responseData = JSON.parse(JSON.stringify(agency, replacer));

      res.status(201).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create agency" });
    }
  },
  deleteAgencyController: async (req, res) => {
    try {
      const agencyId = req.params.id;
  
      await AgencyService.deleteAgency(agencyId);
  
      await AgencyService.resetAutoIncrement();
  
      res.status(200).json({
        success: true,
        message: "Agency deleted and AUTO_INCREMENT reset successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete agency" });
    }
  },
  
};

export default AgencyController;
