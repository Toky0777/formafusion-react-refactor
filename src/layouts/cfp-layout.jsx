import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { GlobalHeaderCfp } from "../components/header/global-header-cfp";
// import { TopMenu } from "../components/top-menu";
import { BreadcrumbBar } from "../components/breadcrumb-bar";
import { NavigationSidebar } from "../components/navigation-sidebar";
import SearchResults from "../pages/Cfp/search/SearchResult";

export default function CfpLayout() {
  const [currentSearch, setCurrentSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentSearch("");
  }, [location]);

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <NavigationSidebar />

      <div className="flex-1 overflow-auto bg-gray-50">
        <GlobalHeaderCfp onSearch={(query) => setCurrentSearch(query)} />
        {/* <TopMenu /> */}
        <BreadcrumbBar />

        <div className="p-4">
          {currentSearch ? (
            <SearchResults searchQuery={currentSearch} />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
