import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div>
      <div className="bg-slate-50 min-h-screen  z-[500]">
        <Outlet />
      </div>
    </div>
  );
}
