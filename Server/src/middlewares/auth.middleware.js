import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token; // ใช้ ?. ป้องกันข้อผิดพลาดกรณี req.cookies เป็น undefined
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ตรวจสอบและถอดรหัส JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // แปลง id ให้เป็น BigInt ถ้ามี
    if (decoded.id) {
      decoded.id = BigInt(decoded.id);
    }

    // เก็บข้อมูลที่ถอดรหัสไว้ใน req.agency
    req.agency = decoded;
    next(); // ให้ผ่านไปยังฟังก์ชันถัดไป
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
