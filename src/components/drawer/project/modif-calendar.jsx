import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../../config/axios";


import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useAuth } from "../../../contexts/AuthContext";
// import { useGoogleCalendar } from '../../../../context/AuthCalendarProvider';
import GoogleCalendarManager from "../../calendar/google-calendar";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  LoaderCircle,
  X,
  XCircle,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function setColorStatutRessource(statut) {
  if (statut === "Réservé") return "#33303D"; // Gris

  if (statut === "Annulé") return "#FF6347"; // Rouge Orangé

  if (statut === "En préparation") return "#66CDAA"; // Vert foncé

  if (statut === "Reporté") return "#2E705A"; // Vert foncé

  if (statut === "Planifié") return "#2552BA"; // Bleu marine

  if (statut === "En cours") return "#1E90FF"; // Bleu

  return "#32CD32"; // Vert (Terminée)
}

function calculateInterval(start, end) {
  const timeStart = new Date(start).getTime();

  const timeEnd = new Date(end).getTime();

  const mins = (timeEnd - timeStart) / (1000 * 60);

  const hrs = Math.floor(mins / 60);

  let min = mins % 60;

  const strHrs = hrs < 2 ? "heure" : "heures";

  min = min < 10 ? "0" + min : min;

  const strMin = min < 2 ? "minute" : "minutes";

  return `${hrs} ${strHrs} ${min} ${strMin}`;
}

// Fixed list of holidays

const HOLIDAYS = [
  { date: "2024-01-01", name: "Jour de l'an" },

  { date: "2024-03-08", name: "Journée internationale de la femme" },

  { date: "2024-03-11", name: "Ramadan" },

  { date: "2024-03-29", name: "Jour des Martyrs" },

  { date: "2024-03-31", name: "Pâques" },

  { date: "2024-04-01", name: "lundi de Pâques" },

  { date: "2024-04-10", name: "Aïd el-Fitr" },

  { date: "2024-05-01", name: "Fête du Travail" },

  { date: "2024-05-09", name: "Ascension" },

  { date: "2024-05-19", name: "Pentecôte" },

  { date: "2024-05-20", name: "Lundi de Pentecôte" },

  { date: "2024-06-17", name: "Aïd el-Kebir" },

  { date: "2024-06-26", name: "Fête de l'Indépendance" },

  { date: "2024-08-15", name: "Assomption" },

  { date: "2024-11-01", name: "Toussaint" },

  { date: "2024-12-25", name: "Noël" },

  { date: "2024-12-31", name: "la Saint-Sylvestre" },

  { date: "2025-01-01", name: "Jour de l'an" },
];

// --- React Component ---

