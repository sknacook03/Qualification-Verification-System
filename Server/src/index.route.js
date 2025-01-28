import express from "express";
import AgencyRouter from "./routes/agency.routes.js";
import OfficerRouter from "./routes/officer.routes.js";
import TypeAgencyRouter from "./routes/typeAgency.routes.js";
import AuthRouter from "./routes/auth.routes.js";
import ResetPasswordRouter from "./routes/resetPassword.routes.js"
import ApprovalLogRouter from "./routes/approvallog.routes.js";
import StudentRouter from "./routes/student.routes.js";
const IndexRouter = express();

IndexRouter.use("/agency", AgencyRouter);
IndexRouter.use("/typeagency", TypeAgencyRouter);
IndexRouter.use("/auth", AuthRouter);
IndexRouter.use("/officer", OfficerRouter);
IndexRouter.use("/password-reset", ResetPasswordRouter);
IndexRouter.use("/approvedlog", ApprovalLogRouter);
IndexRouter.use("/student", StudentRouter);

export default IndexRouter;
