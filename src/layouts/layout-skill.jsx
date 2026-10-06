import { Outlet } from "react-router-dom";
import NavbarSkill from "../components/navbar/navbar-skill";

export default function LayoutSkill() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">
        Skill Matrix
      </h1>
      <NavbarSkill />
      <Outlet />
    </div>
  );
}