const SessionModifCalendar = ({
  projectId,
  closeAgenda,
  fetchSeanceProjet,
}) => {
  const handleClick = () => {
    closeAgenda();
  };
  const { token } = useAuth();
  // const authGoogle = useGoogleCalendar();
  const [seances, setSeances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moduleName, setModuleName] = useState("");
  // filtration par mois
  const [moisFiltre, setMoisFiltre] = useState(null); // Ex: "2024-06"
  const [salles, setSalles] = useState([]);
  const calendarRef = useRef(null); // Reference to the DayPilotCalendar component
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [isCatchup, setIsCatchup] = useState(false);
  const [notification, setNotification] = React.useState({
    message: "",
    type: "",
  });
  const [showNotification, setShowNotification] = React.useState(false);

  const showDemo = (type, message) => {
    setNotification({ type, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-600",
        progressBar: "bg-green-500",
      },
      error: {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-600",
        progressBar: "bg-red-500",
      },
      warning: {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        progressBar: "bg-yellow-500",
      },
      info: {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: Info,
        iconColor: "text-blue-600",
        progressBar: "bg-blue-500",
      },
    };
    return configs[type] || configs.info;
  };

  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;
  {
    showNotification && (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 duration-300">
        <div
          className={`
                relative max-w-md w-full mx-auto
                ${config.bg} ${config.border} border-2
                rounded-xl shadow-lg backdrop-blur-sm
                overflow-hidden
            `}
        >
          {/* Barre de progression */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
            <div
              className={`h-full ${config.progressBar} animate-progress`}
              style={{
                animation: "progress 4s linear forwards",
              }}
            />
          </div>

          {/* Contenu */}
          <div className="p-4 flex items-start space-x-3">
            {/* Icône */}
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              <IconComponent className="w-6 h-6" />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${config.text} leading-5`}>
                {notification.message}
              </p>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={() => setShowNotification(false)}
              className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Animation de pulsation pour les notifications importantes */}
          {(notification.type === "error" ||
            notification.type === "warning") && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className={`absolute inset-0 ${config.border} border-2 rounded-xl animate-ping opacity-20`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  <style jsx>{`
    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .animate-progress {
      animation: progress 4s linear forwards;
    }

    @keyframes slide-in-from-top {
      from {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    .animate-in {
      animation: slide-in-from-top 0.3s ease-out;
    }
  `}</style>;
  useEffect(() => {
    if (!moisFiltre) {
      setStartDate(DayPilot.Date.today());
    } else {
      const year = new Date().getFullYear();
      const dateString = `${year}-${moisFiltre}-01`;
      setStartDate(new DayPilot.Date(dateString));
    }
  }, [moisFiltre]);

  async function getIdNamePaiementStatusEtp(idProjet) {
    try {
      const response = await axios.get(`/cfp/projets/${idProjet}`);

      const data = response.data;

      console.log(data);

      const donnee = {
        idEtp: data.entrepirses,

        nameEtp: data.entreprises,

        paiementEtp: data.project.paiement,

        statut: data.project.project_status,

        imgModule: data.project.module_image,

        forms: [...data.forms],

        apprenants: data.apprenants ? data.apprenants.length : 0,
      };

      //console.log('Liste des donnees FORMS-->', donnee);

      return donnee;
    } catch (error) {
      return null;
    }
  }

  // Memoized callback for updating events (move/resize)
  const handleEventUpdate = useCallback(
    async (idSeance, newStart, newEnd, newResource, idCalendar, idProjet) => {
      const end = newEnd;
      const start = newStart;

      const dateString = start.split("T")[0];
      const startString = start.split("T")[1];
      const endString = end.split("T")[1];

      // Récupérer la différence de temps entre start et end
      const timeStart = Date.parse(start);
      const timeEnd = Date.parse(end);
      const mins = (timeEnd - timeStart) / (1000 * 60);

      // getting the hours.
      const hrs = Math.floor(mins / 60);
      // getting the minutes.
      let min = mins % 60;

      let strHrs = hrs < 2 ? "heure" : "heures";
      // formatting the minutes.
      min = min < 10 ? "0" + min : min;
      let strMin = min < 2 ? "minute" : "minutes";
      // returning them as a string.

      const intervalle = hrs + " " + strHrs + " " + min + " " + strMin;
      //console.log(intervalle);

      const data = {
        idSeance: idSeance,
        dateSeance: dateString,
        heureDebut: startString,
        heureFin: endString,
        intervalle: intervalle,
        id_google_seance: idCalendar,
        startTime: start,
        endTime: end,
      };
      try {
        await axios.patch(`/cfp/seances/${idSeance}`, data);

        setNotification({
          message: "Session modifié avec succès",
          type: "success",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        fetchAllSeances();

        fetchSeanceProjet();

        if (calendarRef.current && calendarRef.current.control) {
          calendarRef.current.control.clearSelection();
        }
      } catch (err) {
        console.warn(
          "Error adding session:",
          err.response?.data || err.message
        );
        alert(
          `Erreur lors de modification de la session: ${
            err.response?.data?.message || err.message
          }`,
          "Erreur",
          { timeOut: 1500 }
        );
      }
    },
    []
  );

  // Memoized callback for fetching all seances
  const fetchAllSeances = useCallback(async () => {
    // Removed dp parameter
    if (!projectId) {
      console.warn("Project ID is not available. Cannot fetch seances.");
      return;
    }

    try {
      const response = await axios.get(`/cfp/seances/all/${projectId}`);

      console.log("data", response);

      const fetchedSeances = response.data.seances || [];

      const formattedEvents = await Promise.all(
        fetchedSeances.map(async (evnt) => {
          const endTime = evnt.end.split("T")[1];
          const startTime = evnt.start.split("T")[1];
          const projectDetails = await getIdNamePaiementStatusEtp(
            evnt.idProjet
          );
          const nameEtps =
            evnt.nameEtps?.map((etp) => etp.name).join(", ") || "non assigné";
          const formateurs =
            evnt.formateurs
              ?.map((formateur) => formateur.form_firstname)
              .join(", ") || "non assigné";

          const HTMLDATA = `
                        <div class="flex items-start gap-2 bg-white p-4 w-full h-full rounded-md">
                            <div class="flex flex-col rounded-md">
                                <div class="flex flex-row flex-wrap gap-2 w-full mb-1">
                                    <div class="inline-flex items-center gap-2">
                                        <div class="flex flex-col">
                                            <p class=" font-semibold text-gray-700">${
                                              evnt.module || "non assigné"
                                            }</p>
                                            <p class="text-sm text-gray-600">Client : <span class="text-sm text-gray-500">${nameEtps}</span></p>
                                            <p class="text-sm text-gray-600">Projet : <span class="text-sm text-gray-500">${
                                              evnt.typeProjet || "non assigné"
                                            }</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col">
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Lieu :</p>
                                        <p class="text-sm text-gray-600">${
                                          evnt.ville || "non assigné"
                                        }</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Salle :</p>
                                        <p class="text-sm text-gray-600">${
                                          evnt.salle || "non assigné"
                                        }</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Financement :</p>
                                        <p class="text-sm v">${
                                          projectDetails?.paiementEtp ||
                                          "non assigné"
                                        }</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Matériel :</p>
                                        <p class="text-sm text-gray-600">1 Ordinateur</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-400">Formateur :</p>
                                        <p class="text-sm text-gray-600">${formateurs}</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Apprenants :</p>
                                        <p class="text-sm text-gray-600">${
                                          evnt.apprCount || "non assigné"
                                        } Apprenant(s)...</p>
                                    </div>
                                    <div class="flex flex-row justify-between items-center flex-wrap gap-x-2">
                                        <p class="text-sm text-gray-600">Heures :</p>
                                        <p class="text-sm text-gray-600">${
                                          startTime.split(":")[0]
                                        }H${startTime.split(":")[1]} à ${
            endTime.split(":")[0]
          }H${endTime.split(":")[1]}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;

          return {
            start: evnt.start,
            end: evnt.end,
            id: evnt.idSeance, // DayPilot usually uses 'id' for event identifier
            idSeance: evnt.idSeance, // Keep your custom id for your logic
            idSalle: evnt.idSalle,
            idModule: evnt.idModule,
            idProjet: evnt.idProjet,
            idCalendar: evnt.idCalendar,
            html: HTMLDATA,
            resource: evnt.resource,
            text: evnt.text, // DayPilot usually uses 'text' for event title
            module: evnt.module,
            salle: evnt.salle,
            ville: evnt.ville,
            typeProjet: evnt.typeProjet,
            prenom_form: evnt.formateurs?.map((f) => ({
              idFormateur: f.idFormateur,
              prenom: f.form_firstname,
            })),
            paiement: projectDetails?.paiementEtp,
            imgModule: projectDetails?.imgModule,
            height: 20,
            backColor: setColorStatutRessource(evnt.statut), // DayPilot uses backColor for event background
          };
        })
      );

      setSeances(formattedEvents);
    } catch (err) {
      console.warn(
        "Error fetching seances:",
        err.response?.data || err.message
      );
      setError("Failed to load sessions.");
    }
  }, [projectId]);

  // Effect for initial setup and data fetching
  useEffect(() => {
    if (!projectId) {
      setError(
        "Project ID is missing. Please ensure projectId is passed as a prop to SessionModifCalendar."
      );
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const moduleResponse = await axios.get(`/cfp/modules/getAllModule`);
        //console.log(moduleResponse);
        if (moduleResponse.data.modules.length > 2) {
          setModuleName(moduleResponse.data.modules[2].name);
        }
        const sallesResponse = await axios.get(`/cfp/salles/list`);

        const fetchedSalles = sallesResponse.data.salles.map((s) => ({
          value: s.id,
          name: s.name,
        }));
        setSalles(fetchedSalles);

        await fetchAllSeances(); // Call fetchAllSeances without dp parameter here
      } catch (err) {
        console.warn(
          "Error fetching initial configuration data:",
          err.response?.data || err.message
        );
        setError(
          "Failed to load initial configuration data (modules, salles)."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [projectId, fetchAllSeances]); // Removed salles from dependencies

  // DayPilot Calendar configuration (as an object to pass to the component)
  const calendarConfig = {
    locale: "fr-fr",
    startDate: startDate, // DayPilot.Date needs to be available
    viewType: "Week",
    showAllDayEvents: true,
    scrollLabelsVisible: true,
    timeRangeSelectingStartEndEnabled: true,
    headerDateFormat: "ddd d MMM yyyy",
    eventDeleteHandling: "Update",
    eventMoveHandling: "Update",
    eventClickHandling: "Disabled",
    eventHoverHandling: "Disabled",
    eventDoubleClickHandling: "Update",
    rowHeaderWidth: 150,
    hourWidth: 60,
    onEventFilter: (args) => {
      if (!moisFiltre) {
        // Pas de filtre mois, afficher tous les événements
        args.visible = true;
        return;
      }

      // args.e.start est un DayPilot.Date
      const eventMonth = (args.e.start.getMonth() + 1)
        .toString()
        .padStart(2, "0");

      args.visible = eventMonth === moisFiltre;
    },
    onBeforeEventRender: (args) => {
      args.data.cssClass = "shadow-2xl rounded-xl";
    },
    onBeforeCellRender: (args) => {
      const cellDate = new DayPilot.Date(args.cell.start.value);

      const isHoliday = HOLIDAYS.some((range) => {
        const start = new DayPilot.Date(range.date);
        const end = new DayPilot.Date(range.date).addDays(1);
        return DayPilot.Util.overlaps(
          start,
          end,
          cellDate,
          cellDate.addDays(1)
        );
      });

      if (isHoliday) {
        args.cell.backColor = "#fff2cc";
        args.cell.disabled = true;
      }

      if (cellDate.getDayOfWeek() === 6 || cellDate.getDayOfWeek() === 0) {
        args.cell.backColor = "#d9ead3";
      }
      if (
        args.cell.start.getHours() === 12 &&
        args.cell.start.getMinutes() >= 0 &&
        args.cell.start.getMinutes() <= 30
      ) {
        args.cell.backColor = "#ccc";
      }
    },

    onTimeRangeSelected: async (args) => {
      const sessionCatchUp = false;
      const dateStart = args.start.value;
      const dateEnd = args.end.value;
      const date = new Date(dateStart).toISOString().split("T")[0];
      const start = dateStart.split("T")[1];
      const end = dateEnd.split("T")[1];
      const intervalle = calculateInterval(dateStart, dateEnd);

      const data = {
        dateSeance: date,
        heureDebut: start,
        heureFin: end,
        idProjet: projectId,
        intervalle: intervalle,
        sessionCatchUp: sessionCatchUp,
      };

      try {
        const data = {
          dateSeance: date,
          heureDebut: start,
          heureFin: end,
          idProjet: projectId,
          intervalle,
          sessionCatchUp: false,
        };

        console.log("Données envoyées :", data);

        const response = await axios.post("/cfp/seances", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        console.log("Session ajoutée :", response.data);

        if (calendarRef.current?.control) {
          calendarRef.current.control.clearSelection();
        }

        fetchAllSeances();
        fetchSeanceProjet();
      } catch (err) {
        console.warn(
          "Erreur ajout session :",
          err.response?.data || err.message
        );
      }
    },

    // onTimeRangeSelected: async (args) => {
    //     const form = [

    //       {
    //         name: "Type",
    //         id: "type",
    //         type: "radio",
    //         options: [
    //           { name: "Normale", id: "normal" },
    //           { name: "Rattrapage", id: "rattrapage" },
    //         ],
    //         default: "normal"
    //       }
    //     ];

    //     const modal = await DayPilot.Modal.form(form, {

    //       type: "normal"
    //     });

    //     if (modal.canceled) return;

    //     const { text, type } = modal.result;

    //     const newEvent = {
    //       start: args.start,
    //       end: args.end,
    //       text: text + (type === "rattrapage" ? " (Rattrapage)" : ""),
    //       type: type,
    //     };

    //     // Ajout dans le calendrier
    //     if (calendarRef.current?.calendar) {
    //       calendarRef.current.calendar.events.add(newEvent);
    //     }

    //     // Optionnel : enregistrer dans ton state global
    //     setEvents((prev) => [...prev, newEvent]);
    //   },

    onEventMoved: async (args) => {
      await handleEventUpdate(
        args.e.data.idSeance,
        args.e.data.start.value,
        args.e.data.end.value,
        args.newResource,
        args.e.data.idCalendar
      );
    },

    onEventResized: async (args) => {
      await handleEventUpdate(
        args.e.data.idSeance,
        args.e.data.start.value,
        args.e.data.end.value,
        args.e.data.resource,
        args.e.data.idCalendar
      );
    },

    onEventDelete: async (args) => {
      const idSeance = args.e.data.idSeance;
      try {
        await axios.delete(`/cfp/seances/${idSeance}/delete`);

        setNotification({
          message: "Session supprimée avec succès",
          type: "success",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        if (calendarRef.current && calendarRef.current.control) {
          calendarRef.current.control.events.remove(args.e);
          calendarRef.current.control.update();
        }
        fetchAllSeances();
        fetchSeanceProjet();
      } catch (err) {
        console.warn(
          "Error deleting session:",
          err.response?.data || err.message
        );
        alert(
          `Erreur lors de la suppression: ${
            err.response?.data?.message || err.message
          }`,
          "Erreur",
          { timeOut: 1500 }
        );
      }
    },
  };
  // filtration par mois
  const applyFilterMois = (mois) => {
    setMoisFiltre(mois);
  };
  const previousWeek = () => {
    const newStartDate = startDate.addDays(-7); // Déplacer la date d'une semaine en arrière
    setStartDate(newStartDate);
  };

  const nextWeek = () => {
    const newStartDate = startDate.addDays(7); // Déplacer la date d'une semaine en avant
    setStartDate(newStartDate);
  };

  // Fonction pour obtenir le nom du mois à partir du numéro
  const getMonthName = (monthNumber) => {
    const months = {
      "01": "Janvier",
      "02": "Février",
      "03": "Mars",
      "04": "Avril",
      "05": "Mai",
      "06": "Juin",
      "07": "Juillet",
      "08": "Août",
      "09": "Septembre",
      10: "Octobre",
      11: "Novembre",
      12: "Décembre",
    };
    return months[monthNumber] || "";
  };

  // Fonction pour obtenir le nom du mois de la semaine actuelle du calendrier
  const getCalendarMonthName = () => {
    if (startDate) {
      const monthNumber = (startDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      return getMonthName(monthNumber);
    }
    return getCurrentMonthName();
  };

  // Fonction de secours pour obtenir le mois en cours
  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString("fr-FR", { month: "long" });
  };

  return (
    <div className="h-full min-h-screen p-2 bg-white project-calendar">
      {error && (
        <div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
          <p className="text-sm text-gray-500">Erreur: {error}</p>
          <button
            className="p-1 text-white bg-purple-600 "
            onClick={() => {
              setLoading(true);
            }}
          >
            Actualiser
          </button>{" "}
        </div>
      )}
      <div class="flex items-center justify-between w-full  p-2   font-sans">
        <div class="flex items-center space-x-3">
          <button
            onClick={() => setStartDate(DayPilot.Date.today())}
            class="px-1 py-1 text-[12px] bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
          >
            Aujourd'hui
          </button>

          <div class="flex items-center  p-1 bg-gray-100 rounded-lg shadow-inner">
            <button
              onClick={previousWeek}
              class="p-1 rounded-md bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-[12px]">Sem&nbsp;préc</span>
              </div>
            </button>

            <div class="relative">
              <select
                onChange={(e) => {
                  applyFilterMois(e.target.value);
                  // The useEffect will handle re-filtering
                }}
                value={moisFiltre}
                class="block appearance-none w-full bg-white border border-gray-300 text-[12px] text-gray-700 py-1 px-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200"
              >
                <option value="">
                  {moisFiltre
                    ? getMonthName(moisFiltre)
                    : getCalendarMonthName()}
                </option>
                <option value="01">Janvier</option>
                <option value="02">Février</option>
                <option value="03">Mars</option>
                <option value="04">Avril</option>
                <option value="05">Mai</option>
                <option value="06">Juin</option>
                <option value="07">Juillet</option>
                <option value="08">Août</option>
                <option value="09">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <button
              onClick={nextWeek}
              class="p-1 rounded-md bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center gap-1">
                <span className="text-[10px]">Sem&nbsp;suiv</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </div>

          <GoogleCalendarManager
            seances={seances}
            fetchAllSeances={fetchAllSeances}
          />
        </div>
      </div>

      <div className="bg-white h-full p-3 rounded-lg h-[700px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/20 backdrop-blur-none rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              </div>
              <div className="text-center">
                <h4 className="mb-1 text-lg font-semibold text-gray-800">
                  Chargement en cours...
                </h4>
                <p className="text-sm text-gray-500">
                  Récupération des données de formation
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Use the DayPilotCalendar React component */}
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
          height="parent"
          events={seances} // Pass events from state
          // onInit is not needed if you set up config object like this
        />
      </div>
    </div>
  );
};

export default SessionModifCalendar;
