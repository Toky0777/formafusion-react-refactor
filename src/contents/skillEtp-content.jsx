import HeaderSkill from "../components/header/header-skill";
import { Outlet } from "react-router-dom";

export default function SkillEtpContent() {
  return (
    <div className="p-8">
      <HeaderSkill />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
