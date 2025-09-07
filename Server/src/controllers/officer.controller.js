import OfficerService from "../services/officer.service.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "../services/email.service.js";
import agencyService from "../services/agency.service.js";

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
      
      if (error.code === 'FOREIGN_KEY_CONSTRAINT') {
        return res.status(409).json({ 
          success: false,
          error: "Cannot delete officer",
          message: "foreign key constraint"
        });
      }
      
      if (error.code === 'NOT_FOUND') {
        return res.status(404).json({ 
          success: false,
          error: "Officer not found",
          message: "The officer you're trying to delete does not exist"
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: "Failed to delete officer" 
      });
    }
  },
  updateOfficerController: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password } = req.body;
  
      if (!first_name && !last_name && !email && !password) {
        return res
          .status(400)
          .json({ success: false, message: "ไม่มีข้อมูลให้แก้ไข" });
      }
  
      const updated = await OfficerService.updateOfficer(id, {
        first_name,
        last_name,
        email,
        password,
      });
  
      res.status(200).json({
        success: true,
        message: "อัพเดตข้อมูลเจ้าหน้าที่สำเร็จ",
        data: updated,
      });
    } catch (err) {
      console.error("Error updating officer:", err);
      const status = err.status || 500;
      res.status(status).json({
        success: false,
        message: err.message || "ไม่สามารถอัพเดตข้อมูลได้",
      });
    }
  },
  sendAgency: async (req, res) => {
    try {
      console.log("🔹 Data ที่ได้รับจาก Frontend:", req.body);
      const { agency_id, email, agency, status_approved, reason } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      if (!agency)
        return res.status(400).json({ message: "Agency name is required" });
      if (!status_approved)
        return res.status(400).json({ message: "Approval status is required" });

      const agencyEmail = await OfficerService.findUserByEmail(email);
      console.log("🔹 ข้อมูลจากฐานข้อมูล:", agencyEmail);
      if (!agencyEmail)
        return res.status(404).json({ message: "Agency not found" });
      const agencyId = agency_id ? Number(agency_id) : Number(agencyEmail.id);
      console.log("🔹 agencyId ที่ใช้:", agencyId);

      if (status_approved === "approved") {
        await sendApprovalEmail(email, agency);
      } else if (status_approved === "rejected") {
        if (!reason)
          return res
            .status(400)
            .json({ message: "Rejection reason is required" });
        await sendRejectionEmail(email, agency, reason, agencyId);
      } else {
        return res.status(400).json({ message: "Invalid approval status" });
      }

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error in sendAgency:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  rejectVerifyToken: async (req, res) => {
    try {
      console.log("🔹 User ที่ถอดรหัสจาก Token:", req.user.id);
      if (!req.user || !req.user.id) {
        console.error("ไม่พบ ID จาก Token");
        return res
          .status(400)
          .json({ success: false, message: "ไม่พบ ID จาก Token" });
      }

      console.log("🔹 Fetching agency by ID:", req.user.id);
      const rejectedData = await agencyService.getAgencyById(req.user.id);

      if (!rejectedData) {
        console.error("ไม่พบข้อมูลของ Agency:", req.user.id);
        return res
          .status(404)
          .json({ success: false, message: "ไม่พบข้อมูลที่ถูก Reject" });
      }

      const responseData = JSON.parse(
        JSON.stringify(rejectedData, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );

      res.json({ success: true, data: responseData });
    } catch (error) {
      console.error("Error verifying token:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  verifyPasswordOfficerController: async (req, res, next) => {
    try {
      const officerId = req.params.id;
      const { password } = req.body;
      if (!password) {
        const err = new Error("กรุณาระบุรหัสผ่าน");
        err.status = 400;
        throw err;
      }
      await OfficerService.verifyPassword(officerId, password);
      res.json({ success: true, message: "ยืนยันรหัสผ่านเรียบร้อย" });
    } catch (err) {
      next(err);
    }
  },
  checkOfficerEmail: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "กรุณาระบุอีเมล" });
      }
      const exists = await OfficerService.checkEmailOfficerExists(email);
      return res.json({ exists });
    } catch (error) {
      console.error("Error in checkEmail:", error);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในระบบ" });
    }
  },
};
export default OfficerController;
