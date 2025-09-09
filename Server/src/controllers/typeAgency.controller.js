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
    getTypeAgencyByIdController: async (req, res) => {
      try {
        const { id } = req.params;
        const typeAgency = await TypeAgencyService.getTypeById(id);
        const responseData = JSON.parse(JSON.stringify(typeAgency, replacer));

        res.status(200).json({
          success: true,
          data: responseData,
        });
      } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Failed to get type agency" });
      }
    },
    createAgencyController: async (req, res) => {
      try {
        let { type_name } = req.body;
    
        if (!type_name || type_name.trim() === "") {
          return res.status(400).json({
            message: "กรุณาระบุชื่อประเภทหน่วยงาน",
          });
        }
        type_name = type_name.trim().normalize('NFC').toLowerCase();
        
        const newAgency = await TypeAgencyService.createTypeAgency({ type_name });
    
        const responseData = JSON.parse(JSON.stringify(newAgency, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value 
        ));
    
        return res.status(201).json({
          message: "สร้างประเภทหน่วยงานสำเร็จ",
          data: responseData,  
        });
      } catch (error) {
        console.error("Error in createAgencyController:", error);
    
        return res.status(error.status || 500).json({
          message: error.message || "เกิดข้อผิดพลาดในระบบ",
        });
      }
    },
    
    deleteTypeAgencyController: async (req, res) =>{
      try {
        const { id } = req.params;
    
        await TypeAgencyService.deleteTypeAgency(id);
    
        res.status(200).json({
          success: true,
          message: "ลบประเภทหน่วยงานสำเร็จ",
        });
      } catch (error) {
        console.error("Error in deleteTypeAgencyController:", error);
        
        if (error.code === 'FOREIGN_KEY_CONSTRAINT') {
          return res.status(409).json({ 
            success: false,
            error: "Cannot delete type agency",
            message: "foreign key constraint"
          });
        }
        
        if (error.code === 'NOT_FOUND') {
          return res.status(404).json({ 
            success: false,
            error: "Type agency not found",
            message: "The type agency you're trying to delete does not exist"
          });
        }
        
        res.status(500).json({ 
          success: false,
          error: "Failed to delete type agency" 
        });
      }
    },
    updateTypeAgencyController: async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: "There is no information for updates." });
        }
        const updatedTypeAgency = await TypeAgencyService.updateTypeAgency(id, updateData);
        const responseData = JSON.parse(JSON.stringify(updatedTypeAgency, replacer));
        res.status(200).json({
          success: true,
          message: "อัปเดตประเภทหน่วยงานสำเร็จ",
          data: responseData,
        });
      } catch (error) {
        console.error("Error in updateTypeAgencyController:", error.message);
        res.status(500).json({ error: error.message || "Unable to update TypeAgency" });
      }
    },

    
}
export default TypeAgencyController;