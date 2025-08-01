import React from "react";
import GeneralUser from "../pages/GeneralUser/GeneralUser.jsx";
import AccessStatistics from "../hooks/AccessStatistics/AccessStatistics.jsx";
import TermOfServices from "../pages/TermOfServices/TermOfServices.jsx"


const userRoutes = [
  { path: "/GeneralUser", element: <GeneralUser /> },
  { path: "/AccessStatistics", element: <AccessStatistics /> },
  { path: "/Term-of-Services", element: <TermOfServices /> },
];

export default userRoutes;
