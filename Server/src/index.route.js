import express from "express";
import AgencyRouter from "./routes/agency.routes.js";
import TypeAgencyRouter from "./routes/typeAgency.routes.js";
const IndexRouter = express();

IndexRouter.use("/agency", AgencyRouter);
IndexRouter.use("/typeagency", TypeAgencyRouter);

export default IndexRouter;
