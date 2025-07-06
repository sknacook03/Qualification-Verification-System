import express from "express";
import PageviewController from "../controllers/pageview.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const PageViewRouter = express.Router();

PageViewRouter.post("/create", authMiddleware, PageviewController.createPageview)
PageViewRouter.get("/statistics", PageviewController.getStatisticsController)
PageViewRouter.get("/top-agencies", PageviewController.getTopAgencyViewsController)
PageViewRouter.get("/top-faculties", PageviewController.getTopFacultyViewsController)
PageViewRouter.get("/all-faculties", PageviewController.getAllFacultiesController)
PageViewRouter.get("/all-departments", PageviewController.getAllDepartmentsController)
PageViewRouter.get("/top-agencies-by-faculty", PageviewController.getTopAgenciesByFacultyController)
PageViewRouter.get("/top-agencies-by-department", PageviewController.getTopAgenciesByDepartmentController)
PageViewRouter.get("/departments-by-faculty", PageviewController.getDepartmentsByFacultyController)
PageViewRouter.get("/trend", PageviewController.getStatisticsOverTimeController)

export default PageViewRouter;