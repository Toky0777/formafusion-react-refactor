import { Outlet } from "react-router-dom";

export default function ParticulierLayout() {
  return (
    <div>
      <div className="p-5   min-h-screen  z-[500]">
        <Outlet />
      </div>
    </div>
  );
}
