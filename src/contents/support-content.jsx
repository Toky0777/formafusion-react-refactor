import { Outlet } from "react-router-dom";
import NavbarSupportEmploye from "../components/navbar/navbar-support";
import { SupportSearchProvider } from "../contexts/Apprenants/support-search-context";

export function SupportContent() {
  return (
    <SupportSearchProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <NavbarSupportEmploye />
        <div className="flex-grow bg bg-gray-50 px-4 ">
          <Outlet />
        </div>
      </div>
    </SupportSearchProvider>
  );
}
