import { Outlet } from "react-router-dom";
import NavbarCa from "../../components/navbar/navbar-ca";

export function CaLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarCa />

      <main className="relative">
        <Outlet />
      </main>
    </div>
  );
}
