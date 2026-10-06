// EvaluationDrawerCfp.jsx
import { useEffect, useState, useCallback } from "react";
import { EvaluationSheetCfp } from "./EvaluationSheetCfp";
import EvaluationFormCfp from "./EvaluationFormCfp";
import axios from "../../../../../../config/axios";
import LoadingSpinner from "../LoadingSpinner";
import { useAuth } from "../../../../../../contexts/AuthContext";

// Ampiana ny `onSuccess` eo amin'ny props
export function EvaluationDrawerCfp({ project, onClose, onSuccess }) {
  const [evaluationData, setEvaluationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const { user: authUser } = useAuth();

  // Fonction pour récupérer les données d'évaluation
  const fetchData = useCallback(async () => {
    if (!project?.idProjet || !project?.idEmploye) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `cfp/projet/evaluation/checkEval/${project.idProjet}/${project.idEmploye}`;
      const response = await axios.get(url);

      if (response.data) {
        setEvaluationData(response.data);
        // Check if an evaluation exists to set the initial view
        if (response.data.one?.idValComment) {
          setIsEditing(false); // Display sheet if evaluation exists
        } else {
          setIsEditing(true); // Display form if no evaluation exists
        }
      }
    } catch (error) {
      console.error("Erreur récupération évaluation:", error);
      setError(
        error.response?.data?.message || "Erreur de connexion au serveur"
      );
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  }, [project?.idProjet, project?.idEmploye]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditMode = () => setIsEditing(true);

  // Ity no manova ny isEditing sy manao fetch.
  const handleBackToSheet = () => {
    setIsEditing(false);
    fetchData();
  };

  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  const handleEvaluationSuccess = () => {
    // Rehefa vita soa aman-tsara ny fanampiana na fanovana évaluation,
    // dia antsoina ity fonction ity.
    if (onSuccess) {
      onSuccess(); // Antsoina ilay fonction avy any amin'ny ray aman-dreny.
    }
    onClose(); // Akatona ny drawer.
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 " onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Évaluation - {project?.emp_name} {project?.emp_firstname}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-red-500 text-lg font-medium mb-4">
                Erreur
              </div>
              <div className="text-gray-600 text-center mb-6">{error}</div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
          {!isLoading && !error && (
            <>
              {isEditing ? (
                <EvaluationFormCfp
                  user={authUser}
                  evaluation={project}
                  evaluationData={evaluationData}
                  isLoading={isLoading}
                  isEditing={isEditing}
                  // Fanovana lehibe: ampiasaina ny handleEvaluationSuccess vaovao
                  onSuccess={handleEvaluationSuccess}
                  onBack={handleBackToSheet}
                  onClose={onClose}
                />
              ) : (
                <EvaluationSheetCfp
                  idProject={project?.idProjet} // ← Passez idProject
                  idEmploye={project?.idEmploye} // ← Passez idEmploye
                  project={project}
                  user={authUser}
                  evaluationData={evaluationData}
                  isLoading={isLoading}
                  onEdit={handleEditMode}
                  onClose={onClose}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
