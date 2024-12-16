import React from "react";
import HomepagesOfficer from "../pages/HomepageOfficer/HomepageOfficer.jsx";
import LoginOfficer from "../pages/LoginOfficer/LoginOfficer.jsx";

const officerRoutes = [
  { path: "/HomepagesOfficer", element: <HomepagesOfficer /> },
  { path: "/LoginOfficer", element: <LoginOfficer /> },
];

export default officerRoutes;
