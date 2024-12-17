import express from "express";
import AuthController from "../controllers/auth.controller.js";
const AuthRouter = express.Router();

AuthRouter.post("/login", AuthController.loginController)
AuthRouter.post("/login-officer", AuthController.loginOfficerController)
AuthRouter.post("/logout", AuthController.logoutController)


export default AuthRouter;