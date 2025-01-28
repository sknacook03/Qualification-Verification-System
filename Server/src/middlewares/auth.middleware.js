import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    if (decoded.id) {
      decoded.id = BigInt(decoded.id);
    }

    switch (decoded.role) {
      case "agency":
        req.agency = decoded;
        break;
      case "admin":
        req.officer = decoded;
        break;
    }
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};



export default authMiddleware;
