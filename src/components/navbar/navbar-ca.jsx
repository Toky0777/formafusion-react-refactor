import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavbarCa() {
  const location = useLocation();

  const chiffreDAffaireLinks = useMemo(
    () => [
      { name: "Projet", to: "/cfp/ca/ca_projet" },
      { name: "Cours", to: "/cfp/ca/ca_cours" },
      { name: "Clients", to: "/cfp/ca/ca_client" },
      { name: "Mois", to: "/cfp/ca/ca_mois" },
      { name: "Dossier", to: "/cfp/ca/ca_dossier" },
      { name: "Référence", to: "/cfp/ca/ca_reference" },
      { name: "Ville", to: "/cfp/ca/ca_ville" },
    ],
    []
  );

  return (
    <div>
      <div className="justify-center flex-grow  lg:flex mb-10">
        <ul className="flex items-center space-x-2">
          {chiffreDAffaireLinks.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`capitalize px-3 py-2 rounded-md transition-colors duration-200
                    ${
                      isActive
                        ? "bg-[#87388C]/10 text-[#87388C] border-b-2 border-[#87388C]" // classe active
                        : "text-slate-600 hover:bg-[#87388C]/5 hover:text-[#87388C]"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
