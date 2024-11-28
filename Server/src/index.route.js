import express from "express";
import AgencyRouter from "./routes/agency.routes.js";
const IndexRouter = express();

IndexRouter.use("/agency", AgencyRouter)

export default IndexRouter;