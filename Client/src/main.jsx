import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Layout/login/App.jsx'
import Register from './Layout/Register/Register.jsx';
import Contact from './Layout/Contact/contact.jsx';
import Staff from './Layout/Staff/staff.jsx';
import TermsofUse from './Layout/Terms-of-Use/terms-of-Use.jsx';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/staff",
    element: <Staff />
  },
  {
    path: "/terms-of-Use",
    element: <TermsofUse />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
