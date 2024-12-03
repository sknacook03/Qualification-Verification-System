import bcrypt from "bcrypt";
import ResetServices from "../services/resetPassword.service.js";
import { sendEmail } from "../utils/senderEmail.util.js";

const ResetController = {
    requestResetPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await ResetServices.findUserByEmail(email);
            if (!user) return res.status(404).json({ message: "Email not found" });

            const resetCode = await ResetServices.createOrUpdateResetCode(email);
            await sendEmail(email, "Password Reset Code", `Your code is: ${resetCode}`);

            res.status(200).json({ message: "Code sent to email!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    verifyResetCode: async (req, res) => {
        try {
            const { email, code } = req.body;

            const resetRecord = await ResetServices.findResetRecord(email, code);
            if (!resetRecord) return res.status(400).json({ message: "Invalid or expired code" });

            res.status(200).json({ message: "Code is valid" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { email, newPassword } = req.body;

            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await ResetServices.updatePassword(email, hashedPassword);
            await ResetServices.deleteResetRecord(email);

            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export default ResetController;
