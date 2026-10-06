import { Outlet, useLocation } from "react-router-dom";
import { GlobalHeaderEtp } from "../components/header/global-header-etp";
// import { TopMenu } from "../components/top-menu-etp";
import { OthersContextProvider } from "../contexts/OthersContext";
import { BreadcrumbBarEtp } from "../components/breadcrumb/breadcrumb-etp";
import { NavigationSidebarEtp } from "../components/sidebar/sidebar-etp";
import { useEffect, useState } from "react";
import SearchResultsEtp from "../pages/Etp/search/SearchResultsEtp";

export default function EtpLayout() {
  const [currentSearch, setCurrentSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentSearch("");
  }, [location]);

  return (
    <OthersContextProvider>
      <div className="flex flex-1 h-screen overflow-hidden">
        <NavigationSidebarEtp />
        <div className="flex-1 overflow-auto bg-gray-50">
          <GlobalHeaderEtp onSearch={(query) => setCurrentSearch(query)} />
          {/* <TopMenu /> */}
          <BreadcrumbBarEtp />
          <div>
            {currentSearch ? (
              <SearchResultsEtp searchQuery={currentSearch} />
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </OthersContextProvider>
  );
}
