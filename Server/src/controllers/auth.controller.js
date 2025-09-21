import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

// เพิ่มฟังก์ชันแปลงเวลา
const parseJwtExpiry = (expiresIn) => {
  const value = parseInt(expiresIn);
  const unit = expiresIn.slice(-1).toLowerCase();
  
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000; 
    default: return parseInt(expiresIn) * 1000; 
  }
};

const loginHandler = async (req, res, loginFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const { message, token } = await loginFunction(email, password);

    const decoded = jwt.decode(token);
    const expiryDate = new Date(decoded.exp * 1000);

    const jwtMaxAge = parseJwtExpiry(process.env.JWT_EXPIRES_IN || '2h');

    res.cookie("token", token, {
      maxAge: jwtMaxAge,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "login success",
      tokenExpiry: expiryDate 
    });
  } catch (error) {
    if (error.message === "Agency not found" || error.message === "Officer not found") {
      console.error("Login failed: Non-existing email:", req.body.email);
      return res.status(401).json({ error: "Agency not found" });
    }

    if (error.message === "Password is incorrect") {
      console.error("Login failed: Incorrect password for email:", req.body.email);
      return res.status(401).json({ error: "Password is incorrect" });
    }

    if (error.message === "Agency is not approve") {
      console.error("Login failed: Agency not approved for email:", req.body.email);
      return res.status(403).json({ 
        error: "Your account is not approved yet. Please contact the administrator." 
      });
    }

    if (error.message === "Agency is rejected") {
      console.error("Login failed: Agency rejected for email:", req.body.email);
      return res.status(403).json({ 
        error: "Your account has been rejected. Please contact the administrator." 
      });
    }
    console.error("Unexpected error in loginHandler:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
};

const AuthController = {
  loginController: (req, res) => {
    loginHandler(req, res, AuthService.loginAgency);
  },

  loginOfficerController: (req, res) => {
    loginHandler(req, res, AuthService.loginOfficer);
  },
  
  logoutController: (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      const response = AuthService.logout();
      res.status(200).json(response);
    } catch (error) {
      console.error("Failed to logout:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  },

  refreshTokenController: async (req, res) => {
    try {
      const token = req.cookies?.token;
      
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      // ตรวจสอบ token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // สร้าง token ใหม่
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
      );

      const newDecoded = jwt.decode(newToken);
      const expiryDate = new Date(newDecoded.exp * 1000);
      const jwtMaxAge = parseJwtExpiry(process.env.JWT_EXPIRES_IN || '2h');

      res.cookie("token", newToken, {
        maxAge: jwtMaxAge,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      });

      res.status(200).json({
        message: "Token refreshed successfully",
        tokenExpiry: expiryDate
      });
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  },
  checkTokenExpiryController: (req, res) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({ 
          error: "No token provided",
          expired: true 
        });
      }

      // ข้อมูล token expiry ถูก set ไว้ใน middleware checkTokenExpiry แล้ว
      const tokenExpiry = req.tokenExpiry;

      if (tokenExpiry && tokenExpiry.isExpired) {
        return res.status(401).json({ 
          error: "Token expired",
          expired: true,
          timeLeft: 0,
          expiresIn: tokenExpiry.expiryDate
        });
      }

      res.status(200).json({
        message: "Token is valid",
        expired: false,
        timeLeft: tokenExpiry ? tokenExpiry.timeLeft * 1000 : 0, // แปลงเป็น milliseconds
        expiresIn: tokenExpiry ? tokenExpiry.expiryDate : null
      });
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return res.status(401).json({ 
        error: "Invalid token",
        expired: true 
      });
    }
  },
};

export default AuthController;