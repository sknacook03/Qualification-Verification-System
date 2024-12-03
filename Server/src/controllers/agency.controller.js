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
      const agency = req.agency; // ข้อมูลจาก JWT
      console.log("Agency accessing this route:", agency);
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
        console.log(req.body);  // ตรวจสอบค่าที่ได้รับจากฟอร์ม
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
};

export default AgencyController;
