import React from "react";
import GeneralUser from "../pages/GeneralUser/GeneralUser.jsx";
import AccessStatistics from "../hooks/AccessStatistics/AccessStatistics.jsx";
import TermOfServices from "../pages/TermOfServices/TermOfServices.jsx"
import Contact from "../pages/Contact/Contact.jsx";

const userRoutes = [
  { path: "/GeneralUser", element: <GeneralUser /> },
  { path: "/AccessStatistics", element: <AccessStatistics /> },
  { path: "/Term-of-Services", element: <TermOfServices /> },
  { path: "/Contact", element: <Contact /> },
  
];

export default userRoutes;
