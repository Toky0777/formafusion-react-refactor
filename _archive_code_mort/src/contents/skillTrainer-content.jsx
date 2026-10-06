import HeaderSkill from "../components/header/header-skill";
import { Outlet } from "react-router-dom";

export default function SkillTrainerContent() {
  return (
    <div className="p-5">
      <HeaderSkill />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
