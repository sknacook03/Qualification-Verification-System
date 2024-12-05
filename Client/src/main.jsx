import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/login/login.jsx";
import Register from "./pages/Register/Register.jsx";
import Contact from "./layout/contact/contact.jsx";
import LoginOfficer from "./pages/LoginOfficer/LoginOfficer.jsx";
import TermsofUse from "./layout/Terms-of-Use/terms-of-Use.jsx";
import ForgetPassword from "./pages/ForgetPassword/ForgetPasswordEmail/ForgetPasswordEmail.jsx";
import ForgetPasswordCode from "./pages/ForgetPassword/ForgetPasswordCode/ForgetPasswordCode.jsx";
import ForgetPasswordReset from "./pages/ForgetPassword/ForgetPasswordReset/ForgetPasswordReset.jsx";
import RegisterNext from "./pages/Register/RegisterNext.jsx";
import Homepages from "./pages/Homepages/Homepages.jsx"
import HomepagesOfficer from "./pages/HomepageOfficer/HomepageOfficer.jsx";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/LoginOfficer",
    element: <LoginOfficer />,
  },
  {
    path: "/terms-of-Use",
    element: <TermsofUse />,
  },
  {
    path: "/ForgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/ForgetPasswordCode",
    element: <ForgetPasswordCode />,
  },
  {
    path: "/ForgetPasswordReset",
    element: <ForgetPasswordReset />,
  },
  {
    path: "/RegisterNext",
    element: <RegisterNext />,
  },
  {
    path: "/Homepages",
    element: <Homepages />,
  },
  {
    path: "/HomepagesOfficer",
    element: <HomepagesOfficer />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
