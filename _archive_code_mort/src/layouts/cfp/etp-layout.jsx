import { Outlet } from "react-router-dom";
import { GlobalHeader } from "../components/global-header";
import { TopMenu } from "../components/top-menu";
import { BreadcrumbBar } from "../components/breadcrumb-bar";
import { NavigationSidebar } from "../components/navigation-sidebar";
import { OthersContextProvider } from "../contexts/OthersContext";

export default function CfpLayout() {
    return (
        <OthersContextProvider>
            <div className="flex flex-1 h-screen overflow-hidden">
                <NavigationSidebar />
                <div className="flex-1 overflow-auto bg-gray-50">
                    <GlobalHeader />
                    <TopMenu />
                    <BreadcrumbBar />
                    <div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </OthersContextProvider>
    );
}
