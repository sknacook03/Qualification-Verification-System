import React from "react";
import HomepagesOfficer from "../pages/Officer/HomepageOfficer/HomepageOfficer.jsx";
import AgencyControlPanel from "../pages/Officer/AgencyControlPanel/AgencyControlPanel.jsx"
import LoginOfficer from "../pages/LoginOfficer/LoginOfficer.jsx";
import CheckQualificationsOfficer from "../pages/Officer/CheckQualificationsOfficer/CheckQualificationsOfficer.jsx";
import AccessStatisticsPageOfficer from "../pages/Officer/AccessStatisticsPageOfficer/AccessStatisticsPageOfficer.jsx";
import OfficerControlPanel from "../pages/Officer/OfficerControlPanel/OfficerControlPanel.jsx";
import StudentControlPanel from "../pages/Officer/StudentControlPanel/StudentControlPanel.jsx";
import PrivacySettingsPageOfficer from "../pages/Officer/PrivacySettingsPageOfficer/PrivacySettingsPageOfficer.jsx";
import GeneralControlPanel from "../pages/Officer/GeneralControlPanel/GeneralControlPanel.jsx";

const officerRoutes = [
  { path: "/HomepagesOfficer", element: <HomepagesOfficer /> },
  { path: "/AgencyControlPanel", element: <AgencyControlPanel /> },
  { path: "/LoginOfficer", element: <LoginOfficer /> },
  { path: "/CheckQualificationsOfficer", element: <CheckQualificationsOfficer /> },
  { path: "/AccessStatisticsPageOfficer", element: <AccessStatisticsPageOfficer /> },
  { path: "/OfficerControlPanel", element: <OfficerControlPanel /> },
  { path: "/StudentControlPanel", element: <StudentControlPanel /> },
  { path: "/PrivacySettingsPageOfficer", element: <PrivacySettingsPageOfficer /> },
  { path: "/GeneralControlPanel", element: <GeneralControlPanel /> },
];

export default officerRoutes;
