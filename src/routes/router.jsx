import { createBrowserRouter } from "react-router-dom";
import NotFound from "../components/Common/NotFound";

import guestRoutes from "./guest-routes";
import cfpRoutes from "./cfp-routes";
import etpRoutes from "./etp-routes";
import trainerRoutes from "./trainer-routes";
import particularRoutes from "./particular-routes";

const router = createBrowserRouter([
  guestRoutes,
  cfpRoutes,
  etpRoutes,
  trainerRoutes,
  particularRoutes,
  { path: "*", element: <NotFound /> },
]);

export default router;
