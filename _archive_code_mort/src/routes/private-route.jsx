import ProtectedRoute from "../components/Common/ProtectedRoute";
import ReservationForm from "../pages/Marketplace/Reservation";

const privateRoutes = {
  path: "/reservation/:projectId",
  element: (
    <ProtectedRoute>
      <ReservationForm />
    </ProtectedRoute>
  ),
};

export default privateRoutes;
