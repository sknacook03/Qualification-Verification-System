import AuthService from "../services/auth.service.js";

const AuthController = {
  loginController: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }
      const { massage, token } = await AuthService.loginAgency(
        email,
        password
      );

      res.cookie("token", token, {
        maxAge: 3600000, // 1 ชั่วโมง
        secure: true,
        httpOnly: true,
        sameSite: "strict",
      });

      res.status(200).json({
        massage: "login success",
      });
    } catch (error) {
      if (error.message === "Agency not found") {
        console.error("Login failed: Non-existing email:", req.body.email);
        return res.status(401).json({ error: "ไม่พบข้อมูลในระบบ" });
      }

      if (error.message === "Password is incorrect") {
        console.error(
          "Login failed: Incorrect password for email:",
          req.body.email
        );
        return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
      }

      console.error("Unexpected error in loginController:", error);
      return res.status(500).json({ error: "Failed to login" });
    }
  },
};
export default AuthController;