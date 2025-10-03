import multer from "multer";
import path from "path";
import AgencyService from "../services/agency.service.js";
import { sendAgencyCreate, sendAgencyUpdateNotification } from "../services/email.service.js";
const replacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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
  getAgencyAllForDropdownController: async (req, res) => {
    try {
      const agencys = await AgencyService.getAgencyAllForDropdown();

      const cleaned = agencys.map((a) => ({
        id: a.id.toString(),
        agency_name: a.agency_name,
      }));

      res.status(200).json({
        success: true,
        data: cleaned,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get agency" });
    }
  },
  getLoggedInController: async (req, res) => {
    try {
      const agencyId = req.agency.id;

      const agencyData = await AgencyService.getAgencyById(agencyId);

      if (!agencyData) {
        return res.status(404).json({ error: "Agency data not found" });
      }

      if (agencyData.id) {
        agencyData.id = agencyData.id.toString();
      }

      const agencyDataStringified = JSON.parse(
        JSON.stringify(agencyData, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
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
          name,
          telephone_number,
          address,
          subdistrict,
          district,
          province,
          postal_code,
          type_id,
          password,
        } = req.body;
        const certificate = req.file
          ? req.file.path
          : "no_certificate_uploaded";

        const lastAgency = await AgencyService.getLastAgency();
        const newId = lastAgency ? Number(lastAgency.id) + 1 : 1;

        const agencyData = {
          id: newId,
          email,
          agency_name,
          department,
          name,
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
        
        AgencyService.findAllOfficerEmailsAndNames()
          .then(emailOfficer => {
            emailOfficer.forEach((officer, index) => {
              setTimeout(() => {
                sendAgencyCreate(officer.email, officer.first_name, agency_name);
              }, index * 300);
            });
          })
          .catch(error => console.error('Error queuing emails:', error));
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
      
      if (error.code === 'FOREIGN_KEY_CONSTRAINT') {
        return res.status(409).json({ 
          success: false,
          error: "Cannot delete agency",
          message: "foreign key constraint"
        });
      }
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({ 
          success: false,
          error: "Agency not found",
          message: "The agency you're trying to delete does not exist"
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: "Failed to delete agency" 
      });
    }
  },
  updateRejectionAgencyController: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        const { id } = req.params;
        let updateData = req.body;

        if (!req.file) {
          return res
            .status(400)
            .json({ error: "No certificate file uploaded." });
        }

        updateData.certificate = req.file.path;

        const updatedAgency = await AgencyService.updateRejectionAgency(
          id,
          updateData
        );

        const responseData = JSON.parse(
          JSON.stringify(updatedAgency, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        );

        // ส่งการตอบกลับก่อน จากนั้นส่งอีเมลแจ้งเตือนเจ้าหน้าที่
        res.status(200).json({
          success: true,
          message: "Successfully updated agency.",
          data: responseData,
        });

        // ส่งอีเมลแจ้งเตือนเจ้าหน้าที่ในพื้นหลัง
        setTimeout(() => {
          AgencyService.findAllOfficerEmailsAndNames()
            .then(emailOfficer => {
              emailOfficer.forEach((officer, index) => {
                setTimeout(() => {
                  sendAgencyUpdateNotification(officer.email, officer.first_name, updatedAgency.agency_name);
                }, index * 1000); // ส่งทีละรอบห้าง 1 วินาที
              });
            })
            .catch(error => {
              console.error("Error fetching officer emails for update notification:", error);
            });
        }, 100);
res.status(200).json({
          success: true,
          message: "Successfully updated agency.",
          data: responseData,
        });
      } catch (error) {
        console.error(
          "An error occurred while updating the unit:",
          error.message
        );
        res
          .status(500)
          .json({ error: error.message || "Unable to update agency" });
      }
    });
  },
  checkEmailController: async (req, res) => {
    const { email } = req.body;

    try {
      const exists = await AgencyService.checkEmailExists(email);
      res.status(200).json({ exists });
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateAgencyController: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ error: "There is no information for updates." });
      }

      const updateAgencyData = await AgencyService.updateAgency(id, updateData);

      const responseData = JSON.parse(
        JSON.stringify(updateAgencyData, replacer)
      );

      res.status(200).json({
        success: true,
        message: "Successfully updated agency.",
        data: responseData,
      });
    } catch (error) {
      console.error(
        "An error occurred while updating the unit:",
        error.message
      );
      res
        .status(500)
        .json({ error: error.message || "Unable to update agency" });
    }
  },
  checkTelephoneController: async (req, res) => {
    const { telephone_number } = req.body;

    try {
      const exists = await AgencyService.checkTelephoneExists(telephone_number);
      res.status(200).json({ exists });
    } catch (error) {
      console.error("Error checking telephone:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  verifyPasswordAgencyController: async (req, res, next) => {
    try {
      const agencyId = req.params.id;
      const { password } = req.body;
      if (!password) {
        const err = new Error("กรุณาระบุรหัสผ่าน");
        err.status = 400;
        throw err;
      }
      await AgencyService.verifyPassword(agencyId, password);
      res.json({ success: true, message: "ยืนยันรหัสผ่านเรียบร้อย" });
    } catch (err) {
      next(err);
    }
  },
  latestSearchController: async (req, res) => {
    try {
      const agencyId = req.params.id;
      const result = await AgencyService.latestSearch(agencyId);
      res.json({
        success: true,
        message: "บันทึกการค้นหาเรียบร้อย",
        data: result,
      });
    } catch (error) {
      console.error("Error saving latest search:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default AgencyController;
