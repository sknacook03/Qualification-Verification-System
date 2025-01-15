import React from "react";
import HomepagesOfficer from "../pages/Officer/HomepageOfficer/HomepageOfficer.jsx";
import AgencyControlPanel from "../pages/Officer/AgencyControlPanel/AgencyControlPanel.jsx"
import LoginOfficer from "../pages/LoginOfficer/LoginOfficer.jsx";

const officerRoutes = [
  { path: "/HomepagesOfficer", element: <HomepagesOfficer /> },
  { path: "/AgencyControlPanel", element: <AgencyControlPanel /> },
  { path: "/LoginOfficer", element: <LoginOfficer /> },
];

export default officerRoutes;
