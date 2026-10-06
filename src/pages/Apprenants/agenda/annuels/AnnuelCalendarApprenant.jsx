import { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import "../../../../css/Style.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  LoaderCircle,
  Search,
  Calendar,
  RotateCcw,
} from "lucide-react";

import { AnimatePresence } from "framer-motion";
import { IMAGE_URL, PROJET_URL } from "../../../../config/env";

const AnnuelCalendarApprenant = () => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const { eventsD, fetchEvents, loading } = useOutletContext();
  const [moduleFiltre, setModuleFiltre] = useState("");
  const [scheduler, setScheduler] = useState(null);

  const dpAnnuaire = useRef(null);
  const navigate = useNavigate();
  const [annee, setAnnee] = useState(new Date().getFullYear());
  // filtration par mois
  const [moisFiltre, setMoisFiltre] = useState(null);
  // declaration de tavleau pour inserer les séances de formation
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  // mois selectionner sur le mensuels
  const [monthName, setMonthName] = useState([]);
  // day selectionner sur le mensuel
  const [DaySelect, setDaySelect] = useState("01");
  // les jours qu'on peut voir sur l'agenda
  const [dayVue, setDayVUe] = useState(31);
  const [cellWidth, setCellWidth] = useState(70);
  const [route, setRoutes] = useState("");
  const [idProjet, setIdProjet] = useState("");
  // pour afficher une modal session
  const [showDrawer, setShowDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editType, setEditType] = useState(""); // 'sessions'
  const [editId, setEditId] = useState(null);
  const [type, setType] = useState(null);
  const colors = [
    "#06B6D4", // Cyan frais
  ];

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
      color = "#7209b7";
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
  // recupérer toutes les séances de formation

  useEffect(() => {
    if (eventsD) {
      const formattedEvents = eventsD.map((obj) => {
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

        return {
          start: newstart,
          end: newend,
          startDate: obj.start + "T00:00:00",
          endDate: obj.end + "T00:00:00",
          date,
          id: DayPilot.guid(),
          etat: obj.idSeance ? 1 : 2,
          idOpportunity: obj.idOpportunity,
          idCalendar: obj.idCalendar,
          idEtp: obj.idEtp,
          idSeance: obj.idSeance,
          idProjet: obj.idProjet,
          idFormateur: obj.idFormateur,
          resource: month,
          text: ` REf: ${obj.reference ?? "--"} \n - ${obj.module}`,
          fontColor: "black",
          barColor: obj.barColor,
          barBackColor: obj.barColor,
          backColor: obj.backColor,
          imgModule: obj.imgModule,
          module: obj.module,
          nameEtp: obj.nameEtp,
          nameEtps: obj.nameEtps ? [...obj.nameEtps] : [],
          nameCfp: obj.nameCfp,
          status: obj.statut,
          nb_appr: obj.nb_appr,
          height: 125,
          remarque: obj.title,
          typeProjet: obj.typeProjet,
          ville: obj.ville,

          salle: obj.salle,
          paiement: obj.paiement,
          prenom_form: obj.formateurs.map((formateur) => {
            let idForm = formateur.idFormateur;
            let prenom_form = formateur.form_firstname;
            let email = formateur.email;
            return {
              idFormateur: idForm ? idForm : 0,
              prenom: prenom_form ? prenom_form : "",
              email: email ? email : "",
            };
          }),
          materiels: obj.materiels ? [...obj.materiels] : [],
          codePostal: obj.codePostal,
          reference: obj.reference,
          quartier: obj.quartier,
          idModule: obj.idModule,
          idDossier: obj.idDossier,
          modalite: obj.modalite,
          nb_seances: obj.nb_seances,

          html: `
                    <div class="w-full  flex flex-col bg-white items-start text-xs sm:h-full    rounded mt-6 ">
                    <span class="px-1 py-1 text-xs bg-pink-100  rounded-md">
                        ${DayPilot.Util.escapeHtml(obj.module)}
                    </span>
                    <span class="px-1 py-1 text-xs bg-white text-slate-600 rounded-md">
                        ${DayPilot.Util.escapeHtml(obj.nameEtp)}
                    </span>
                    <span class="px-1 py-1 text-xs bg-pink-100 text-slate-600 rounded-md">
                        ${DayPilot.Util.escapeHtml(obj.ville)}
                    </span>
                    
                    </div>
          `,
          barHidden: false,
        };
      });

      // Ajoute les formattedEvents à l'état
      setEvents(formattedEvents);
    }
  }, [eventsD]);

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
    fetchEvents();
  }, []);

  // Configuration object for the DayPilot Scheduler
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
    resources: [
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
    ],
    dynamicLoading: false,
    durationBarVisible: true,
    eventHoverHandling: "Bubble",
    linkBottomMargin: 20,
    groupConcurrentEventsLimit: 2,
    eventHeight: 80,

    cellWidth: 60,

    // utiliser quand le souris est au dessus de l'evenement
    bubble: new DayPilot.Bubble({
      onLoad: (args) => {
        const e = args.source;
        // const {
        //     module, nameEtp, statut, nb_appr, remarque, date
        // } = e.data;
        const module = DayPilot.Util.escapeHtml(e.data.module);
        const salle = DayPilot.Util.escapeHtml(e.data.salle);
        const ville = DayPilot.Util.escapeHtml(e.data.ville);
        const modalite = DayPilot.Util.escapeHtml(e.data.modalite);
        const nameEtp = DayPilot.Util.escapeHtml(e.data.nameEtp);
        const materiels = e.data.materiels || [];
        const listeMateriels = materiels
          .map((m) => `<li>${DayPilot.Util.escapeHtml(m.prestation_name)}</li>`)
          .join("");

        const tabNameEtp = [...e.data.nameEtps];
        const colorStatus = setColorStatutRessource(e.data.statut);

        const statut = DayPilot.Util.escapeHtml(e.data.status);
        const nb_appr = DayPilot.Util.escapeHtml(e.data.nb_appr);
        const typeProjet = DayPilot.Util.escapeHtml(e.data.typeProjet);
        const colors = setColorProjet(typeProjet);
        const colorModalite = setModaliteColor(modalite);

        const img_module = DayPilot.Util.escapeHtml(e.data.imgModule);
        const date = DayPilot.Util.escapeHtml(e.data.date);
        const startTime = e.data.startTime;
        const endTime = e.data.endTime;
        const escape = DayPilot.Util.escapeHtml;

        if (e.data.etat === 1) {
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
                          <p class="text-sm text-gray-400">Client : <span
                              class="text-sm text-gray-500"> ${
                                !nameEtp
                                  ? tabNameEtp.map((etp) => etp.name)
                                  : nameEtp
                              } </span> 
                          </p>
                          <p class="text-sm text-gray-400">Projet : <span
                              <span class="text-base text-white px-2 rounded-md" style="background-color: ${colors}">${typeProjet}</span>
                              <span
                              class="text-base text-white px-2 rounded-md bg-[${colorModalite}] ">${modalite}</span>
                          </p>
                          <div class="w-[76%] inline-flex items-center justify-center m-2">
                            <div class="px-4 py-1 text-sm bg-[${colorStatus}] text-white rounded-md">${statut}</div>
                          </div>
                        </div>              
                    
                    </div>
                    <div class="flex flex-col w-full">
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
                            startTime || "non assigné"
                          } à ${endTime || "non assigné"}</p>
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
                        <p class="text-base text-gray-400">Matériel(s) :</p>
                        </div>
                        <div class="w-[66%] inline-flex items-center justify-start">
                           <ul class="list-disc ml-4 text-gray-800">${listeMateriels}</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;
        } else if (e.data.etat === 2) {
          // Opportunité
          args.html = `
                    <div class="bg-white p-3 rounded-md shadow-md text-sm">
                        <h5 class="font-semibold text-indigo-700">${
                          escape(module) || "Non défini"
                        }</h5>
                        <p class="text-indigo-500">Client: ${
                          escape(nameEtp) || "Non défini"
                        }</p>
                        <p class="text-indigo-500">Statut: ${
                          escape(statut) || "Non défini"
                        }</p>
                        <p class="text-indigo-500">Participants: ${
                          escape(nb_appr) || "Non défini"
                        }</p>
                        <p class="text-indigo-500">Date: ${
                          escape(date) || "Non définie"
                        }</p>
                    </div>`;
        }
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

      // Filtrage par état
      if (args.filter && args.filter.etat) {
        visible = visible && args.e.data.etat === args.filter.etat;
      }

      // Filtrage par module
      if (moduleFiltre) {
        visible =
          visible &&
          args.e.data.module &&
          args.e.data.module.toLowerCase().includes(moduleFiltre.toLowerCase());
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
        // console.log('startDate corrigé:', rawDate);
        // console.log('objet Date:', eventStart);

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

      fetchEvents();
    },

    onTimeRangeSelected: (args) => {
      // Assuming dpAnnuaire is the ref for the scheduler
      dpAnnuaire.current && dpAnnuaire.current.clearSelection();
      dpAnnuaire.current && dpAnnuaire.current.update();
    },

    onTimeRangeDoubleClick: function (args) {
      if (!window.confirm("Etes-vous sur de modifier cette session?")) {
        args.preventDefault();
      }
    },
    contextMenu: new DayPilot.Menu({
      onShow: (args) => {
        const eventData = args.source.data;
        const idCustomer = sessionStorage.getItem("ID_CUSTOMER");
        args.menu.items = [
          {
            //Dynamic...
            text: "Ouvrir ce projet",
            icon: "fa-solid fa-tarp",
            onClick: (args) => {
              const e = args.source;
              //console.log('---->',e);
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              window.location.replace(
                `${PROJET_URL}/${idProjet}`
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

                dpAnnuaire.current.control.events.update(ev); // mettre à jour chaque événement
              });
            },
          },
        ];
      },
    }),
    onEventClick: (args) => {
      const e = args.e;
      scheduler && scheduler.clearSelection();
      scheduler && scheduler.update(e);
    },
    // ajout de petit icone au dessus de l'event
    onBeforeEventRender: (args) => {
      if (args.data.idSeance) {
        // Applique la couleur de fond générée
        const colorIndex = args.data.idSeance % colors.length;
        const uniqueColor = colors[colorIndex];

        // Applique la couleur de fond
        args.data.backColor = uniqueColor;
      }
      args.data.cssClass = " rounded";
    },
  };

  // filtration des l'etat formation ou opportunité
  const applyFilter = (value) => {
    const etatFilter = parseInt(value, 10);
    if (!etatFilter) {
      scheduler.events.filter(null); // Afficher tous les événements si la valeur est vide ou non numérique
      return;
    }
    scheduler.events.filter({ etat: etatFilter });
  };

  // filtration par module
  const applyFilterModule = (module) => {
    setModuleFiltre(module);
    if (scheduler) {
      scheduler.events.filter({ module: module }); // Le filtrage réel se fait dans onEventFilter
    }
  };

  // filtration par mois
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

  const years = [
    { value: 2025, label: "2025" },
    { value: 2024, label: "2024" },
  ];
  return (
    <div className="w-full  min-h-screen p-1">
      {/* En-tête avec titre */}
      <div className="flex items-center space-x-2 p-1 ">
        <div className="flex items-center gap-12 justify-between p-1">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-white" />
            </div>
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
            <Search className="absolute right-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un module..."
              onChange={(ev) => applyFilterModule(ev.currentTarget.value)}
              className="pl-6 pr-2 p-1 rounded-xl border-none focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 w-64"
            />
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
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-400 overflow-hidden h-full xl:h-[590px] 2xl:min-h-[1000px] animate-slide-up">
        {/* Overlay de la zone en haut à gauche */}
        <div className="w-14 h-8 bg-gradient-to-r from-blue-50 to-white absolute top-[1px] left-[1px] z-[1] rounded-tl-2xl"></div>

        {/* Indicateur de chargement amélioré */}
        {loading && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-none flex items-start justify-center z-10 rounded-2xl p-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-6 h-6 mx-auto animate-spin text-purple-500 border-purple-500" />
              </div>
            </div>
          </div>
        )}
        {/* Calendrier principal */}
        <div
          style={{ height: "100%", overflowX: "auto" }}
          className="custom-scrollbar"
        >
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
      <AnimatePresence></AnimatePresence>
    </div>
  );
};

export default AnnuelCalendarApprenant;
