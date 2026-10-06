import GuestLayout from "../layouts/guest-layout";
import GuestRoute from "./guest-route";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import lazyPage from "./lazyPage";

// Pages chargées à la demande (code splitting)
const Login = lazyPage(() => import("../pages/Login"));
const Register = lazyPage(() => import("../pages/Register"));
const Centres = lazyPage(() => import("../pages/Centres"));
const Formations = lazyPage(() => import("../pages/Formations"));
const Course = lazyPage(() => import("../pages/Course"));
const CourseDetail = lazyPage(() => import("../pages/Marketplace/Module/detail"));
const EventDetailPage = lazyPage(() => import("../pages/Marketplace/Event/detail"));
const CustomerDetail = lazyPage(() => import("../pages/Marketplace/Customer/detail"));
const Quote = lazyPage(() => import("../pages/Marketplace/Quote"));
const Company = lazyPage(() => import("../pages/Marketplace/Quote/Company."));
const Individual = lazyPage(() => import("../pages/Marketplace/Quote/Individual"));
const ForgotPassword = lazyPage(() => import("../pages/ForgotPassword"));
const ResetPassword = lazyPage(() => import("../pages/ResetPassword"));
const ReservationForm = lazyPage(() => import("../pages/Marketplace/Reservation"));
const ReservationRecap = lazyPage(() => import("../pages/Marketplace/Reservation/ReservationRecap"));

const guestRoutes = {
  path: "/",
  element: <GuestLayout />,
  children: [
    { index: true, element: <Course /> },
    { path: "centres", element: <Centres /> },
    { path: "formations", element: <Formations /> },
    { path: "cours", element: <Course /> },
    { path: "centres", element: <Centres /> },
    { path: "formations", element: <Formations /> },
    { path: "cours/detail/:moduleId", element: <CourseDetail /> },
    { path: "evenement/detail/:projectId", element: <EventDetailPage /> },
    { path: "cfp/detail/:customerId", element: <CustomerDetail /> },
    { path: "devis/:idCfp/:idModule", element: <Quote /> },
    { path: "devis/company/:idModule", element: <Company /> },
    { path: "devis/individual/:idModule", element: <Individual /> },
    {
      path: "reservation/:projectId",
      element: (
        <ProtectedRoute allowedUserTypes={["superAdminEtp", "adminEtp"]}>
          <ReservationForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "login",
      element: (
        <GuestRoute>
          <Login />
        </GuestRoute>
      ),
    },
    {
      path: "register",
      element: (
        <GuestRoute>
          <Register />
        </GuestRoute>
      ),
    },
    {
      path: "forgot-password",
      element: (
        <GuestRoute>
          <ForgotPassword />
        </GuestRoute>
      ),
    },
    {
      path: "reset-password",
      element: (
        <GuestRoute>
          <ResetPassword />
        </GuestRoute>
      ),
    },
    {
      path: "marketplace/reservation/recap/:id",
      element: <ReservationRecap />,
    },
  ],
};

export default guestRoutes;
