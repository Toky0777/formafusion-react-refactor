import { useState } from "react";
import CourseSidebar from "./CourseSidebar";
import EditContentCard from "./EditContentCard";
import Liste from "./Liste"; // Importez votre composant Liste

export default function Create() {
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [currentView, setCurrentView] = useState("edit"); // 'edit' ou 'liste'
  const [moduleContentIdForListe, setModuleContentIdForListe] = useState(null);

  const handlePreviewClick = (moduleContentId) => {
    setModuleContentIdForListe(moduleContentId);
    setCurrentView("liste");
  };

  const handleBackToEdit = () => {
    setCurrentView("edit");
  };

  const renderMainContent = () => {
    if (currentView === "liste" && moduleContentIdForListe) {
      return (
        <Liste
          moduleContentId={moduleContentIdForListe}
          onBackToEdit={handleBackToEdit}
        />
      );
    }

    if (selectedContentId) {
      return (
        <EditContentCard
          idModuleContent={selectedContentId}
          onPreviewClick={handlePreviewClick}
        />
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-gray-300"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        <p className="text-lg font-medium text-gray-400 mb-2">
          Aucun contenu sélectionné
        </p>
        <p className="text-sm text-gray-400">
          Sélectionnez un contenu dans le menu pour commencer l'édition
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="flex">
            <div className="flex-1 h-[650px] mr-4">{renderMainContent()}</div>

            <div className="border-2 w-[500px] border-gray-200 bg-white">
              <CourseSidebar onSelectContent={setSelectedContentId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
