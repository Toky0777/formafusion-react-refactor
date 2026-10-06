import { Outlet } from "react-router-dom";

export default function AnalyticEtpContent() {
  return (
    <div className="p-5 ">
      <h1 className="font-bold text-2xl">Analytics</h1>
      <Outlet />
    </div>
  );
}
