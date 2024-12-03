import express from "express";
import ResetController from "../controllers/resetPassword.controller.js";

const ResetPasswordRouter = express.Router();

ResetPasswordRouter.post("/request-reset", ResetController.requestResetPassword);
ResetPasswordRouter.post("/verify-code", ResetController.verifyResetCode);
ResetPasswordRouter.post("/reset-password", ResetController.resetPassword);

export default ResetPasswordRouter;
