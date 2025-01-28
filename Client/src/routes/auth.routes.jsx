import React from "react";
import Login from "../pages/login/login.jsx"
import ForgetPassword from "../pages/ForgetPassword/ForgetPasswordEmail/ForgetPasswordEmail.jsx";
import ForgetPasswordCode from "../pages/ForgetPassword/ForgetPasswordCode/ForgetPasswordCode.jsx";
import ForgetPasswordReset from "../pages/ForgetPassword/ForgetPasswordReset/ForgetPasswordReset.jsx";
import Register from "../pages/Register/Register.jsx";
import RegisterNext from "../pages/Register/RegisterNext.jsx";
import Editregister from "../pages/Editregister/Editregister.jsx";

const authRoutes = [
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/RegisterNext", element: <RegisterNext /> },
  { path: "/Editregister", element: <Editregister /> },
  { path: "/ForgetPassword", element: <ForgetPassword /> },
  { path: "/ForgetPasswordCode", element: <ForgetPasswordCode /> },
  { path: "/ForgetPasswordReset", element: <ForgetPasswordReset /> },
];

export default authRoutes;
