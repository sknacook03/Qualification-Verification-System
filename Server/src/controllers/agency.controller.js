import multer from "multer";
import path from "path";
import AgencyService from "../services/agency.service.js";

const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString(); 
  }
  return value;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // กำหนดชื่อไฟล์ใหม่
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // ขนาดไฟล์ไม่เกิน 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".png", ".jpg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
}).single("certificate");

const AgencyController = {
  getAgencyController: async (req, res) => {
    try {
      const agency = req.agency;
      console.log("Agency accessing this route:", agency);
      const agencys = await AgencyService.getAgencyAll();

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
  getLoggedInController: async (req, res) => {
    try {
      const agencyId = req.agency.id; // ข้อมูลที่มาจาก middleware
      
      const agencyData = await AgencyService.getAgencyById(agencyId);
  
      if (!agencyData) {
        // ถ้าไม่พบข้อมูล agency
        return res.status(404).json({ error: "Agency data not found" });
      }
  
      // ตรวจสอบและแปลงค่า BigInt เป็น string ก่อนส่งกลับ
      if (agencyData.id) {
        agencyData.id = agencyData.id.toString(); // แปลง BigInt เป็น string
      }
  
      // ตรวจสอบว่า `agencyData` มี field ที่เป็น BigInt อื่นๆ หรือไม่
      // ใช้ฟังก์ชันในการแปลงค่าทั้งหมดเป็น string
      const agencyDataStringified = JSON.parse(
        JSON.stringify(agencyData, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
  
      res.json({ data: agencyDataStringified });
    } catch (error) {
      console.error("Error fetching agency data:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  
  createAgencyController: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const {
          email,
          agency_name,
          department,
          telephone_number,
          address,
          subdistrict,
          district,
          province,
          postal_code,
          type_id,
          password,
        } = req.body;
        console.log(req.body); 
        const certificate = req.file ? req.file.path : "no_certificate_uploaded";;

        const lastAgency = await AgencyService.getLastAgency();
        const newId = lastAgency ? Number(lastAgency.id) + 1 : 1;

        const agencyData = {
          id: newId,
          email,
          agency_name,
          department,
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
        const responseData = JSON.parse(JSON.stringify(agency, replacer));

        res.status(201).json({
          success: true,
          data: responseData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create agency" });
      }
    });
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
  updateAgencyController: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "There is no information for updates." });
      }
  
      const updateAgencyData = await AgencyService.updateAgency(id, updateData);
  
      const responseData = JSON.parse(JSON.stringify(updateAgencyData, replacer));
  
      res.status(200).json({
        success: true,
        message: "Successfully updated agency.",
        data: responseData,
      });
    } catch (error) {
      console.error("An error occurred while updating the unit:", error.message);
      res.status(500).json({ error: error.message || "Unable to update agency" });
    }
  },
  checkEmailController: async (req, res) => {
    const { email } = req.body;
  
    try {
      const exists = await AgencyService.checkEmailExists(email);
      res.status(200).json({ exists });
    } catch (error) {
      console.error('Error checking email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  checkTelephoneController: async (req, res) => {
    const { telephone_number } = req.body;
  
    try {
      const exists = await AgencyService.checkTelephoneExists(telephone_number);
      res.status(200).json({ exists });
    } catch (error) {
      console.error('Error checking telephone:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
};

export default AgencyController;
