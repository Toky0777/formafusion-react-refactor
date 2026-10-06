import { useState, useEffect, useCallback, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import axios from "../../../../config/axios";

const QCMComponent = () => {
  // États principaux
  const [qcm, setQcm] = useState({});
  const [question, setQuestion] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState({ current_index: 0, responses: {} });
  const [hasImage, setHasImage] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const [saveStatus, setSaveStatus] = useState({
    show: false,
    message: "",
    isError: false,
  });
  const [textResponse, setTextResponse] = useState("");
  const [loading, setLoading] = useState(true);
  // Hooks et refs
  const { id } = useParams();
  const navigate = useNavigate();
  const isInitializedRef = useRef(false);
  const timerIntervalRef = useRef(null);

  // Fonction pour récupérer les données du QCM
  const QcmRequest = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/qcm/solve/${id}/respond/${questionIndex}`
      );
      setQcm(data.qcm);
      setQuestion(data.qcm.questions_qcm);

      // Gestion de l'image
      if (data.imagePath) {
        setHasImage(true);
        setImagePath(data.imagePath);
      } else {
        setHasImage(false);
        setImagePath("");
      }

      // Gestion du logo
      if (data.logoBase64) {
        setLogoBase64(data.logoBase64);
      }

      // Validation de l'index de question
      if (data.qcm.questions_qcm && data.qcm.questions_qcm.length > 0) {
        const validIndex = Math.min(
          questionIndex,
          data.qcm.questions_qcm.length - 1
        );
        const correctedIndex = Math.max(0, validIndex);
        if (correctedIndex !== questionIndex) {
          setQuestionIndex(correctedIndex);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du QCM:", error);
    } finally {
      setLoading(false);
    }
  }, [id, questionIndex]);

  // Fonction pour initialiser le timer
  const initializeTimer = useCallback(async () => {
    try {
      const { data } = await axios.get(`/qcm/solve/${id}/start-test`);

      const { start_time, duration } = data;
      const endTime = new Date(start_time).getTime() + duration * 1000;

      // Nettoyer l'ancien timer s'il existe
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((endTime - now) / 1000);

        if (diff <= 0) {
          clearInterval(timerIntervalRef.current);
          setRemainingTime(0);
          setFinished(true);
        } else {
          setRemainingTime(diff);
        }
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de l'initialisation du timer:", error);
    }
  }, [id]);

  // Effet d'initialisation (appelé une seule fois)
  useEffect(() => {
    if (!isInitializedRef.current && id) {
      isInitializedRef.current = true;

      // Initialiser la date de début si c'est la première question
      if (questionIndex === 0 && !sessionStorage.getItem("dateDebut")) {
        sessionStorage.setItem("dateDebut", Date.now());
      }

      // Charger les données et initialiser le timer
      Promise.all([QcmRequest(), initializeTimer()]);
    }

    // Cleanup du timer
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [id]); // Dépendances minimales

  // Effet pour vérifier l'image de la question actuelle
  useEffect(() => {
    if (
      question.length > 0 &&
      questionIndex >= 0 &&
      questionIndex < question.length
    ) {
      const currentQuestion = question[questionIndex];

      if (
        imagePath &&
        currentQuestion &&
        imagePath.includes(`/${currentQuestion.idQuestion}/`)
      ) {
        setHasImage(true);
      } else {
        setHasImage(false);
      }
    }
  }, [questionIndex, question, imagePath]);

  // Récupération de la question actuelle
  const currentQuestion =
    question.length > 0 && questionIndex >= 0 && questionIndex < question.length
      ? question[questionIndex]
      : null;

  // Fonction pour formater le temps
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Fonction pour afficher le statut de sauvegarde
  const showSaveStatus = useCallback((message, isError = false) => {
    setSaveStatus({ show: true, message, isError });
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, show: false }));
    }, 2000);
  }, []);

  // Fonction pour sauvegarder une réponse
  const saveResponse = useCallback(
    async (responseValue = null, index = questionIndex, isText = false) => {
      if (!currentQuestion) return;

      try {
        setProgress((prev) => ({
          ...prev,
          current_index: index,
          responses: {
            ...prev.responses,
            [currentQuestion.idQuestion]: responseValue,
          },
        }));

        showSaveStatus("Réponse sauvegardée");
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        showSaveStatus("Erreur lors de la sauvegarde", true);
      }
    },
    [currentQuestion, questionIndex, showSaveStatus]
  );

  // Gestionnaire pour les boutons radio
  const handleRadioChange = useCallback(
    async (responseId) => {
      if (!currentQuestion) return;

      const currentResponse = progress.responses[currentQuestion.idQuestion];

      if (currentResponse === responseId) {
        await saveResponse(null);
      } else {
        await saveResponse(responseId, questionIndex);
      }
    },
    [currentQuestion, progress.responses, saveResponse, questionIndex]
  );

  // Gestionnaire pour les champs texte
  const handleTextChange = useCallback(
    (e) => {
      const value = e.target.value;
      setTextResponse(value);

      clearTimeout(window.textSaveTimeout);
      window.textSaveTimeout = setTimeout(() => {
        saveResponse(value, questionIndex, true);
      }, 1000);
    },
    [saveResponse, questionIndex]
  );

  // Gestionnaires de navigation
  const handlePrevious = useCallback(() => {
    if (questionIndex > 0) {
      const newIndex = questionIndex - 1;
      setQuestionIndex(newIndex);

      if (question[newIndex]) {
        setTextResponse(
          progress.responses[question[newIndex].idQuestion] || ""
        );
      }
    }
  }, [questionIndex, question, progress.responses]);

  const handleNext = useCallback(() => {
    if (questionIndex < question.length - 1) {
      const newIndex = questionIndex + 1;
      setQuestionIndex(newIndex);

      const updatedProgress = { ...progress, current_index: newIndex };
      setProgress(updatedProgress);
      sessionStorage.setItem("progress", JSON.stringify(updatedProgress));

      if (question[newIndex]) {
        setTextResponse(
          progress.responses[question[newIndex].idQuestion] || ""
        );
      }
    }
  }, [questionIndex, question, progress]);

  const handleFinish = useCallback(async () => {
    const newIndex = questionIndex + 1;
    const updatedProgress = { ...progress, current_index: newIndex };

    setQuestionIndex(newIndex);
    setProgress(updatedProgress);
    sessionStorage.setItem("progress", JSON.stringify(updatedProgress));
    sessionStorage.setItem("qcm", JSON.stringify(qcm));

    const payload = {
      finished_test: new Date().toISOString(),
    };

    try {
      await axios.put(`/qcm/solve/${id}/finished-test`, payload);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des réponses:", error);
    }

    navigate(`/particulier/test/qcm/solve/${id}/review`);
  }, [questionIndex, progress, qcm, id, navigate]);

  // Effet pour mettre à jour la réponse texte lors du changement de question
  useEffect(() => {
    if (
      currentQuestion &&
      currentQuestion.type_qcm &&
      currentQuestion.type_qcm.type === "open"
    ) {
      setTextResponse(progress.responses[currentQuestion.idQuestion] || "");
    }
  }, [currentQuestion, progress.responses]);

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 rounded-full border-violet-200 border-t-violet-600 animate-spin"></div>
            <div className="text-xl font-medium text-gray-700">
              Chargement...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vérification des données
  if (!currentQuestion || !qcm.intituleQCM) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-gray-100">
        <div className="flex items-center justify-center h-screen">
          <div className="p-8 bg-white border border-red-200 shadow-lg rounded-2xl">
            <div className="text-xl font-medium text-red-600">
              Erreur: Aucune question trouvée
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-gray-100">
      <div className="max-w-6xl px-4 py-8 mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    {qcm.intituleQCM}
                  </h1>
                  <p className="mt-1 text-white">
                    {qcm.descriptionQCM ||
                      "Aucune description fournie pour ce QCM."}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="mb-4 md:mb-0">
                    {logoBase64 ? (
                      <img
                        src={logoBase64}
                        alt="Company Logo"
                        className="inline-block h-12 md:h-16"
                      />
                    ) : (
                      <div className="flex items-center inline-block h-12 md:h-16">
                        <span className="text-xl font-bold text-white">
                          FormaFusion
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 bg-amber-50 backdrop-blur-sm rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-700" />
                      <span className="text-xl font-bold text-purple-700">
                        {formatTime(remainingTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 py-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                <span>
                  Question {questionIndex + 1} sur {question.length}
                </span>
                <span>
                  {Math.round((questionIndex / question.length) * 100)}%
                  complété
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 transition-all duration-300 bg-purple-600 rounded-full"
                  style={{
                    width: `${(questionIndex / question.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Question Section */}
          <div className={`${hasImage ? "lg:col-span-8" : "lg:col-span-12"}`}>
            <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl md:p-8">
              <div className="mb-6">
                <div className="flex items-center mb-4 space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100">
                    <span className="text-sm font-bold text-violet-600">
                      {questionIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Question {questionIndex + 1}
                  </h2>
                </div>

                <p className="text-lg leading-relaxed text-gray-700">
                  {currentQuestion.texteQuestion}
                </p>
              </div>

              {/* Responses */}
              <div className="space-y-3">
                {currentQuestion.type_qcm &&
                currentQuestion.type_qcm.type === "qcm" ? (
                  currentQuestion.reponses_questions &&
                  currentQuestion.reponses_questions.map((reponse) => {
                    const isSelected =
                      progress.responses[currentQuestion.idQuestion] ===
                      reponse.idReponse;
                    return (
                      <div key={reponse.idReponse} className="relative">
                        <input
                          className="sr-only"
                          type="radio"
                          name="idReponse"
                          id={`reponse_${reponse.idReponse}`}
                          value={reponse.idReponse}
                          checked={isSelected}
                          onChange={() => handleRadioChange(reponse.idReponse)}
                        />
                        <label
                          className={`
                                                        block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                                        ${
                                                          isSelected
                                                            ? "border-violet-500 bg-violet-50 shadow-md"
                                                            : "border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-25"
                                                        }
                                                    `}
                          htmlFor={`reponse_${reponse.idReponse}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                                                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                                            ${
                                                              isSelected
                                                                ? "border-violet-500 bg-violet-500"
                                                                : "border-gray-300"
                                                            }
                                                        `}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span
                              className={`text-lg ${
                                isSelected
                                  ? "text-violet-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {reponse.texteReponse}
                            </span>
                          </div>
                        </label>
                      </div>
                    );
                  })
                ) : (
                  <div className="relative">
                    <textarea
                      name="reponse"
                      placeholder="Saisissez votre réponse ici..."
                      value={textResponse}
                      onChange={handleTextChange}
                      rows={4}
                      className="w-full p-4 transition-colors duration-200 border-2 border-gray-200 resize-none rounded-xl focus:border-violet-500 focus:ring-0"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Section */}
          {hasImage && (
            <div className="lg:col-span-4">
              <div className="h-full p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <img
                    src={imagePath}
                    alt="Question illustration"
                    className="object-contain max-w-full max-h-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <div className="p-6 bg-white border border-gray-200 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between">
              {questionIndex > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="inline-flex items-center px-6 py-3 space-x-2 font-medium text-gray-700 transition-colors duration-200 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Précédent</span>
                </button>
              ) : (
                <div></div>
              )}

              {questionIndex < question.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-purple-700 shadow-lg rounded-xl hover:from-violet-700 hover:to-purple-800 hover:shadow-xl"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center px-6 py-3 space-x-2 font-medium text-white transition-all duration-200 bg-purple-700 shadow-lg rounded-xl hover:from-green-700 hover:to-emerald-800 hover:shadow-xl"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Terminer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Status Notification */}
      {saveStatus.show && (
        <div className="fixed z-50 bottom-6 right-6">
          <div
            className={`
                        px-6 py-3 rounded-xl text-white font-medium shadow-lg transform transition-all duration-300 flex items-center space-x-2
                        ${saveStatus.isError ? "bg-red-500" : "bg-green-500"}
                    `}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{saveStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QCMComponent;
