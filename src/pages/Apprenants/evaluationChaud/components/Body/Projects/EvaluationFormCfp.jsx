import { useState, useEffect } from "react";
import {
  X,
  Star,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Send,
} from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import axios from "../../../../../../config/axios";

// Définition des libellés de notation
const RATING_LABELS = {
  1: "Insatisfaisant",
  2: "Faible",
  3: "Moyen",
  4: "Bien",
  5: "Excellent",
};

const EvaluationFormCfp = ({
  user,
  onClose,
  evaluation,
  evaluationData,
  isLoading,
  isEditing = false,
  onSuccess,
  onBack,
}) => {
  const [formData, setFormData] = useState({
    idProjet: evaluation?.idProjet || "",
    idEmploye: evaluation?.idEmploye,
    generalApreciate: 0, // Changé de 5 à 0
    eval_note: {},
    com1: "",
    com2: "",
    temoignage: "",
    idQuestion: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Initialisation du formulaire lorsque les données d'évaluation sont disponibles
  useEffect(() => {
    if (!isLoading && evaluationData) {
      const initialNotes = {};
      const questionIds = [];
      const { questions, notes, one } = evaluationData;

      if (questions?.length > 0) {
        questions.forEach((question) => {
          questionIds.push(question.idQuestion);
          const existingNote =
            isEditing &&
            notes?.find((note) => note.idQuestion === question.idQuestion);
          // Changé de 0 à null pour indiquer aucune sélection
          initialNotes[question.idQuestion] = existingNote?.note ?? null;
        });
      }

      setFormData((prev) => ({
        ...prev,
        idProjet: evaluation?.idProjet || prev.idProjet,
        eval_note: initialNotes,
        idQuestion: questionIds,
        // Changé de 5 à 0 pour l'appréciation générale
        generalApreciate: isEditing ? one?.generalApreciate ?? 0 : 0,
        com1: isEditing ? one?.com1 ?? "" : "",
        com2: isEditing ? one?.com2 ?? "" : "",
        temoignage: isEditing ? one?.temoignage ?? "" : "",
      }));
    }
  }, [evaluation, evaluationData, isLoading, isEditing]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (questionId, rating) => {
    setFormData((prev) => ({
      ...prev,
      eval_note: {
        ...prev.eval_note,
        [questionId]: parseFloat(rating),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const parsedEmployeId = parseInt(formData.idEmploye);
    if (isNaN(parsedEmployeId)) {
      setError("L'identifiant de l'employé est manquant ou invalide.");
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = {
        idProjet: parseInt(formData.idProjet),
        idEmploye: parsedEmployeId,
        idQuestion: formData.idQuestion,
        eval_note: formData.idQuestion.map((id) => {
          const note = formData.eval_note[id];
          // Changé pour gérer les notes null/non sélectionnées
          return note && note >= 1 ? parseFloat(note) : 0;
        }),
        generalApreciate: parseInt(formData.generalApreciate) || 0, // Ajout d'une valeur par défaut
        com1: formData.com1 || "Pas de réponse",
        com2: formData.com2 || "Pas de réponse",
        temoignage: formData.temoignage || "Pas de commentaire",
      };

      const endpoint = isEditing
        ? "cfp/projet/evaluation/editEval"
        : "cfp/projet/evaluation/chaud";
      await axios[isEditing ? "patch" : "post"](endpoint, submitData);

      if (onSuccess) onSuccess();
      else onClose();
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde:", err);
      setError(
        err.response?.data?.error || err.message || "Une erreur est survenue"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonctions d'aide pour le style
  const getRatingColor = (rating, currentRating) => {
    // Si aucune note n'est sélectionnée (0 ou null), toutes les étoiles sont grises
    if (!currentRating || currentRating === 0) {
      return "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600";
    }

    if (rating > currentRating)
      return "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600";

    const colors = {
      1: "bg-yellow-200 text-gray-800 hover:bg-yellow-300",
      2: "bg-yellow-300 text-gray-800 hover:bg-yellow-400",
      3: "bg-yellow-400 text-white hover:bg-yellow-500",
      4: "bg-green-400 text-white hover:bg-green-500",
      5: "bg-green-600 text-white hover:bg-green-700",
    };
    return `${colors[Math.floor(rating)]} shadow-sm`;
  };

  const getBadgeColor = (rating) => {
    // Si aucune note n'est sélectionnée
    if (!rating || rating === 0) {
      return "bg-gray-200 text-gray-600";
    }

    const roundedRating = Math.floor(rating);
    const colors = {
      1: "bg-yellow-200 text-gray-800",
      2: "bg-yellow-300 text-gray-800",
      3: "bg-yellow-300 text-gray-800",
      4: "bg-green-400 text-white",
      5: "bg-green-600 text-white",
    };
    return colors[roundedRating] || "bg-gray-200 text-gray-600";
  };

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    // Si aucune note n'est sélectionnée, afficher des étoiles vides
    if (!rating || rating === 0) {
      return (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="w-4 h-4 text-gray-300" />
          ))}
          <span className="ml-1 text-sm font-medium text-gray-500">
            (Non noté)
          </span>
        </div>
      );
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <Star className="w-4 h-4 text-gray-300" />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: "50%" }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            );
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
        <span className="ml-1 text-sm font-medium text-gray-700">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <LoadingSpinner className="w-12 h-12 text-violet-600 mx-auto" />
          <p className="text-gray-600 text-center mt-4">
            Chargement du formulaire...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              )}
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? "Modifier l'évaluation" : "Évaluation à chaud"}
                </h2>
                <p className="text-violet-100 text-sm">
                  Projet: {evaluationData?.projet?.project_title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            >
              <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="h-[calc(100vh-80px)] overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-700">{error}</p>
              </div>
            )}

            {/* Section : Appréciation générale */}
            <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-2xl border border-yellow-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-xl">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Appréciation générale
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Note moyenne calculée à partir des critères
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${getBadgeColor(
                      formData.generalApreciate
                    )} px-3 py-1 rounded-full`}
                  >
                    {formData.generalApreciate > 0
                      ? `${formData.generalApreciate.toFixed(1)}/5`
                      : "Non noté"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formData.generalApreciate > 0
                      ? RATING_LABELS[Math.round(formData.generalApreciate)]
                      : "Aucune note"}
                  </div>
                </div>
              </div>
            </div>

            {/* Section : Questions par type */}
            {evaluationData?.typeQuestions?.map((typeQuestion) => {
              const relatedQuestions = evaluationData.questions.filter(
                (q) => q.idTypeQuestion === typeQuestion.idTypeQuestion
              );
              return (
                <div
                  key={typeQuestion.idTypeQuestion}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      {typeQuestion.typeQuestion}
                    </h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {relatedQuestions.map((question) => {
                      const currentNote =
                        formData.eval_note[question.idQuestion];
                      return (
                        <div
                          key={question.idQuestion}
                          className="space-y-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-gray-700 font-medium flex-1 pr-2">
                              {question.question}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">
                                {currentNote && currentNote > 0
                                  ? RATING_LABELS[Math.round(currentNote)]
                                  : "Non noté"}
                              </span>
                              <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getBadgeColor(
                                  currentNote
                                )}`}
                              >
                                {currentNote && currentNote > 0
                                  ? currentNote.toFixed(1)
                                  : "-"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                type="button"
                                key={rating}
                                onClick={() =>
                                  handleRatingChange(
                                    question.idQuestion,
                                    rating
                                  )
                                }
                                className={`w-8 h-8 rounded-full font-bold transition-all duration-200 flex items-center justify-center text-xs hover:scale-105 transform ${getRatingColor(
                                  rating,
                                  currentNote
                                )}`}
                                title={RATING_LABELS[rating]}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Section : Commentaires et feedback */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  Commentaires et feedback
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  {
                    id: "com1",
                    label: "Points forts de la formation",
                    placeholder:
                      "Quels aspects de la formation vous ont le plus marqué positivement ?",
                  },
                  {
                    id: "com2",
                    label: "Points à améliorer",
                    placeholder:
                      "Quels éléments pourraient être améliorés selon vous ?",
                  },
                  {
                    id: "temoignage",
                    label: "Témoignage personnel",
                    placeholder:
                      "Partagez votre expérience globale et vos recommandations...",
                  },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label
                      htmlFor={field.id}
                      className="block font-semibold text-gray-800"
                    >
                      {field.label}
                    </label>
                    <textarea
                      id={field.id}
                      value={formData[field.id]}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder={field.placeholder}
                      rows={3}
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {formData[field.id].length}/500 caractères
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section : Boutons d'action */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="w-4 h-4" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {isEditing ? "Mettre à jour" : "Soumettre l'évaluation"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationFormCfp;
