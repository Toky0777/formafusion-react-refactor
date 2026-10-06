import { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import axios from 'axios';
import { LoaderCircle, Search, ChevronLeft, ChevronRight, Users, Filter, Calendar } from 'lucide-react';

import ShowDrawer from '../../../../components/Modals/agenda/annuelModal/ShowDrawer';
import EditDrawer from '../../../../components/Modals/agenda/annuelModal/EditDrawer';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../contexts/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { IMAGE_URL, PROJET_URL } from "../../../../config/env";

const FormateurCalendar = () => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const { eventsD, fetchEvents, formateursD, loading } = useOutletContext();
  const [formateurs, setFormateurs] = useState([]);
  const [moduleFiltre, setModuleFiltre] = useState('');
  const [scheduler, setScheduler] = useState(null);
  const auth = useAuth();
  const [cellWidth, setCellWidth] = useState(60);
  const dpAnnuaire = useRef(null);
  const [moisFiltre, setMoisFiltre] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState(DayPilot.Date.today().firstDayOfMonth());
  const [selectedFormateurId, setSelectedFormateurId] = useState('');
  const [formationsEvent, setFomationsEvents] = useState([]);;
  // variable pour afficher une modal session
  const [route, setRoutes] = useState('');
  const [idProjet, setIdProjet] = useState('');

  const [showDrawer, setShowDrawer] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editType, setEditType] = useState(""); // 'sessions'
  const [editId, setEditId] = useState(null);
  const [type, setType] = useState(null);

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
      case 'Présentielle':
        return color = "#00b4d8";
      case 'En ligne':
        return color = "#fca311";
      case 'Blended':
        return color = "#005f73";
    }
    return modalite;
  }

  // color de statut de projet
  function setColorProjet(typeProjet) {
    let color = "";
    if (typeProjet == 'Intra') {
      color = '#1565c0';
    } else if (typeProjet == 'Inter') {
      color = '#7209b7';
    }
    return color;
  }

  // color status
  function setColorStatutRessource(statut) {
    let backColor = "";
    if (statut === 'Réservé') {
      backColor = "#33303D";
    } else if (statut === 'Annulé') {
      backColor = "#DE324C";
    } else if (statut === 'En préparation') {
      backColor = "#F8E16F";
    } else if (statut === 'Reporté') {
      backColor = "#2E705A";
    } else if (statut === 'Planifié') {
      backColor = "#CBABD1";
    } else if (statut === 'En cours') {
      backColor = "#369ACC";
    } else if (statut === 'Cloturé') {
      backColor = "#6F1926";
    } else {
      backColor = "#95CF92";
    }
    return backColor;
  }
  useEffect(() => {
    if (eventsD) {
      const formEvents = eventsD.map(evnt => {
        return {
          start: evnt.start,
          end: evnt.end,
          id: crypto.randomUUID(),
          idEtp: evnt.idEtp,
          idSeance: evnt.idSeance,
          idSalle: evnt.idSalle,
          idModule: evnt.idModule,
          text: ` REf: ${evnt.reference ?? "--"} \n - ${evnt.module}`,
          resource: 'FM_' + evnt.idFormateur,
          height: 85,
          idProjet: evnt.idProjet,
          idCalendar: evnt.idCalendar,
          idFormateur: 'FM_' + evnt.idFormateur,
          idFormateursansFm: evnt.idFormateur,
          module: evnt.module,
          salle: evnt.salle,
          ville: evnt.ville,
          typeProjet: evnt.typeProjet,
          statut: evnt.statutProjet,
          nameEtp: evnt.nameEtp,
          imgModule: evnt.imgModule,
          quartier: evnt.quartier,
          modalite: evnt.modalite,
          html: `<div class="flex items-start gap-2 bg-pink-100 p-1 w-full h-full mt-2 shadow-sm ">
            <div class="flex items-start flex-col mt-4 shadow-sm">             
                <span class="px-1 py-1 font-medium text-xs bg-white text-slate-600 rounded-md">
                  ${evnt.nameEtp}
                </span>
                <span class="px-1 font-medium py-1 text-xs text-slate-600 rounded-md">
                  ${evnt.module}
                </span>
                <span class="px-1 py-1 font-medium text-xs text-slate-600 rounded-md">
                  ${evnt.quartier ?? '--'},${evnt.ville ?? '--'}(${evnt.codePostal ?? '--'}) 
                </span>
            </div>  
        </div>`,
        };
      });


      // Ajoute les formattedEvents à l'état
      setEvents(formEvents);
    }
  }, [eventsD]);



  useEffect(() => {
    if (formateursD) {

      setFormateurs(formateursD);
      setResources(formateursD);
    }
  }, [formateursD]);

  // Configuration object for the DayPilot Scheduler
  const config = {
    scale: "Day",
    startDate: startDate,
    cellGroupBy: "Month",
    cellDuration: 720,
    autoRefreshEnabled: true,
    timeHeaders: [
      {
        groupBy: "Month",
      },
      {
        groupBy: "Day",
        format: "d",
      }
    ],
    timeRangeSelectedHandling: "Enabled",
    crosshairType: "Full",
    eventMoveHandling: "Update",
    eventResizeHandling: "Update",
    treeEnabled: true,
    resources: resources,
    dynamicLoading: false,
    durationBarVisible: false,
    eventHoverHandling: "Bubble",
    linkBottomMargin: 20,
    groupConcurrentEventsLimit: 2,
    eventHeight: 80,
    days: DayPilot.Date.today().daysInYear(),
    cellWidth: cellWidth,

    // bubble configuration
    bubble: new DayPilot.Bubble({
      onLoad: (args) => {
        const e = args.source;
        const module = DayPilot.Util.escapeHtml(e.data.module);
        const salle = DayPilot.Util.escapeHtml(e.data.salle);
        const ville = DayPilot.Util.escapeHtml(e.data.ville);
        const quartier = DayPilot.Util.escapeHtml(e.data.quartier);
        const modalite = DayPilot.Util.escapeHtml(e.data.modalite);
        const nb_seances = DayPilot.Util.escapeHtml(e.data.nb_seances);
        const nameEtp = DayPilot.Util.escapeHtml(e.data.nameEtp);
        const materiels = e.data.materiels || [];
        const listeMateriels = materiels.map(m => `<li>${DayPilot.Util.escapeHtml(m.prestation_name)}</li>`).join("");

        const colorStatus = setColorStatutRessource(e.data.statut)

        const statut = DayPilot.Util.escapeHtml(e.data.statut);
        const paiement = DayPilot.Util.escapeHtml(e.data.paiement);
        const nb_appr = DayPilot.Util.escapeHtml(e.data.nb_appr);
        const typeProjet = DayPilot.Util.escapeHtml(e.data.typeProjet);
        const colors = setColorProjet(typeProjet);
        const colorModalite = setModaliteColor(modalite);

        const img_module = DayPilot.Util.escapeHtml(e.data.imgModule);
        const start = e.start().toString("dd/MM/yyyy");
        const end = e.end().toString("dd/MM/yyyy");


        const escape = DayPilot.Util.escapeHtml;

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
                    <p class="text-lg font-semibold text-gray-700">${module || "non assigné"}
                    </p>
                    <p class="text-sm text-gray-400">Client : <span
                       class="text-sm text-gray-500"> ${nameEtp || "non assigné"} </span> 
                    </p>
                    <p class="text-sm text-gray-400">Statut : <span
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
                      <p class="text-base text-gray-500">${start || "non assigné"}</p>
                    </div>
                  </div>
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">De :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${start || "non assigné"} à ${end || "non assigné"}</p>
                    </div>
                  </div>
                
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">Lieu :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${ville || "non assigné"}</p>
                    </div>
                  </div>
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">Salle :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${salle || "non assigné"}</p>
                    </div>  
                  </div>
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">Quartier :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${quartier !== null ? quartier : "--"}</p>
                    </div>  
                  </div>
                 
                </div>
              </div>
            </div>
          </div>`;
      },
    }),

    onBeforeCellRender: args => {
      if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
        args.cell.backColor = "white";
      }
    },

    onRowFilter: (args) => {
      const query = args.filterParam.query;
      if (args.row.name.toUpperCase().indexOf(query.toUpperCase()) === -1) {
        args.visible = false;
      }
    },

    onScroll: async args => {
      args.async = true;
      // loadData();
    },

    onTimeRangeSelected: args => {
      dpAnnuaire.current && dpAnnuaire.current.clearSelection();
      dpAnnuaire.current && dpAnnuaire.current.update();
    },

    // onTimeRangeDoubleClick: function (args) {
    //   if (!confirm('Etes-vous sur de modifier cette session?')) {
    //     args.preventDefault();
    //   }
    // },

    contextMenu: new DayPilot.Menu({
      onShow: (args) => {
        const eventData = args.source.data;
        const idCustomer = sessionStorage.getItem('ID_CUSTOMER');
        args.menu.items = [
          {
            //Dynamic...
            text: "Ouvrir ce projet",
            icon: "fa-solid fa-tarp",
            onClick: (args) => {
              const e = args.source;
              //console.log('---->',e);
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              window.open(
                `${PROJET_URL}/${idProjet}`,
                "_blank"
              );
            }
          },

          {
            text: "Accéder au lieu",
            icon: "fa-solid fa-location-dot",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(`/cfp/planreperage-drawer/${idProjet}`, idProjet, "lieu");
            }
          },

          {
            text: "Accéder au formation",
            icon: "fa-solid fa-puzzle-piece",
            onClick: (args) => {
              const e = args.source;
              const idModule = DayPilot.Util.escapeHtml(e.data.idModule);
              handleShowDrower(`/cfp/modules/${idModule}/drawer`, null, 'formation');

            }
          },

          {
            text: "Accéder aux sessions",
            icon: "fa-solid fa-list",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(`/cfp/session-drawer/${idProjet}`, idProjet, "session");
            }
          },

          {
            text: "Accéder au formateur",
            icon: "fa-solid fa-user-graduate",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(null, idProjet, "formateur");
            }
          },

          {
            text: "Accéder aux participants",
            icon: "fa-solid fa-users",
            onClick: (args) => {
              const e = args.source;
              const idEtp = DayPilot.Util.escapeHtml(e.data.idEtp);
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(`/cfp/apprenant-drawer/${idProjet}`, idProjet, "participant");
            }
          },

          {
            text: "Accéder à l'entreprise",
            icon: "fa-solid fa-building",
            onClick: (args) => {
              const e = args.source;
              const idEtp = DayPilot.Util.escapeHtml(e.data.idEtp);
              handleShowDrower(`/cfp/etp-drawer/${idEtp}`, null, "entreprise");
            }
          },

          {
            text: "Accéder au dossier",
            icon: "fa-solid fa-folder",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(`/cfp/dossier-drawer/${idProjet}`, null, "dossier");
            }
          },

          {
            text: 'Highlight',
            icon: "fa-solid fa-lightbulb",
            onClick: (args) => {
              const e = args?.source;

              if (!e?.data?.idProjet) {
                console.warn("Événement cliqué invalide ou idProjet manquant", e);
                return;
              }

              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              const listId = [];

              const allProjectEvents = events.filter(ev => ev.idProjet == idProjet);
              const isAlreadySelected = allProjectEvents.every(ev => ev.selected === true); // ✅ test si tous sont sélectionnés

              allProjectEvents.forEach(ev => {
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
            }


          },


        ]
      }
    }),

    onEventClick: args => {
      const e = args.e;
      scheduler && scheduler.clearSelection();
      scheduler && scheduler.update(e);
    },

    onBeforeEventRender: (args) => {
      args.data.areas = [
        {
          top: 2,
          right: 1,
          width: 20,
          height: 20,
          icon: "fas fa-chevron-down",
          style: "cursor: pointer; font-weight: bold;color: purple",
          action: "ContextMenu",
        },
      ];
      args.data.cssClass = "shadow-2xl rounded-xl";
    },

    // onEventMove: (args) => {
    //   if (!confirm("Voulez-vous vraiment déplacer cette séance?")) {
    //     args.preventDefault();
    //   }
    // },

    onEventMoved: async (args) => {
      args.control.message("Vous avez déplacé un évènement.");
      args.async = true;

      const resource = args.e.data.id;
      const idCustomer = sessionStorage.getItem('ID_CUSTOMER');
      const event = args.e;
      const resourceCode = event.resource();
      const idProjet = event.data.idProjet;
      const start = event.data.start;
      const end = event.data.end;
      const newIdSeance = event.data.idSeance;
      const newIdFormateur = resourceCode.split('_')[1];
      const dateStart = DayPilot.Util.escapeHtml(start);
      const dateEnd = DayPilot.Util.escapeHtml(end);
      const dateSeance = dateStart.split('T')[0];
      const startTime = dateStart.split('T')[1];
      const endTime = dateEnd.split('T')[1];
      const apiUrl = '/cfp/agendas/events_updateForm_agenda';
      const newObjData = {
        "idProjet": idProjet,
        "date": dateSeance,
        "start": startTime,
        "end": endTime,
        "idFormateur": newIdFormateur,
        "idSeance": newIdSeance,
      };
      axios.patch(apiUrl,
        newObjData,
        { headers: { "Content-Type": "application/json" } }
      )
        .then(function (response) {
          // console.log(response);
          alert(response.success, 'Opération effectuée avec succès', {
            timeOut: 1500
          });
          //console.log('new object-->', newObjData);
          args.events = formateurs.loadAllEventsFormateurs();
          args.loaded();
        })

        .catch(function (error) {
          console.warn(error);
        });
    },

    onEventResized: (args) => {
      args.control.message("Vous avez modifié la date d'un évènement. ");
    },
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
    { value: "12", label: "Décembre" }
  ];
  const applyFilterMois = (mois) => {
    setMoisFiltre(mois);

    if (mois === "") {
      // Réinitialiser à aujourd'hui si "Tous les mois" est sélectionné
      setStartDate(DayPilot.Date.today());
      return;
    }

    // Construire une date à partir du mois sélectionné
    const currentYear = new Date().getFullYear();
    const newDate = new DayPilot.Date(`${currentYear}-${mois}-01`);

    setStartDate(newDate);
  };

  const applyFilterparFormateur = (value) => {
    setSelectedFormateurId(value);
  };

  const applyFilterModule = (module) => {
    setModuleFiltre(module);
  };

  const previousWeek = () => {
    const newStartDate = startDate.addDays(-7);
    setStartDate(newStartDate);
  };

  const nextWeek = () => {
    const newStartDate = startDate.addDays(7);
    setStartDate(newStartDate);
  };
  // function pour afficher le modal session
  const handleShowDrower = (route, idProjet, type) => {
    setRoutes(route);
    setIdProjet(idProjet);
    setShowDrawer(true);
    setType(type);
  }
  const filteredEvents = events.filter(event => {
    const matchesModule =
      event.module.toLowerCase().includes(moduleFiltre.toLowerCase());
    const matchesFormateur =
      !selectedFormateurId || event.idFormateur.toLowerCase() === selectedFormateurId.toLowerCase();

    return matchesModule && matchesFormateur;
  });
  return (
    <div className="relative flex flex-col w-full h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* En-tête avec titre */}
      {/* Barre de contrôles modernisée */}
      <div className="p-1 mb-2 transition-all duration-300 border shadow bg-white/80 backdrop-blur-sm rounded-xl border-white/20 hover:shadow-2xl animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-6 p-1">

          {/* Section gauche - Filtres principaux */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 font-bold text-purple-600">
              <Calendar className="w-6 h-6 " /> Formateur
            </div>

          </div>



          {/* Section droite - Navigation et recherche */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Barre de recherche améliorée */}
            <div className="relative flex items-center transition-all duration-200 bg-white border border-gray-100 shadow rounded-xl hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="absolute w-5 h-5 text-gray-400 left-1" />
              <input
                type="text"
                placeholder="Rechercher un module..."
                onChange={(ev) => applyFilterModule(ev.currentTarget.value)}
                className="w-64 pl-6 pr-2 text-gray-800 placeholder-gray-400 bg-transparent border-none rounded focus:outline-none"
              />
            </div>
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
            {/* Navigation temporelle */}
            <Filter className="w-4 h-4 text-purple-600" />
            <div className="flex items-center overflow-hidden bg-white border border-gray-100 shadow rounded-xl">

              <button
                onClick={previousWeek}
                className="px-2 py-1 text-purple-600 transition-all duration-200 border-r border-gray-100 hover:bg-blue-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <select
                id="mois-select"
                onChange={(e) => applyFilterMois(e.target.value)}
                value={moisFiltre || ""}
                className="font-medium text-gray-800 bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="">Tous les mois</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
              <button
                onClick={nextWeek}
                className="px-2 py-1 text-purple-600 transition-all duration-200 border-l border-gray-100 hover:bg-blue-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filtre formateurs */}
            <div className="flex items-center gap-3 px-1 transition-all duration-200 bg-white border border-gray-100 shadow rounded-xl py-1/2 hover:shadow-xl">
              <Users className="w-5 h-5 text-green-600" />
              <label htmlFor="formateur-select" className="text-sm font-semibold text-gray-700">
                Formateur :
              </label>
              <select
                id="formateur-select"
                onChange={(ev) => applyFilterparFormateur(ev.currentTarget.value)}
                value={selectedFormateurId}
                className="bg-transparent border-none focus:outline-none font-medium text-gray-800 cursor-pointer min-w-[140px]"
              >
                <option value="">Tous</option>
                {formateurs.length > 0 &&
                  formateurs[0].children.map((formateur) => (
                    <option key={formateur.id} value={formateur.id}>
                      {formateur.name}
                    </option>
                  ))}

              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Conteneur du calendrier */}
      <div className="relative bg-white rounded-2xl shadow border border-gray-400 overflow-hidden h-full xxl:h-[600px] animate-slide-up">

        {/* Overlay de la zone en haut à gauche */}
        <div className="w-14 h-8 bg-gradient-to-r from-blue-50 to-white absolute top-[1px] left-[1px] z-[1] rounded-tl-2xl"></div>

        {/* Indicateur de chargement amélioré */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-start justify-center p-20 bg-white/20 backdrop-blur-none rounded-2xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-6 h-6 mx-auto text-purple-500 border-purple-500 animate-spin" />

              </div>
              <div className="text-center">
                <h4 className="mb-1 text-lg font-semibold text-gray-800">
                  Veuillez patientez...
                </h4>
                <p className="text-sm text-gray-500">Récupération des données de formation en cours</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendrier principal */}
        <div style={{ height: "100%", overflowY: "auto" }} className="border border-gray-100 custom-scrollbar">
          <DayPilotScheduler
            {...config}
            height="parent"
            events={filteredEvents}
            resources={resources}
            controlRef={setScheduler}
            ref={dpAnnuaire}
          />
        </div>
      </div>
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
          />
        )}
      </AnimatePresence>

      {/* CSS personnalisé pour la scrollbar */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}

export default FormateurCalendar;
