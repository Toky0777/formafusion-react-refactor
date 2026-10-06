import { useState, useEffect, useRef } from "react";
import { ChevronDown, BookOpen, Clock, AlertCircle } from "lucide-react";
import { useModuleContext } from "../../../contexts/ModuleContext";
import axios from "../../../config/axios";

function CourseSidebar({ onSelectContent }) {
  const { idModule } = useModuleContext();
  const sidebarRef = useRef(null);
  const [programmes, setProgrammes] = useState([]);
  const [module, setModule] = useState(null);
  const [openProgrammes, setOpenProgrammes] = useState({});
  const [programmeContents, setProgrammeContents] = useState({});
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);
  const [loadingModule, setLoadingModule] = useState(false);
  const [loadingContents, setLoadingContents] = useState({});
  const [error, setError] = useState(null);
  const [selectedContentId, setSelectedContentId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpenProgrammes({});
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!idModule) return;

    setLoadingModule(true);
    setError(null);
    axios
      .get(`/cfp/refresh/${idModule}/showModule`)
      .then((response) => {
        setModule(response.data?.module || null);
      })
      .catch((error) => {
        console.error("Erreur chargement module:", error);
        setModule(null);
      })
      .finally(() => {
        setLoadingModule(false);
      });
  }, [idModule]);

  const handleSelectContent = (contentId) => {
    setSelectedContentId(contentId);
    onSelectContent(contentId);
  };

  useEffect(() => {
    if (!idModule) return;

    setLoadingProgrammes(true);
    setError(null);
    axios
      .get(`cfp/module/programmes/menu-refresh/module/${idModule}`)
      .then((response) => {
        setProgrammes(response.data?.programmes || []);
        setError(null);
      })
      .catch((error) => {
        console.error("Erreur chargement programmes:", error);
        setProgrammes([]);
        setError("Erreur lors du chargement des programmes");
      })
      .finally(() => {
        setLoadingProgrammes(false);
      });
  }, [idModule]);

  const toggleProgramme = async (programmeId) => {
    const isOpen = openProgrammes[programmeId];

    if (isOpen) {
      setOpenProgrammes((prev) => ({
        ...prev,
        [programmeId]: false,
      }));
      return;
    }

    setOpenProgrammes((prev) => ({
      ...prev,
      [programmeId]: true,
    }));

    if (!programmeContents[programmeId]) {
      setLoadingContents((prev) => ({
        ...prev,
        [programmeId]: true,
      }));

      try {
        const response = await axios.get(
          `/cfp/module/programmes/${programmeId}`
        );
        const contents = response.data.program_contents || [];
        console.log(response.data);
        console.log(programmeId);

        setProgrammeContents((prev) => ({
          ...prev,
          [programmeId]: contents,
        }));
      } catch (error) {
        console.error("Erreur chargement contenus:", error);
        setProgrammeContents((prev) => ({
          ...prev,
          [programmeId]: [],
        }));
      } finally {
        setLoadingContents((prev) => ({
          ...prev,
          [programmeId]: false,
        }));
      }
    }
  };

  const totalPrograms = programmes.length;
  const totalItems = Object.values(programmeContents).reduce(
    (acc, items) => acc + items.length,
    0
  );

  return (
    <div
      ref={sidebarRef}
      className="flex flex-col w-full h-full bg-white border-l border-gray-200"
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        {loadingModule ? (
          <div className="flex justify-center py-2">
            <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : module ? (
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-gray-900">
              {module.moduleName}
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{totalPrograms} programmes</span>
              </div>
              {totalItems > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{totalItems} contenus</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-2 text-center text-gray-500">
            Module non disponible
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-sm text-center text-red-600 border-b border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 mx-auto mb-1" />
            {error}
          </div>
        )}

        {loadingProgrammes && (
          <div className="p-4 text-center">
            <p className="mt-2 text-sm text-gray-600">
              Chargement des programmes...
            </p>
          </div>
        )}

        {!loadingProgrammes &&
          programmes.map((programme) => (
            <div
              key={programme.idProgramme}
              className="border-b border-gray-200"
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleProgramme(programme.idProgramme)}
              >
                <div className="flex-4">
                  <h4 className="text-sm font-bold text-gray-900">
                    {programme.program_title || "Programme sans titre"}
                  </h4>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  {programmeContents[programme.idProgramme]?.length > 0 && (
                    <span className="px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded-full">
                      {programmeContents[programme.idProgramme].length}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      openProgrammes[programme.idProgramme] ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {openProgrammes[programme.idProgramme] && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {loadingContents[programme.idProgramme] && (
                    <div className="px-4 py-3 text-center">
                      <span className="ml-2 text-sm text-gray-600">
                        Chargement...
                      </span>
                    </div>
                  )}

                  {!loadingContents[programme.idProgramme] &&
                    programmeContents[programme.idProgramme] && (
                      <div>
                        {programmeContents[programme.idProgramme].length > 0 ? (
                          programmeContents[programme.idProgramme].map(
                            (content) => (
                              <div
                                key={content.id}
                                className={`px-6 py-3 border-b border-gray-200 last:border-b-0 cursor-pointer transition-colors duration-200 ${
                                  selectedContentId === content.id
                                    ? "bg-blue-100 border-l-4 border-l-blue-500" // État sélectionné
                                    : "hover:bg-white" // État normal avec hover
                                }`}
                                onClick={() => handleSelectContent(content.id)}
                              >
                                <div
                                  className={`font-medium text-sm ${
                                    selectedContentId === content.id
                                      ? "text-blue-900" // Texte bleu foncé quand sélectionné
                                      : "text-gray-800" // Texte gris normal
                                  }`}
                                >
                                  {content.title}
                                </div>
                                {content.description && (
                                  <div
                                    className={`text-xs mt-1 line-clamp-2 ${
                                      selectedContentId === content.id
                                        ? "text-blue-700"
                                        : "text-gray-600"
                                    }`}
                                    // SÉCURITÉ: Validation du contenu HTML ou utilisation de textContent
                                    title={content.description.replace(
                                      /<[^>]*>/g,
                                      ""
                                    )}
                                  >
                                    {content.description.replace(
                                      /<[^>]*>/g,
                                      ""
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <div className="px-4 py-3 text-sm text-center text-gray-500">
                            Aucun contenu disponible
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}

        {!loadingProgrammes && programmes.length === 0 && (
          <div className="p-4 text-sm text-center text-gray-500">
            Aucun programme disponible
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseSidebar;
