import { Outlet } from "react-router-dom";
import { GlobalHeaderTrainer } from "../components/header/global-header-trainer";
import { OthersContextProvider } from "../contexts/OthersContext";
import { NavigationSidebarTrainer } from "../components/sidebar/sidebar-tainer";
import { BreadcrumbBarTrainer } from "../components/breadcrumb/breadcrumb-trainer";
import { TopMenuFormateur } from "../components/top-menu-formateur";

export default function TrainerLayout() {
  return (
    <OthersContextProvider>
      <div className="flex flex-1 h-screen overflow-hidden">
        <NavigationSidebarTrainer />
        <div className="flex-1 overflow-auto bg-gray-50">
          <GlobalHeaderTrainer />
          <TopMenuFormateur />
          <BreadcrumbBarTrainer />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </OthersContextProvider>
  );
}
