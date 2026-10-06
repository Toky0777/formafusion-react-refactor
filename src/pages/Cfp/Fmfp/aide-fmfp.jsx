import {
  Building2,
  Users,
  Network,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AideFmfp() {
  const navigate = useNavigate();

  const projets = [
    {
      id: 1,
      icon: <Building2 className="w-8 h-8 text-blue-500" />,
      title: "Formation continue",
      type: "Intra",
      description:
        "Formations destinées aux salariés d’une seule entreprise pour renforcer leurs compétences techniques ou managériales.",
      exemples: [
        "Formation en management d’équipe",
        "Formation en sécurité au travail",
        "Formation bureautique pour les employés",
      ],
      beneficiaires: "Salariés d’une entreprise cotisante au FMFP.",
    },
    {
      id: 2,
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Formation pré-emploi",
      type: "Intra",
      description:
        "Formations pour les jeunes ou adultes non salariés afin de favoriser leur insertion professionnelle.",
      exemples: [
        "Formation courte en électricité, plomberie, couture, TIC",
        "Formation en entrepreneuriat ou reconversion",
      ],
      beneficiaires: "Demandeurs d’emploi ou jeunes diplômés.",
    },
    {
      id: 3,
      icon: <Network className="w-8 h-8 text-purple-500" />,
      title: "Formation mutualisée",
      type: "Inter",
      description:
        "Formations regroupant plusieurs entreprises d’un même secteur ou d’une même zone géographique.",
      exemples: [
        "Formation en hygiène pour plusieurs hôtels",
        "Formation sécurité au travail pour PME industrielles",
      ],
      beneficiaires: "Groupements ou consortiums d’entreprises cotisantes.",
    },

    {
      id: 6,
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: "Projet sectoriel ou territorial",
      type: "Inter",
      description:
        "Projets développés pour répondre à des besoins de formation spécifiques à un secteur d’activité ou une région.",
      exemples: [
        "Formation agricole dans une région rurale",
        "Formation touristique régionale",
      ],
      beneficiaires: "Entreprises d’un même secteur ou d’une même région.",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1  transition-colors mb-6 text-sm"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center ">
        Aide FMFP — Types de projets
      </h1>
      <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto">
        Découvrez les six types de projets soutenus par le FMFP, classés selon
        leur objectif, leurs bénéficiaires et leur portée (interne, intra,
        inter-entreprises).
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projets.map((projet) => (
          <div
            key={projet.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              {projet.icon}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {projet.title}
                </h2>
                <p className="text-sm text-gray-400 font-medium">
                  {projet.type}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-3 text-sm">{projet.description}</p>

            <h3 className="font-medium text-gray-800 text-sm mt-3">
              Exemples :
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
              {projet.exemples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>

            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Bénéficiaires :</span>{" "}
              {projet.beneficiaires}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
