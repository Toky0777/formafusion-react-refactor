import { useLocation, useNavigate } from "react-router-dom";

export default function NavbarSkill() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navMenu = [
    {
      title: "Évaluation des employés",
      link: "/cfp/skill_matrix/projets",
    },
    {
      title: "Gestion des skills",
      link: "/cfp/skill_matrix/gestion-skill",
    },
  ];

  const handleClick = (link) => {
    return navigate(link);
  };

  const isIncludePath = (path) => {
    return pathname.includes(path)
      ? "bg-gray-300 text-white "
      : " hover:bg-gray-200";
  };

  return (
    <div className="mb-20">
      <div className="flex justify-center items-center gap-5 text-sm">
        {navMenu.map((n, i) => (
          <button
            key={i}
            onClick={() => handleClick(n.link)}
            className={`font-bold p-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer ${isIncludePath(
              n.link
            )}`}
          >
            {n.title}
          </button>
        ))}
      </div>
    </div>
  );
}
