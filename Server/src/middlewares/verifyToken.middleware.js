import jwt from "jsonwebtoken";

const verifyTokenMiddleware = (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token ไม่พบ" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ success: false, message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

export default verifyTokenMiddleware;
