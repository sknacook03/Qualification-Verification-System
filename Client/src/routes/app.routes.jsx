import React from "react";
import Homepages from "../pages/Homepages/Homepages.jsx";
import CheckQualificationsPage from "../pages/CheckQualificationsPage/CheckQualificationsPage.jsx";
import AccessStatisticsPage from "../pages/AccessStatisticsPage/AccessStatisticsPage.jsx";
import PrivacySettingsPage from "../pages/PrivacySettingsPage/PrivacySettingsPage.jsx";
import Contact from "../layout/contact/contact.jsx";

const appRoutes = [
  { path: "/Homepages", element: <Homepages /> },
  { path: "/CheckQualificationsPage", element: <CheckQualificationsPage /> },
  { path: "/AccessStatisticsPage", element: <AccessStatisticsPage /> },
  { path: "/PrivacySettingsPage", element: <PrivacySettingsPage /> },
  { path: "/contact", element: <Contact /> },
];

export default appRoutes;
