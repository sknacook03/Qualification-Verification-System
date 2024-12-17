import React from "react";
import Homepages from "../pages/Homepages/Homepages.jsx";
import Contact from "../layout/contact/contact.jsx";

const appRoutes = [
  { path: "/Homepages", element: <Homepages /> },
  { path: "/contact", element: <Contact /> },
];

export default appRoutes;
