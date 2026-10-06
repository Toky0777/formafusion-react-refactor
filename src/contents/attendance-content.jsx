import { Outlet } from "react-router-dom";
import { AttendanceProvider } from "../contexts/cfp/AttendanceProvider";
import { NavBarAttendanceEmp } from "../components/navbar/navbar-attendance-emp";
export function AttendanceContent() {
  return (
    <AttendanceProvider>
      <div className="flex flex-col min-h-screen">
        <NavBarAttendanceEmp />
        <div className="flex flex-col flex-grow px-4 py-10 space-y-2">
          <Outlet />
        </div>
      </div>
    </AttendanceProvider>
  );
}
