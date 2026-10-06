import { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";

import "../../../../css/Style.css";

import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  LoaderCircle,
  Search,
  RotateCcw,
} from "lucide-react";

import { AnimatePresence } from "framer-motion";
import EditDrawer from "../../../../components/Modals/agenda/annuelModal/EditDrawer";
import ShowDrawer from "../../../../components/Modals/agenda/annuelModal/ShowDrawer";
import { useAuth } from "../../../../contexts/AuthContext";
import { useGoogleCalendar } from "../../../../contexts/AuthCalendarProvider";
import { IMAGE_URL } from "../../../../config/env";

const AnnuelCalendar = () => {
  const [resources, setResources] = useState([]);
  const { event_groups, fetchEventsGroups, loading } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [moduleFiltre, setModuleFiltre] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // <-- NOUVEAU : La valeur de la recherche
  const [filterType, setFilterType] = useState("module");
  const [scheduler, setScheduler] = useState(null);
  const auth = useAuth();
  const authGoogle = useGoogleCalendar();
  const dpAnnuaire = useRef(null);
  const navigate = useNavigate();
  const [annee, setAnnee] = useState(new Date().getFullYear());
  // filtration par mois
  const [moisFiltre, setMoisFiltre] = useState(null);
  const [cellWidth, setCellWidth] = useState(70);
  const [route, setRoutes] = useState("");
  const [idProjet, setIdProjet] = useState("");
  // pour afficher une modal session
  const [showDrawer, setShowDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editType, setEditType] = useState(""); // 'sessions'
  const [editId, setEditId] = useState(null);
  const [type, setType] = useState(null);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  // mois selectionner sur le mensuels
  const [monthName, setMonthName] = useState([]);
  // day selectionner sur le mensuel
  const [DaySelect, setDaySelect] = useState("01");
  // les jours qu'on peut voir sur l'agenda
  const [dayVue, setDayVUe] = useState(31);
  const colors = ["#ffff"];
  // Fonction à passer à Sessions
  const editDrawer = (type, id) => {
    setShowDrawer(false); // Ferme Sessions
    setEditType(type);
    setEditId(id);
    setShowEditDrawer(true); // Ouvre le drawer d'édition
  };

  // couleur de modalité
  function setModaliteColor(modalite) {
    let color = "";
    switch (modalite) {
      case "Présentielle":
        return (color = "#00b4d8");
      case "En ligne":
        return (color = "#fca311");
      case "Blended":
        return (color = "#005f73");
    }
    return modalite;
  }
  // color de statut de projet
  function setColorProjet(typeProjet) {
    let color = "";
    if (typeProjet == "Intra") {
      color = "#1565c0";
    } else if (typeProjet == "Inter") {
      color = "#7209b7 ";
    }
    return color;
  }

  // color status
  function setColorStatutRessource(statut) {
    let backColor = "";
    if (statut === "Réservé") {
      backColor = "#33303D"; //Gris :Réservation
    } else if (statut === "Annulé") {
      backColor = "#DE324C"; //Rouge Orangé: Annulé
    } else if (statut === "En préparation") {
      backColor = "#F8E16F"; //(JAUNE) : En préparation
    } else if (statut === "Reporté") {
      backColor = "#2E705A"; //(vert foncé) : Reporté
    } else if (statut === "Planifié") {
      backColor = "#CBABD1"; //(Bleu marine) : Planifié
    } else if (statut === "En cours") {
      backColor = "#369ACC"; //#1E90FF <===(couleur BLEU )
    } else if (statut === "Cloturé") {
      backColor = "#6F1926"; //#828282 <===(couleur gris )
    } else {
      backColor = "#95CF92"; //#32CD32 <===(couleur vert : Terminée)
    }

    return backColor;
  }
  useEffect(() => {
    if (event_groups) {
      const formattedEvents = event_groups.map((obj) => {
        const dpStart = new DayPilot.Date(obj.start);
        const dpEnd = new DayPilot.Date(obj.end);
        const month = dpStart.getMonth() + 1;
        const dayStart = dpStart.getDay();
        const dayEnd = dpEnd.getDay();
        const year = dpStart.getYear();

        const dayFormattedStart = dayStart.toString().padStart(2, "0");
        const dayFormattedEnd = dayEnd.toString().padStart(2, "0");
        const newstart = `${year}-01-${dayFormattedStart}`;
        const newend = `${year}-01-${dayFormattedEnd}`;
        const date = `${dayFormattedEnd}/${month}/${year}`;
        const colorStatus = setColorStatutRessource(obj.statutProjet);

        return {
          start: newstart,
          end: newend,
          startDate: obj.start,
          endDate: obj.end,
          date,
          id: DayPilot.guid(),
          etat: obj.idSeance ? 1 : 2,
          idOpportunity: obj.idOpportunity,
          idCalendar: obj.idCalendar,
          idEtp: obj.idEtp,
          idSeance: obj.idSeance,
          idProjet: obj.idProjet,
          resource: month,
          text: ` REf: ${obj.reference ?? "--"} \n - ${obj.module}`,
          fontColor: "black",
          barColor: obj.barColor,
          barBackColor: obj.barColor,
          backColor: obj.backColor,
          imgModule: obj.imgModule,
          module: obj.module,
          nameEtp: obj.nameEtp,

          nameCfp: obj.nameCfp,
          statut: obj.statutProjet,
          nb_appr: obj.nb_appr,
          height: 125,
          remarque: obj.title,
          ville: obj.ville,
          salle: obj.salle,

          description: obj.description,
          materiels: obj.materiels ? [...obj.materiels] : [],
          codePostal: obj.codePostal,
          reference: obj.reference,
          quartier: obj.quartier,
          idModule: obj.idModule,
          idDossier: obj.idDossier,
          modalite: obj.modalite,
          nb_seances: obj.nb_seances,
          html: `
           <div class="w-full  flex flex-col bg-white items-start text-xs sm:h-full sm:w-full    rounded-xl mt-6 ">
            <span class="px-1 py-1 text-xs    rounded-md">
              ${DayPilot.Util.escapeHtml(obj.module)}
            </span>
            <span class="w-full ml-1 flex flex-col bg-grey-10 items-start italic text-xs rounded-md rounded-md">
              Ref: ${
                obj.reference ? DayPilot.Util.escapeHtml(obj.reference) : "--"
              }
            </span>
            <span class="px-1 py-1 text-xs bg-white text-slate-600 font-semibold rounded-md">
              ${DayPilot.Util.escapeHtml(obj.nameEtp)}
            </span>
            <span class="px-1 py-1 text-xs  text-slate-600 rounded-md" style="color:${colorStatus};"">
              ${DayPilot.Util.escapeHtml(obj.statutProjet)}
            </span>
          </div>
        `,
          barHidden: false,
        };
      });

      // Ajoute les formattedEvents à l'état
      setEvents(formattedEvents);
    }
  }, [event_groups]);

  // affecter les formations et opportunités

  const initialResources = [
    { name: "Janvier", id: 1 },
    { name: "Février", id: 2 },
    { name: "Mars", id: 3 },
    { name: "Avril", id: 4 },
    { name: "Mai", id: 5 },
    { name: "Juin", id: 6 },
    { name: "Juillet", id: 7 },
    { name: "Août", id: 8 },
    { name: "Septembre", id: 9 },
    { name: "Octobre", id: 10 },
    { name: "Novembre", id: 11 },
    { name: "Décembre", id: 12 },
  ];

  useEffect(() => {
    setResources(initialResources);
    fetchEventsGroups();
  }, []);

  const config = {
    locale: "fr-FR",
    startDate: `${annee}-01-${DaySelect}`,
    scale: "Day",
    days: `${dayVue}`,
    cellGroupBy: "Month",
    cellDuration: 720,
    autoRefreshEnabled: true,

    timeHeaders: [{ groupBy: "Day", format: "dd" }],
    treeEnabled: true,
    dynamicLoading: false,
    durationBarVisible: true,
    eventHoverHandling: "Bubble",
    linkBottomMargin: 20,
    groupConcurrentEventsLimit: 2,
    eventHeight: 80,

    cellWidth: cellWidth,

    // utiliser quand le souris est au dessus de l'evenement
    bubble: new DayPilot.Bubble({
      onLoad: (args) => {
        const e = args.source;
        const module = DayPilot.Util.escapeHtml(e.data.module);
        const salle = DayPilot.Util.escapeHtml(e.data.salle);
        const ville = DayPilot.Util.escapeHtml(e.data.ville);
        const quartier = DayPilot.Util.escapeHtml(e.data.quartier);
        const nameEtp = DayPilot.Util.escapeHtml(e.data.nameEtp);
        const materiels = e.data.materiels || [];
        const listeMateriels = materiels
          .map((m) => `<li>${DayPilot.Util.escapeHtml(m.prestation_name)}</li>`)
          .join("");
        const colorStatus = setColorStatutRessource(e.data.statut);
        const statut = DayPilot.Util.escapeHtml(e.data.statut);
        const description = DayPilot.Util.escapeHtml(e.data.description);
        const nb_appr = DayPilot.Util.escapeHtml(e.data.nb_appr);

        const img_module = DayPilot.Util.escapeHtml(e.data.imgModule);
        const start = e.start().toString("dd/MM/yyyy");
        const end = e.end().toString("dd/MM/yyyy");
        const date = DayPilot.Util.escapeHtml(e.data.date);

        const escape = DayPilot.Util.escapeHtml;
        // Formation
        args.html = `
                   
                    <div class="flex items-center gap-2 h-full w-[28em] bg-white p-4">
                  <div class="flex flex-col w-full">
                    <div class="flex flex-row flex-wrap gap-x-2 w-full mb-3">
                      <div class="inline-flex items-start gap-2">
                        <div class="w-16 h-16 rounded-md flex items-center justify-center p-2">
                            <img
                              src="${IMAGE_URL}/img/modules/${img_module}"
                              alt="" class="w-full h-auto object-cover">
                        </div>
                        <div class="flex flex-col">
                          <p class="text-sm font-semibold text-gray-700">${
                            module || "non assigné"
                          }
                          </p>
                          
                      </p>
                          <p class="text-sm text-gray-400">Client : <span
                              class="text-sm text-gray-500"> ${
                                nameEtp || "non assigné"
                              } </span> 
                          </p>
                        </div>              
                 
                    </div>
                    <div class="flex flex-col w-full">
                       <div class="w-[76%] inline-flex items-center justify-center m-2">
                        <div class="px-4 py-1 text-sm text-white rounded-md" style="background-color:${colorStatus};"> ${
          statut !== null ? statut : "--"
        }</div>
                      </div>
                      <div class="inline-flex items-start ">
                        <div class="w-[32%] inline-flex items-center justify-end">
                        <p class="text-sm text-gray-400">Le :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                          <p class="text-base text-gray-500">${
                            date || "non assigné"
                          }</p>
                        </div>
                     
                      </div>
                         <div class="inline-flex items-start gap-x-2">
                            <div class="w-[32%] inline-flex items-center justify-end">
                            <p class="text-sm text-gray-400">De :</p>
                            </div>
                            <div class="w-[66%] inline-flex items-center justify-start">
                              <p class="text-base text-gray-500">${
                                start || "non assigné"
                              } à ${end || "non assigné"}</p>
                            </div>
                        </div>
                      <div class="inline-flex items-start gap-x-2">
                        <div class="w-[32%] inline-flex items-center justify-end">
                        <p class="text-sm text-gray-400">Lieu :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                          <p class="text-base text-grayS-500">${
                            ville || "non assigné"
                          }</p>
                        </div>
                      </div>

                      <div class="inline-flex items-start gap-x-2">
                        <div class="w-[32%] inline-flex items-center justify-end">
                        <p class="text-sm text-gray-400">Salle :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                          <p class="text-base text-gray-500">${
                            salle || "non assigné"
                          }</p>
                        </div>  
                      </div>


                      <div class="inline-flex items-start gap-x-2">
                        <div class="w-[32%] inline-flex items-center justify-end">
                        <p class="text-sm text-gray-400">Quartier :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                          <p class="text-base text-gray-500">${
                            quartier !== null ? quartier : "--"
                          }</p>
                        </div>  
                      </div>
                      
                       <div class="inline-flex items-start gap-x-2">
                        <div class="w-[32%] inline-flex items-center justify-end">
                        <p class="text-base text-gray-400">Details :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                           <ul class="list-disc ml-4 text-gray-800">${
                             description !== null ? description : "--"
                           }</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
      },
    }),

    onBeforeCellRender: (args) => {
      if (
        args.cell.start.getDayOfWeek() === 6 ||
        args.cell.start.getDayOfWeek() === 0
      ) {
        args.cell.backColor = "white";
      }

      const date = args.cell.start.toString("dd");
      args.cell.html = `<span style="color:#bac0ccff">${date}</span>`;
    },

    onEventFilter: (args) => {
      let visible = true;
      const query = searchQuery.toLowerCase().trim();
      // Filtrage par état
      if (args.filter && args.filter.etat) {
        visible = visible && args.e.data.etat === args.filter.etat;
      }

      // Filtrage par critère de recherche (module ou entreprise)
      if (query) {
        let fieldToSearch;

        if (filterType === "module") {
          fieldToSearch = args.e.data.module;
        } else if (filterType === "entreprise") {
          fieldToSearch = args.e.data.nameEtp;
        }

        // Applique le filtre si le champ existe et correspond à la requête
        visible =
          visible &&
          fieldToSearch &&
          fieldToSearch.toLowerCase().includes(query);
      }
      // Filtrage par mois uniquement (ignorer l'année)
      if (args.filter && args.filter.mois) {
        let rawDate = args.e.data.startDate;

        // Correction du format invalide (double "T")
        if (typeof rawDate === "string" && rawDate.split("T").length > 2) {
          const parts = rawDate.split("T");
          rawDate = `${parts[0]}T${parts[1]}`; // ne garder que la première partie "valide"
        }

        const eventStart = new Date(rawDate);
        if (!isNaN(eventStart)) {
          const eventMonth = String(eventStart.getMonth() + 1).padStart(2, "0"); // uniquement le mois
          const filterMonth = args.filter.mois.padStart(2, "0"); // s'assurer du format 'MM'
          visible = visible && eventMonth === filterMonth;
        } else {
          console.warn("Date invalide même après correction :", rawDate);
          visible = false;
        }
      }

      args.visible = visible;
    },

    onRowFilter: (args) => {
      const query = args.filterParam.query;
      if (args.row.name.toUpperCase().indexOf(query.toUpperCase()) === -1) {
        args.visible = false;
      }
    },

    onScroll: async (args) => {
      args.async = true;

      fetchEventsGroups();
    },

    contextMenu: new DayPilot.Menu({
      onShow: (args) => {
        const eventData = args.source.data;
        //console.log(eventData)
        const idCustomer = sessionStorage.getItem("ID_CUSTOMER");
        args.menu.items = [
          {
            //Dynamic...
            text: "Ouvrir ce projet",
            icon: "fa-solid fa-tarp",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              navigate(`/cfp/projet/detail/${idProjet}`);
            },
          },

          {
            text: "Accéder au lieu",
            icon: "fa-solid fa-location-dot",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(
                `/cfp/planreperage-drawer/${idProjet}`,
                idProjet,
                "lieu"
              );
            },
          },

          {
            text: "Accéder au formation",
            icon: "fa-solid fa-puzzle-piece",
            onClick: (args) => {
              const e = args.source;
              const idModule = DayPilot.Util.escapeHtml(e.data.idModule);
              handleShowDrower(
                `/cfp/modules/${idModule}/drawer`,
                null,
                "formation"
              );
            },
          },

          {
            text: "Accéder aux sessions",
            icon: "fa-solid fa-list",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(
                `/cfp/session-drawer/${idProjet}`,
                idProjet,
                "session"
              );
            },
          },

          {
            text: "Accéder au formateur",
            icon: "fa-solid fa-user-graduate",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(null, idProjet, "formateur");
            },
          },

          {
            text: "Accéder aux participants",
            icon: "fa-solid fa-users",
            onClick: (args) => {
              const e = args.source;
              const idEtp = DayPilot.Util.escapeHtml(e.data.idEtp);
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(
                `/cfp/apprenant-drawer/${idProjet}`,
                idProjet,
                "participant"
              );
            },
          },

          {
            text: "Accéder à l'entreprise",
            icon: "fa-solid fa-building",
            onClick: (args) => {
              const e = args.source;
              const idEtp = DayPilot.Util.escapeHtml(e.data.idEtp);
              handleShowDrower(`/cfp/etp-drawer/${idEtp}`, null, "entreprise");
            },
          },

          {
            text: "Accéder au dossier",
            icon: "fa-solid fa-folder",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(
                `/cfp/dossier-drawer/${idProjet}`,
                null,
                "dossier"
              );
            },
          },

          {
            text: "Highlight",
            icon: "fa-solid fa-lightbulb",
            onClick: (args) => {
              const e = args?.source;

              if (!e?.data?.idProjet) {
                console.warn(
                  "Événement cliqué invalide ou idProjet manquant",
                  e
                );
                return;
              }

              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              const listId = [];

              const allProjectEvents = events.filter(
                (ev) => ev.idProjet == idProjet
              );
              const isAlreadySelected = allProjectEvents.every(
                (ev) => ev.selected === true
              ); // ✅ test si tous sont sélectionnés

              allProjectEvents.forEach((ev) => {
                listId.push(ev.idSeance);

                if (isAlreadySelected) {
                  ev.selected = false;
                  ev.backColor = ev.originalBackColor || ""; // remettre couleur d'origine
                } else {
                  // ✅ Appliquer la sélection
                  ev.selected = true;
                  ev.backColor = "rgba(254, 64, 1, 0.5)";
                }

                dpAnnuaire.current.control.events.update(ev);
              });
            },
          },

          {
            text: !eventData.idCalendar
              ? "Ajouter les sessions à Google Calendar"
              : "Enlever les sessions de Google Calendar",
            icon: !eventData.idCalendar
              ? "fa-solid text-sm fa-thumbs-up text-green-500"
              : "fa-solid text-sm fa-thumbs-down text-red-500",
            onClick: async (args) => {
              // <-- Notez le 'async' ici
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              const storage_idAgenda = localStorage.getItem("ID_AGENDA");
              const storedToken = localStorage.getItem("ACCESS_TOKEN");

              const allEvents = events.filter((ev) => ev.idProjet == idProjet);

              const selectedEvents = allEvents.map((evnt) => ({
                idSeance: evnt.idSeance,
                idCalendar: evnt.idCalendar,
                start: `${evnt.startDate}`,
                end: `${evnt.endDate}`,
                module_name: evnt.module,
                imgModule: evnt.imgModule,
                quartier: evnt.quartier,
                salle: evnt.salle,

                ville: evnt.ville,
                nb_appr: evnt.nb_appr,
                nameEtp: evnt.nameEtp,

                nameCfp: evnt.nameCfp,
              }));

              if (selectedEvents.length > 0) {
                selectedEvents.forEach((e) => {
                  if (!e.selected) {
                    e.backColor = "rgba(254, 207, 1,0.5)";
                  }
                });
              }

              // ACTION : SUPPRIMER DE GOOGLE
              if (eventData.idCalendar) {
                if (!storedToken) {
                  authGoogle.handleAuthClick();
                  return;
                }

                try {
                  await authGoogle.executeDeleteListOnGoogle(
                    storage_idAgenda,
                    selectedEvents
                  );
                  for (const evnt of selectedEvents) {
                    evnt.backColor = "rgba(246, 241, 216, 0.5)";
                    evnt.idCalendar = null;

                    await authGoogle.updateIdListCalendarSession(
                      evnt.idSeance,
                      null,
                      storedToken
                    );
                  }
                  fetchEventsGroups();
                } catch (err) {
                  console.error(
                    "Erreur lors de la suppression dans onClick:",
                    err
                  ); // Log l'erreur pour le débogage
                }
              } else {
                if (!storedToken) {
                  authGoogle.handleAuthClick(); // Démarre le flow OAuth
                  return;
                }

                try {
                  for (const evnt of selectedEvents) {
                    evnt.backColor = "rgba(183, 104, 34, 0.5)";
                  }
                  await authGoogle.executeAddListOnGoogle(
                    selectedEvents,
                    storage_idAgenda,
                    storedToken
                  );
                  fetchEventsGroups();
                } catch (err) {
                  console.error("Erreur lors de l'ajout dans onClick:", err); // Log l'erreur pour le débogage
                }
              }
            },
          },
        ];
      },
    }),

    // ajout de petit icone au dessus de l'event
    onBeforeEventRender: (args) => {
      const statutProjet = args.data.statut;
      let durationBarColor = "#ffff";
      // Applique la couleur à la barre de durée de l'événement DayPilot
      args.data.backColor = durationBarColor;
      args.data.areas = [
        {
          top: 1,
          right: 1,
          width: 20,
          height: 20,
          icon: "fas fa-chevron-down",
          style: "cursor: pointer; font-weight: bold;color: purple",
          action: "ContextMenu",
        },
      ];

      args.data.cssClass = " rounded-2xl";
    },
  };

  // filtration par module
  const applyFilterModule = (search) => {
    setSearchQuery(search); // Met à jour l'état de la requête de recherche
    if (scheduler) {
      scheduler.events.filter({ search: search }); // Le filtrage réel se fait dans onEventFilter
    }
  };

  //filtration par mois
  const applyFilterMois = (mois) => {
    setMoisFiltre(mois);
    if (scheduler) {
      scheduler.events.filter({ mois: mois }); // Filtre dynamique
      const allResources = initialResources; // Utiliser la liste complète des ressources
      const filteredResources = mois
        ? allResources.filter((r) => r.id === parseInt(mois, 10))
        : allResources;

      // Mettre à jour les ressources du calendrier
      setResources(filteredResources);
    }
  };

  // function pour afficher le modal session
  const handleShowDrower = (route, idProjet, type) => {
    setRoutes(route);
    setIdProjet(idProjet);
    setShowDrawer(true);
    setType(type);
  };
  const handleChangeAnne = (e) => {
    setAnnee(e.target.value);
  };

  const months = [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  const currentYear = new Date().getFullYear();

  const years = [
    { value: currentYear + 1, label: String(currentYear + 1) },
    { value: currentYear, label: String(currentYear) },
    { value: currentYear - 1, label: String(currentYear - 1) },
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 flex flex-col ">
      {/* En-tête avec titre */}
      <div className="flex items-center space-x-2 p-1 ">
        <div className="flex items-center gap-12 justify-between p-1">
          <div className="flex items-center gap-3">
            <div className="p-1  rounded-xl shadow-lg"></div>
            <div className="flex flex-col">
              <h1 className="text-xl  text-gray-700">Agenda</h1>
              <p className="text-md font-bold text-purple-600">
                {monthName} {annee}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 r-0">
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsYearOpen(!isYearOpen)}
                className="inline-flex justify-center rounded-md  shadow-sm px-2 py-1 bg-white/90 border border-gray-200/50  text-gray-500 text-sm font-medium  hover:bg-gray-50 focus:outline-none"
              >
                {/* Afficher l'année sélectionnée pour plus de clarté */}
                Annuels
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isYearOpen && (
                <div className="origin-top-right z-20 absolute mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {years.map((year) => (
                      <button
                        key={year.value}
                        onClick={() => {
                          setAnnee(year.value);
                          setIsYearOpen(false);
                          setMonthName("");
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          annee === year.value
                            ? "bg-blue-100 text-blue-900 font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {year.label}
                        {annee === year.value && (
                          <svg
                            className="ml-10 h-4 w-4 inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsMonthOpen(!isMonthOpen)}
                className="inline-flex justify-center rounded-md bg-white/90 border border-gray-200/50 shadow-sm px-2 py-1  text-gray-500 text-sm font-medium  hover:bg-gray-50 focus:outline-none"
              >
                Mensuels
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isMonthOpen && (
                <div className="origin-top-right z-20 absolute mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {months.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => {
                          applyFilterMois(month.value);
                          setIsMonthOpen(false);
                          setMonthName(month.label);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          moisFiltre === month.value
                            ? "bg-blue-100 text-blue-900 font-bold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {month.label}
                        {moisFiltre === month.value && (
                          <svg
                            className="ml-2 h-4 w-4 inline-block"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsWeekOpen(!isWeekOpen)}
                className="inline-flex justify-center rounded-md bg-white/90 border border-gray-200/50 shadow-sm px-2 py-1   text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none"
              >
                Semaine
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isWeekOpen && (
                <div className="origin-top-right z-20 absolute mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDaySelect("01");
                        setIsWeekOpen(false);
                        setDayVUe("31");
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        DaySelect === "01"
                          ? "bg-blue-100 text-blue-900 font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      01 - 07
                      {DaySelect === "01" && (
                        <svg
                          className="ml-2 h-4 w-4 inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setDaySelect("08");
                        setIsWeekOpen(false);
                        setDayVUe("24");
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        DaySelect === "08"
                          ? "bg-blue-100 text-blue-900 font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      08 - 15
                      {DaySelect === "08" && (
                        <svg
                          className="ml-2 h-4 w-4 inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setDaySelect("15");
                        setIsWeekOpen(false);
                        setDayVUe("17");
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        DaySelect === "15"
                          ? "bg-blue-100 text-blue-900 font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      15 - 22
                      {DaySelect === "15" && (
                        <svg
                          className="ml-2 h-4 w-4 inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl px-1   transition-all duration-200 hover:shadow-xl">
              <button
                onClick={() => {
                  applyFilterMois("");
                  setMonthName("");
                  setDaySelect("01");
                  setDayVUe("31");
                }}
                className="inline-flex justify-center rounded-md border border-gray-300  px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de contrôles modernisée */}
      <div className=" rounded   p-1 mb-1 transition-all duration-300 hover:shadow-2xl animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Section gauche - Filtres principaux */}
          <div className="relative flex items-center bg-white rounded  border border-gray-100 transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
            {/* NOUVELLE SECTION DE RECHERCHE */}
            <div className="flex items-center space-x-4 ml-8">
              <div className="flex items-center space-x-2 border rounded-md p-1 bg-white shadow-sm">
                {/* Boutons Radio pour le type de filtre */}
                <div className="flex space-x-3 text-sm text-gray-600">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="filterType"
                      value="module"
                      checked={filterType === "module"}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        applyFilterModule(searchQuery);
                      }}
                      className="mr-1 text-purple-600 focus:ring-purple-500"
                    />
                    Module
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="filterType"
                      value="entreprise"
                      checked={filterType === "entreprise"}
                      onChange={(e) => {
                        setFilterType(e.currentTarget.value);
                        applyFilterModule(searchQuery); // Ré-appliquer le filtre actuel avec le nouveau type
                      }}
                      className="mr-1 text-purple-600 focus:ring-purple-500"
                    />
                    Entreprise
                  </label>
                </div>
              </div>

              {/* Champ de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Rechercher par ${filterType}...`}
                  value={searchQuery}
                  onChange={(e) => applyFilterModule(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/90 shadow-sm"
                />
              </div>
            </div>
            {/* FIN NOUVELLE SECTION DE RECHERCHE */}
          </div>

          {/* Section droite - Recherche et contrôles supplémentaires */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Barre de recherche améliorée */}

            <div className="flex flex-wrap items-center gap-4">
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                id="cellwidthClient"
                value={cellWidth}
                onChange={(e) => setCellWidth(Number(e.target.value))}
                style={{ accentColor: "#9333EA" }}
              />
              <span className="inline-flex items-center gap-2" id="label">
                {cellWidth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteneur du calendrier */}
      <div className="relative bg-white rounded-2xl shadow border border-gray-400 overflow-hidden h-full  xl:h-[590px] 2xl:min-h-[1000px]  animate-slide-up">
        {/* Overlay de la zone en haut à gauche */}
        <div className="w-24 h-8 bg-gradient-to-r from-blue-50 to-white absolute top-[1px] left-[1px] z-[1] rounded-tl-2xl"></div>
        {/* DIV FIXE POUR LES NUMÉROS DE JOURS - RESTE VISIBLE AU SCROLL */}
        {/* <div className="absolute  left-24 z-[10] bg-gradient-to-r from-blue-50 to-white  overflow-hidden border-b border-gray-200">
          <div className="flex">
            {Array.from({ length: dayVue }, (_, i) => {
              const dayNumber = (parseInt(DaySelect) + i).toString().padStart(2, '0');
              return (
                <div
                  key={i}
                  className="h-8 flex items-center justify-center border-r border-gray-200 text-xs text-gray-600 font-semibold"
                  style={{
                    minWidth: `${cellWidth}px`,
                    width: `${cellWidth}px`
                  }}
                >
                  {dayNumber}
                </div>
              );
            })}
          </div>
        </div> */}
        {/* Indicateur de chargement amélioré */}
        {loading && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-none flex items-start justify-center z-10 rounded-2xl p-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-6 h-6 mx-auto animate-spin text-purple-500 border-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Calendrier principal */}
        <div style={{ height: "100%", overflowY: "auto" }}>
          <DayPilotScheduler
            {...config}
            height="parent"
            events={events}
            resources={resources}
            controlRef={setScheduler}
            ref={dpAnnuaire}
          />
        </div>
      </div>

      {/* CSS personnalisé pour la scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .weekend-cell {
          opacity: 0.8;
        }
        
        .today-cell {
          border-top: 2px solid #3b82f6 !important;
          border-bottom: 2px solid #3b82f6 !important;
        }
      `}</style>

      {/* Modal pour afficher les détails */}
      <AnimatePresence>
        {/* affiche le modal session */}
        {showDrawer && (
          <ShowDrawer
            setShowDrawer={setShowDrawer}
            route={route}
            idProjet={idProjet}
            editDrawer={editDrawer}
            type={type}
            setEditType={setEditType}
            setEditId={setEditId}
            setShowEditDrawer={setShowEditDrawer}
          />
        )}
        {showEditDrawer && (
          <EditDrawer
            type={editType}
            id={editId}
            setShowEditDrawer={setShowEditDrawer}
            fetchEventsGroups={fetchEventsGroups}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnnuelCalendar;
