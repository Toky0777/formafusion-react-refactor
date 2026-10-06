import { Outlet } from "react-router-dom";
import NavBarSkillTrainer from "../components/navbar/navbar-skill-trainer";

export default function LayoutSkillTrainer() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">
        Skill Matrix
      </h1>
      <NavBarSkillTrainer />
      <Outlet />
    </div>
  );
}
