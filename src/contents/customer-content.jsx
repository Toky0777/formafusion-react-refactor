import { Outlet } from "react-router-dom";

export default function CustomerContent() {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Mes centres de formations</h1>
      </div>
      <div className="p-5 h-screen">
        <Outlet />
      </div>
    </div>
  );
}
