import React from "react";
import GeneralUser from "../pages/GeneralUser/GeneralUser.jsx";
import AccessStatistics from "../hooks/AccessStatistics/AccessStatistics.jsx";


const userRoutes = [
  { path: "/GeneralUser", element: <GeneralUser /> },
  { path: "/AccessStatistics", element: <AccessStatistics /> },
];

export default userRoutes;
