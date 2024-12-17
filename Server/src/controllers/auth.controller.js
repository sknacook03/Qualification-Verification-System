import AuthService from "../services/auth.service.js";

const loginHandler = async (req, res, loginFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const { message, token } = await loginFunction(email, password);

    res.cookie("token", token, {
      maxAge: 3600000, // 1 ชั่วโมง
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "login success" });
  } catch (error) {
    if (error.message === "Agency not found" || error.message === "Officer not found") {
      console.error("Login failed: Non-existing email:", req.body.email);
      return res.status(401).json({ error: "ไม่พบข้อมูลในระบบ" });
    }

    if (error.message === "Password is incorrect") {
      console.error("Login failed: Incorrect password for email:", req.body.email);
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    // ข้อผิดพลาดอื่น ๆ
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
        secure: process.env.JWT_SECRET === "production",
        sameSite: "strict",
      });

      const response = AuthService.logout();
      res.status(200).json(response);
    } catch (error) {
      console.error("Failed to logout:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  },
};
export default AuthController;