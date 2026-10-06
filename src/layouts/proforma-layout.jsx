import { Outlet } from "react-router-dom";
import { NavBarProforma } from "../components/navbar/navbar-proforma";

export default function ProformaLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBarProforma />
      <div className="flex-grow px-4 bg-white rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
