import OfficerService from "../services/officer.service.js";

const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

const OfficerController = {
  getOfficerController: async (req, res) => {
    try {
      const officer = req.officer;
      console.log("Officer accessing this route:", officer);
      const officers = await OfficerService.getOfficerAll();

      const responseData = JSON.parse(JSON.stringify(officers, replacer));

      res.status(200).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get officer" });
    }
  },
  getLoggedInController: async (req, res) => {
    try {
      if (!req.officer) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No officer data found" });
      }
      const officerId = req.officer.id;

      const officerData = await OfficerService.getOfficerById(officerId);

      if (!officerData) {
        return res.status(404).json({ error: "Officer data not found" });
      }
      if (officerData.id) {
        officerData.id = officerData.id.toString();
      }
      const officerDataStringified = JSON.parse(
        JSON.stringify(officerData, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.json({ data: officerDataStringified });
    } catch (error) {
      console.error("Error fetching officer data:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createOfficerController: async (req, res) => {
    try {
      const { email, password, first_name, last_name } = req.body;

      const lastOfficer = await OfficerService.getLastOfficer();
      const newId = lastOfficer ? Number(lastOfficer.id) + 1 : 1;

      const officerData = {
        id: newId,
        email,
        password,
        first_name,
        last_name,
      };

      const officer = await OfficerService.createOfficer(officerData);
      const responseData = JSON.parse(JSON.stringify(officer, replacer));

      res.status(201).json({
        success: true,
        data: responseData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create officer" });
    }
  },
  deleteOfficerController: async (req, res) => {
    try {
      const officerId = req.params.id;

      await OfficerService.deleteOfficer(officerId);

      await OfficerService.resetAutoIncrement();

      res.status(200).json({
        success: true,
        message: "Officer deleted and AUTO_INCREMENT reset successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete officer" });
    }
  },
};
export default OfficerController;
