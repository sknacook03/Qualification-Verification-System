import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // ลองใช้ jwt.verify ก่อน
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      
      // ส่ง token info ใน headers ทุกครั้ง
      res.set({
        'X-Token-Expires-In': timeUntilExpiry,
        'X-Token-Expiry-Date': new Date(decoded.exp * 1000).toISOString()
      });
      
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
      
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        console.log("Token expired - sending 401");
        return res.status(401).json({ 
          error: "Token expired", 
          expired: true,
          canRenew: true 
        });
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    }
    
  } catch (error) {
    console.error("Authorization error:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
