import { Outlet } from "react-router-dom";
import { NavBarFacture } from "../components/navbar/navbar-invoice";

export default function InvoiceLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBarFacture />
      <div className="flex-grow px-4 bg-white rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
