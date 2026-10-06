import { Outlet } from "react-router-dom";
import NavbarRefreshFormateur from "../../components/navbar/navbar-refresh-formateur";
import ModuleCleaner from "../../contexts/ModuleCleaner";

function RefreshLayoutFormateur() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="h-16 bg-white shadow flex items-center px-2 sm:px-4">
            <NavbarRefreshFormateur />
          </div>

          <main className="flex-1 overflow-y-auto p-3 sm:p-6">
            <ModuleCleaner />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default RefreshLayoutFormateur;
