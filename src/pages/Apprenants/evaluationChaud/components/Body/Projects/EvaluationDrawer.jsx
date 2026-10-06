import { useEffect, useState, useCallback } from "react";
import { EvaluationSheet } from "./EvaluationSheet";
import EvaluationForm from "./EvaluationForm";
import axios from "../../../../../../config/axios";
import LoadingSpinner from "../LoadingSpinner"; 
import { useAuth } from "../../../../../../contexts/AuthContext"; 

export function EvaluationDrawer({ project, onClose }) {
  const [evaluationData, setEvaluationData] = useState({
    checkEval: null,
    typeQuestions: [],
    questions: [],
    notes: [],
    one: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { user: authUser, isLoading: authLoading } = useAuth();

  // Fonction pour récupérer les données d'évaluation
  const fetchData = useCallback(async () => {
    if (!authUser || !project?.idProjet) return;

    setIsLoading(true);

    try {
      const url = `employe/projet/evaluation/checkEval/${project.idProjet}/${authUser.id}`;
      const response = await axios.get(url);

      if (response.data) {
        setEvaluationData({
          checkEval: response.data.checkEval,
          typeQuestions: response.data.typeQuestions || [],
          questions: response.data.questions || [],
          notes: response.data.notes || [],
          one: response.data.one || {}
        });
      }
    } catch (error) {
      console.error("Erreur récupération évaluation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [project?.idProjet, authUser]);

  // Lazy fetch : drawer misokatra avy hatrany, data azo aorian'ny render
  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [fetchData, authLoading]);

  const handleEditMode = () => setIsEditing(true);
  const handleBackToSheet = () => {
    setIsEditing(false);
    fetchData(); // Re-fetch après édition
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay noir */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden">
        {/* Loading interne */}
        { (isLoading || authLoading) ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : isEditing || evaluationData.checkEval === 0 ? (
          <EvaluationForm
            user={authUser}
            evaluation={project}
            evaluationData={evaluationData}
            onClose={onClose}
            onSuccess={handleBackToSheet}
            isEditing={isEditing}
            onBack={handleBackToSheet}
          />
        ) : (
          <EvaluationSheet
            idProject={project?.idProjet || 0}
            onClose={onClose}
            onEdit={handleEditMode}
            user={authUser}
            evaluationData={evaluationData}
          />
        )}
      </div>
    </div>
  );
}
