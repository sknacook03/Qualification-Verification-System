import express from "express";
import AgencyRouter from "./routes/agency.routes.js";
import TypeAgencyRouter from "./routes/typeAgency.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import ResetPasswordRouter from "./routes/resetPassword.routes.js"
const IndexRouter = express();

IndexRouter.use("/agency", AgencyRouter);
IndexRouter.use("/typeagency", TypeAgencyRouter);
IndexRouter.use("/auth", AuthRouter);
IndexRouter.use("/password-reset", ResetPasswordRouter);

export default IndexRouter;
