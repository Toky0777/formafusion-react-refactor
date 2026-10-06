import { Outlet } from "react-router-dom";
import T from "../../components/translate/AutoTranslator";

export default function ReservationLayout() {
  return (
    <div>
      <div className="min-h-screen p-5 ">
        <h1 className="text-2xl font-bold mb-10 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent ">
          <T>Réservations</T>
        </h1>
        <div className="mx-auto max-w-9xl p-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
