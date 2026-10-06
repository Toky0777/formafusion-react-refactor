import { Outlet } from "react-router-dom";
import { GlobalHeaderParticular } from "../components/header/global-header-particular";
import { TopMenu } from "../components/top-menu";
import { OthersContextProvider } from "../contexts/OthersContext";
import { BreadcrumbBarParticular } from "../components/breadcrumb/breadcrumb-particular";
import { NavigationSidebarParticular } from "../components/sidebar/sidebar-particular";

export default function ParticularLayout() {
  return (
    <OthersContextProvider>
      <div className="flex flex-1 h-screen overflow-hidden">
        <NavigationSidebarParticular />
        <div className="flex-1 overflow-auto bg-gray-50">
          <GlobalHeaderParticular />
          <TopMenu />
          <BreadcrumbBarParticular />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </OthersContextProvider>
  );
}
