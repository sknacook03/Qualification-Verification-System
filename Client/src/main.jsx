import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./layout/login/App.jsx";
import Register from "./Layout/Register/Register.jsx";
import Contact from "./layout/contact/contact.jsx";
import Staff from "./layout/Staff/staff.jsx";
import TermsofUse from "./layout/Terms-of-Use/terms-of-Use.jsx";
import ForgetPassword from "./layout/ForgetPassword/ForgetPassword.jsx";
import ForgetPasswordCode from "./layout/ForgetPasswordCode/ForgetPasswordCode.jsx";
import ForgetPasswordReset from "./layout/ForgetPasswordReset/ForgetPasswordReset.jsx";
import RegisterNext from "./layout/Register/RegisterNext.jsx";

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
    path: "/staff",
    element: <Staff />,
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
