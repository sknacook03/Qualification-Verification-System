import { createBrowserRouter } from "react-router-dom";
import appRoutes from "./app.routes.jsx";
import authRoutes from "./auth.routes.jsx";
import officerRoutes from "./officer.routes.jsx";
import userRoutes from "./user.routes.jsx";


const routes = createBrowserRouter([
  ...appRoutes,
  ...authRoutes,
  ...officerRoutes,
  ...userRoutes,
]);

export default routes;
