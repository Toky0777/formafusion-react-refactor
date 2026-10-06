import { Outlet } from "react-router-dom";
import NavbarReportingEtp from "../../components/navbar/navbar-reporting-etp";

export  function  ReportingLayoutEtp() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarReportingEtp />

            <main className="relative">
                <Outlet />
            </main>
        </div>
    );
}