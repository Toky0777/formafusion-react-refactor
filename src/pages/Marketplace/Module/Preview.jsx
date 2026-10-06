import { useState, useEffect, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, Clock3, Target, Users } from "lucide-react";

const Preview = ({ moduleId }) => {
  const [module, setModule] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [cibles, setCibles] = useState([]);
  const [objectifs, setObjectifs] = useState([]); // Corrigé: "setObjectif" -> "setObjectifs"
  const [programs, setPrograms] = useState([]); // Corrigé: "usetState" -> "useState"
  const [images, setImages] = useState([]); // Ajouté: déclaration manquante
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ProgramAccordion = memo(({ program, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Utiliser useCallback pour optimiser les performances
    const toggleAccordion = useCallback(() => {
      setIsOpen((prevState) => !prevState);
    }, []);

    // IDs uniques pour l'accessibilité
    const headingId = `heading-${program.idProgramme}`;
    const contentId = `content-${program.idProgramme}`;

    return (
      <div className="border-b border-gray-200 last:border-none">
        <div className="accordion-item">
          <h2 id={headingId} className="mb-0">
            <button
              className="relative flex items-center justify-between w-full px-5 py-4 font-medium text-left transition rounded-md group bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
              onClick={toggleAccordion}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <span className="mr-4">{program.program_title}</span>
              <span className="ml-auto text-gray-500">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>
          </h2>

          <div
            id={contentId}
            role="region"
            aria-labelledby={headingId}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="p-5 bg-white">
              <div className="prose max-w-none">
                {/* Utilisation du composant avec précaution */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: program.program_description,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return; // Guard clause for invalid moduleId

      try {
        setLoading(true);
        const API_URL = `${API_URL}/marketplace/getApercuCours/${moduleId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();
        setModule(data.module); // Note: API renvoie "customer" mais on l'utilise comme "module"
        setRequirements(data.requirements || []);
        setObjectifs(data.objectifs || []);
        setCibles(data.cibles || []);
        setPrograms(data.programs || []);
        setImages(data.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  // Loading, error, or empty data states
  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Erreur: {error}</div>;
  }

  if (!module) {
    // Corrigé: "customer" -> "module"
    return (
      <div className="p-6 text-center">Aucune donnée client disponible</div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          À Propos de ce Cours
        </h2>
        <p className="mb-6 text-gray-600">
          {module.description || "Aucune description"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-1 space-x-2">
            <Clock3 className="text-purple-600" size={14} />
            <h4 className="font-semibold text-gray-700">Durée</h4>
          </div>
          <p className="text-gray-600">{module.dureeJ} jours</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-1 space-x-2">
            <Clock3 className="text-purple-600" size={14} />
            <h4 className="font-semibold text-gray-700">Durée</h4>
          </div>
          <p className="text-gray-600">{module.dureeH} heures</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-1 space-x-2">
            <Users className="text-purple-600" size={14} />
            <h4 className="font-semibold text-gray-700">Personnes formées</h4>
          </div>
          <p className="text-gray-600">{module.trained}</p>{" "}
          {/* Corrigé: "$module.trained" -> "module.trained" */}
        </div>
      </div>

      <div id="pourQui" className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          À qui s'adresse cette formation ?
        </h2>
        <div className="flex items-start gap-4 p-3 rounded-lg shadow-md bg-gray-50">
          <div className="w-1/2 space-y-3">
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-user"></i>
              <h3 className="text-xl font-semibold text-gray-700">Pour qui</h3>
            </div>
            <div className="space-y-3">
              {cibles.length < 1 ? (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Aucune cible disponible
                  </h4>
                </div>
              ) : (
                cibles.map((cible, index) => (
                  <div
                    key={`cible-${index}`}
                    className="flex items-start items-center gap-3"
                  >
                    <Target className="w-4 h-4" />
                    <p className="text-gray-700 text-normal">{cible.cible}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="w-1/2 space-y-3">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-list-check"></i>
              <h3 className="text-xl font-semibold text-gray-700">Prérequis</h3>
            </div>
            <div>
              {requirements.length < 1 ? (
                <div className="rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Aucun prérequis disponible
                  </h4>
                </div>
              ) : (
                requirements.map((requirement, index) => (
                  <div key={`req-${index}`} className="flex items-start gap-3">
                    <Target className="w-4 h-4" />
                    <p className="text-gray-700 text-normal">
                      {requirement.prerequis_name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="objectif" className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Objectifs de cette formation
        </h2>
        <div className="flex items-start gap-4 p-3 rounded-lg shadow-md bg-gray-50">
          <div className="w-full space-y-3">
            {objectifs.length < 1 ? (
              <div className="p-4 rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-700">
                  Aucun objectif disponible
                </h4>{" "}
                {/* Corrigé: "Aucune cible" -> "Aucun objectif" */}
              </div>
            ) : (
              objectifs.map((objectif, index) => (
                <div
                  key={`obj-${index}`}
                  className="flex items-start items-center gap-3"
                >
                  <Target className="w-4 h-4" />
                  <p className="text-gray-700 text-normal">
                    {objectif.objectif}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div id="program" className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">
          Programmes de cette formation
        </h2>
        <div className="flex items-start gap-4 rounded-lg">
          <div className="w-full space-y-6">
            <div className="space-y-2 accordion" id="accordionExample">
              {programs.length > 0 ? (
                programs.map((program) => (
                  <ProgramAccordion
                    key={`program-${program.idProgramme}`}
                    program={program}
                  />
                ))
              ) : (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-700">
                    Aucun programme disponible
                  </h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
