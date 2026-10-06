import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import SessionModifCalendar from "../../drawer/project/modif-calendar";

export const Agenda = ({
  toggleAfficheAgenda,
  AfficheAgenda,
  setShowPageAgenda,
  session,
  allSeances,
  setCurrentSeanceId,
  setSelectedSessionType,
  setShowReportInput,
  setReportDate,
  setReportStartTime,
  setIsUndetermined,
  setReportEndTime,
  setShowModificationTypeSession,
  setSeanceToDelete,
  setShowConfirmDeleteSeance,
  showPageAgenda,
  id,
  selectedSessionType,
  showReportInput,
  reportDate,
  isUndetermined,
  reportStartTime,
  reportEndTime,
  handleConfirmTypeChange,
  fetchSeanceProjet,
  showModificationTypeSession,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";

    try {
      // Nettoyer la date string pour gérer différents formats
      let cleanDateString = dateString.toString().trim();

      // Si la date contient un espace, prendre seulement la partie date
      if (cleanDateString.includes(" ")) {
        cleanDateString = cleanDateString.split(" ")[0];
      }

      // Si c'est déjà au format YYYY-MM-DD, le parser correctement
      const date = new Date(cleanDateString);

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.warn("Date invalide:", dateString);
        return "Date invalide";
      }

      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Erreur formatDate:", error, "Date string:", dateString);
      return "Date invalide";
    }
  };

  const getTotalDuration = (seances) => {
    if (!seances || !Array.isArray(seances) || seances.length === 0) {
      return "0h";
    }

    let totalMinutes = 0;

    seances.forEach((seance) => {
      // Pour les sessions replanifiées, utiliser les heures de report si disponibles
      const isReported =
        seance.is_reported === 1 || seance.is_reported === true;

      let startTime, endTime;

      if (
        isReported &&
        seance.heure_debut_reportee &&
        seance.heure_fin_reportee
      ) {
        // Utiliser les heures de report pour les sessions replanifiées
        startTime = seance.heure_debut_reportee;
        endTime = seance.heure_fin_reportee;
      } else {
        // Utiliser les heures normales
        startTime = seance.heureDebut;
        endTime = seance.heureFin;
      }

      // Vérifier que les heures sont valides
      if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);

        if (!isNaN(start) && !isNaN(end)) {
          const durationMs = end - start;
          const durationMinutes = durationMs / (1000 * 60);

          if (durationMinutes > 0) {
            totalMinutes += durationMinutes;
          }
        }
      }
    });

    // Convertir les minutes en heures et minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    if (hours === 0 && minutes === 0) {
      return "0h";
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes.toString().padStart(2, "0")}`;
    }
  };

  const handleModificationTypeSession = async (
    idSeance,
    session_catch_up,
    is_report,
    reportInfo
  ) => {
    setCurrentSeanceId(idSeance);

    // Réinitialiser tous les états
    setSelectedSessionType("false");
    setShowReportInput(false);
    setReportDate("");
    setReportStartTime("");
    setReportEndTime("");
    setIsUndetermined(false);

    // Configurer selon le type actuel
    if (is_report) {
      setSelectedSessionType("report");
      setShowReportInput(true);

      if (reportInfo) {
        // CORRECTION : Utiliser les bonnes clés et formater la date
        const reportDate =
          reportInfo.report_date || reportInfo.date_report || "";
        if (reportDate) {
          // S'assurer que la date est au format YYYY-MM-DD
          let formattedDate = reportDate;
          if (reportDate.includes(" ")) {
            formattedDate = reportDate.split(" ")[0];
          }
          setReportDate(formattedDate);
        }

        setReportStartTime(
          reportInfo.heure_debut_reportee || reportInfo.heureDebut || ""
        );
        setReportEndTime(
          reportInfo.heure_fin_reportee || reportInfo.heureFin || ""
        );
        setIsUndetermined(
          reportInfo.is_report_undetermined ||
            reportInfo.is_undetermined ||
            false
        );
      }
    } else {
      const initialType =
        session_catch_up === "1" ||
        session_catch_up === 1 ||
        session_catch_up === "true" ||
        session_catch_up === "Rattrapage"
          ? "true"
          : "false";
      setSelectedSessionType(initialType);
    }

    setShowModificationTypeSession(true);
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "Heure non définie";

    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erreur formatTime:", error);
      return dateTimeString;
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      {/* Header Card */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Header Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleAfficheAgenda}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-blue-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Agenda</h2>
                <p className="text-sm text-gray-600">
                  Gérez vos sessions de formation
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {AfficheAgenda ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPageAgenda(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Éditer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {AfficheAgenda && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {session?.seances?.length ?? 0}
                  </p>
                  <p className="text-sm text-gray-600">Sessions planifiées</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {getTotalDuration(session.seances) ?? "0h"}
                  </p>
                  <p className="text-sm text-gray-600">Durée totale</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {AfficheAgenda && (
          <div className="px-4 py-4">
            {session?.seances?.length > 0 ? (
              <div className="space-y-4">
                {allSeances
                  .filter((seance) => true)
                  .sort((a, b) => new Date(a.start) - new Date(b.start))
                  .map((seance, index) => {
                    const isReported =
                      seance.is_reported === 1 || seance.is_reported === true;
                    const isCatchUp =
                      seance.session_catch_up === 1 ||
                      seance.session_catch_up === "1" ||
                      seance.session_catch_up === "true";

                    // LOGIQUE CORRIGÉE - Recherche de la VRAIE session originale
                    let originalSession = null;
                    let newDateSession = null;

                    if (isReported) {
                      // Rechercher la VRAIE session normale correspondante
                      const normalSession = allSeances.find(
                        (s) =>
                          s.idSeance === seance.idSeance &&
                          !s.is_reported &&
                          s.session_catch_up !== "true" &&
                          s.session_catch_up !== 1
                      );

                      if (normalSession) {
                        originalSession = {
                          start: normalSession.start,
                          end: normalSession.end,
                          dateSeance: normalSession.dateSeance,
                          start_time: normalSession.heureDebut,
                          end_time: normalSession.heureFin,
                          isRealSession: true,
                        };
                      } else {
                        // Fallback : utiliser les données originales sauvegardées
                        const originalDate =
                          seance.original_date || seance.dateSeance;
                        originalSession = {
                          start:
                            originalDate +
                            "T" +
                            (seance.original_heure_debut ||
                              seance.heureDebut ||
                              "00:00:00"),
                          end:
                            originalDate +
                            "T" +
                            (seance.original_heure_fin ||
                              seance.heureFin ||
                              "00:00:00"),
                          dateSeance: originalDate,
                          start_time:
                            seance.original_heure_debut || seance.heureDebut,
                          end_time:
                            seance.original_heure_fin || seance.heureFin,
                          isReconstructed: true,
                        };
                      }

                      // Configuration de la nouvelle date
                      const reportDate = seance.report_date
                        ? seance.report_date.toString().split(" ")[0]
                        : null;
                      if (reportDate) {
                        newDateSession = {
                          date: reportDate,
                          start_time:
                            seance.heure_debut_reportee || seance.heureDebut,
                          end_time:
                            seance.heure_fin_reportee || seance.heureFin,
                        };
                      }
                    }

                    // Déterminer ce qui doit être affiché pour la session actuelle
                    const displayDate = newDateSession
                      ? newDateSession.date
                      : seance.start.split("T")[0];
                    const displayStartTime = newDateSession
                      ? newDateSession.start_time
                      : seance.heureDebut;
                    const displayEndTime = newDateSession
                      ? newDateSession.end_time
                      : seance.heureFin;

                    return (
                      <div
                        key={seance.id}
                        className="transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-sm"
                      >
                        <div className="p-4">
                          {/* EN-TÊTE COMPACTE */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start flex-1 gap-3">
                              <div
                                className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0
                                ${
                                  isReported
                                    ? "bg-amber-500"
                                    : isCatchUp
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                                }
                              `}
                              >
                                {index + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                                    Session{" "}
                                    {isReported
                                      ? "replanifiée"
                                      : isCatchUp
                                      ? "de rattrapage"
                                      : "normale"}
                                  </h3>
                                  <span
                                    className={`
                                    px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                                    ${
                                      isReported
                                        ? "bg-amber-50 text-amber-700"
                                        : isCatchUp
                                        ? "bg-orange-50 text-orange-700"
                                        : "bg-blue-50 text-blue-700"
                                    }
                                  `}
                                  >
                                    {isReported
                                      ? "Replanifiée"
                                      : isCatchUp
                                      ? "Rattrapage"
                                      : "Normale"}
                                  </span>
                                </div>

                                {/* INFORMATIONS PRINCIPALES */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {formatDate(displayDate + "T00:00:00")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {displayStartTime
                                        ? formatTime(
                                            displayDate + "T" + displayStartTime
                                          )
                                        : "N/A"}
                                      -{" "}
                                      {displayEndTime
                                        ? formatTime(
                                            displayDate + "T" + displayEndTime
                                          )
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={() => {
                                  handleModificationTypeSession(
                                    seance.idSeance,
                                    seance.session_catch_up,
                                    seance.is_reported,
                                    seance
                                  );
                                }}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Modifier le type"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSeanceToDelete(seance.id);
                                  setShowConfirmDeleteSeance(true);
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* SECTION REPLANIFICATION - DESIGN ÉPURÉ */}
                          {isReported && originalSession && newDateSession && (
                            <div className="pt-3 mt-3 border-t border-gray-100">
                              <div className="flex items-start gap-2">
                                <RefreshCw className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-gray-700">
                                      Replanification
                                    </span>
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2 text-sm">
                                    {/* LIGNE ORIGINALE */}
                                    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-gray-500" />
                                        <span className="text-gray-600">
                                          Normale :
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium text-gray-900">
                                          {formatDate(
                                            originalSession.dateSeance +
                                              "T00:00:00"
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {originalSession.start_time} -{" "}
                                          {originalSession.end_time}
                                        </div>
                                      </div>
                                    </div>

                                    {/* LIGNE REPLANIFIÉE */}
                                    <div className="flex items-center justify-between p-2 rounded bg-amber-50">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-amber-600" />
                                        <span className="text-amber-700">
                                          Replanifiée :
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-medium text-amber-800">
                                          {formatDate(
                                            newDateSession.date + "T00:00:00"
                                          )}
                                        </div>
                                        <div className="text-xs text-amber-600">
                                          {newDateSession.start_time} -{" "}
                                          {newDateSession.end_time}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {/* BOUTON AJOUTER SESSION - DESIGN ÉPURÉ */}
                <button
                  onClick={() => setShowPageAgenda(true)}
                  className="w-full p-4 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-300 hover:bg-blue-25 group"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600">
                    <div className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-blue-50 group-hover:bg-blue-100">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      Nouvelle session
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="mb-1 text-base font-medium text-gray-900">
                  Aucune session
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  Planifiez votre première session
                </p>
                <button
                  onClick={() => setShowPageAgenda(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" />
                  Créer une session
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {showPageAgenda && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 transition-opacity duration-300 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPageAgenda(false)}
          />

          {/* Modal Panel */}
          <div className="absolute top-0 right-0 w-full h-full max-w-4xl transition-transform duration-300 transform bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50 text-blue-700">
              <h2 className="text-xl font-semibold ">Modifier l'agenda</h2>
              <button
                onClick={() => setShowPageAgenda(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="">
              <div className="text-center text-gray-500">
                <SessionModifCalendar
                  closeAgenda={() => setShowPageAgenda(false)}
                  projectId={id}
                  fetchSeanceProjet={() => fetchSeanceProjet(id)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showModificationTypeSession && (
        <div className="fixed inset-0 z-[400000] bg-gray-800/40 backdrop-blur-sm">
          {/* Modal */}
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="relative w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-xl font-bold text-gray-700">
                  Modification du type de séance
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  Sélectionnez le type de séance souhaité
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {/* Option 1: Séance normale */}
                  <label className="relative flex items-center p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl group">
                    <input
                      type="radio"
                      name="sessionType"
                      value="false"
                      checked={selectedSessionType === "false"}
                      onChange={(e) => {
                        setSelectedSessionType(e.target.value);
                        setShowReportInput(false);
                      }}
                      className="sr-only peer"
                    />
                    <div className="flex items-center w-full gap-4">
                      <div
                        className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                          selectedSessionType === "false"
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-white transition-opacity ${
                            selectedSessionType === "false"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        ></div>
                      </div>

                      <div className="flex items-center flex-1 gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            selectedSessionType === "false"
                              ? "bg-blue-100"
                              : "bg-blue-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`font-semibold transition-colors ${
                              selectedSessionType === "false"
                                ? "text-bleu-700"
                                : "text-gray-900"
                            }`}
                          >
                            Séance normale
                          </p>
                          <p className="text-xs text-gray-500">
                            Séance programmée régulièrement
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Séance de rattrapage */}
                  <label className="relative flex items-center p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl group">
                    <input
                      type="radio"
                      name="sessionType"
                      value="true"
                      checked={selectedSessionType === "true"}
                      onChange={(e) => {
                        setSelectedSessionType(e.target.value);
                        setShowReportInput(false);
                      }}
                      className="sr-only peer"
                    />
                    <div className="flex items-center w-full gap-4">
                      <div
                        className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                          selectedSessionType === "true"
                            ? "border-orange-600 bg-orange-600"
                            : "border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-white transition-opacity ${
                            selectedSessionType === "true"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        ></div>
                      </div>

                      <div className="flex items-center flex-1 gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            selectedSessionType === "true"
                              ? "bg-orange-100"
                              : "bg-orange-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`font-semibold transition-colors ${
                              selectedSessionType === "true"
                                ? "text-orange-700"
                                : "text-gray-900"
                            }`}
                          >
                            Séance de rattrapage
                          </p>
                          <p className="text-xs text-gray-500">
                            Séance pour compenser une absence
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Reporter la séance */}
                  <label className="relative flex items-center p-4 transition-all border-2 border-gray-200 cursor-pointer rounded-xl group">
                    <input
                      type="radio"
                      name="sessionType"
                      value="report"
                      checked={selectedSessionType === "report"}
                      onChange={(e) => {
                        setSelectedSessionType(e.target.value);
                        setShowReportInput(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="flex items-center w-full gap-4">
                      <div
                        className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                          selectedSessionType === "report"
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-white transition-opacity ${
                            selectedSessionType === "report"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        ></div>
                      </div>

                      <div className="flex items-center flex-1 gap-3">
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            selectedSessionType === "report"
                              ? "bg-blue-100"
                              : "bg-blue-50"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className={`font-semibold transition-colors ${
                              selectedSessionType === "report"
                                ? "text-blue-700"
                                : "text-gray-900"
                            }`}
                          >
                            Reporter la séance
                          </p>
                          <p className="text-xs text-gray-500">
                            Déplacer la séance à une autre date
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Input date pour le report */}
                  {showReportInput && (
                    <div className="mt-3 animate-fadeIn">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Nouvelle date de séance :
                      </label>
                      <input
                        type="date"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={isUndetermined}
                      />
                      {/* Champ heure de début */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {" "}
                          Heure de début :{" "}
                        </label>
                        <input
                          type="time"
                          value={reportStartTime}
                          onChange={(e) => setReportStartTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          disabled={isUndetermined}
                        />
                      </div>
                      {/* Champ heure de fin */}
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {" "}
                          Heure de fin :{" "}
                        </label>
                        <input
                          type="time"
                          value={reportEndTime}
                          onChange={(e) => setReportEndTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          disabled={isUndetermined}
                        />
                      </div>
                      {/* Checkbox indéterminé */}
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={isUndetermined}
                          onChange={(e) => setIsUndetermined(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Report indéterminé
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Info Badge */}
                <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-xs text-blue-700">
                      Le type de séance détermine comment elle sera
                      comptabilisée dans le planning et les statistiques.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 px-6 pt-2 pb-6 border-t">
                <button
                  onClick={() => setShowModificationTypeSession(false)}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmTypeChange}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 text-sm font-medium transition-all shadow-lg shadow-purple-500/30"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
