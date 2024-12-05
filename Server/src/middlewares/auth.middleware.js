import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      decoded.id = BigInt(decoded.id);
    }
    req.agency = decoded; //decoded = {id, email, role: 'agency'} ส่งมาจาก agency.service
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
