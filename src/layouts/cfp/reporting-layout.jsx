import { Outlet } from "react-router-dom";
import NavbarReporting from "../../components/navbar/navbar-reporting";

export function ReportingLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarReporting />

            <main className="relative">
                <Outlet />
            </main>
        </div>
    );
}