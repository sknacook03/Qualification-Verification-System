import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './layout/login/App.jsx'
import Contact from './layout/contact/contact.jsx';
import Staff from './layout/staff/staff.jsx';
import TermsofUse from './layout/terms-of-Use/terms-of-Use.jsx';
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
