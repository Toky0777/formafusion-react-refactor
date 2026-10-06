import { Link, useLocation } from "react-router-dom";
import T from "../translate/AutoTranslator";

export default function MiddleNav() {
  const location = useLocation();

  const links = [
    { path: "/cfp/analytic", label: "Tableau de bord", style: "bg-[#369ACC]" },
    {
      path: "/cfp/analytic/objectif",
      label: "Objectifs",
      style: "bg-[#95CF92]",
    },
    {
      path: "/cfp/analytic/formateur",
      label: "Formateurs",
      style: "bg-[#6F1926]",
    },
  ];

  return (
    <div className="flex gap-4 px-4 py-2 rounded-xl">
      {links.map((link) => {
        const isActive =
          link.path === "/cfp/analytic"
            ? location.pathname === link.path
            : location.pathname.startsWith(link.path);

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200
              ${
                isActive
                  ? `${link.style} text-white`
                  : "text-gray-700 hover:bg-slate-100"
              }
            `}
          >
            <T>{link.label}</T>
          </Link>
        );
      })}
    </div>
  );
}
