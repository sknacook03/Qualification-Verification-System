import React from "react";
import HomepagesOfficer from "../pages/Officer/HomepageOfficer/HomepageOfficer.jsx";
import AgencyControlPanel from "../pages/Officer/AgencyControlPanel/AgencyControlPanel.jsx"
import LoginOfficer from "../pages/LoginOfficer/LoginOfficer.jsx";
import CheckQualificationsOfficer from "../pages/Officer/CheckQualificationsOfficer/CheckQualificationsOfficer.jsx";

const officerRoutes = [
  { path: "/HomepagesOfficer", element: <HomepagesOfficer /> },
  { path: "/AgencyControlPanel", element: <AgencyControlPanel /> },
  { path: "/LoginOfficer", element: <LoginOfficer /> },
  { path: "/CheckQualificationsOfficer", element: <CheckQualificationsOfficer /> },
];

export default officerRoutes;
