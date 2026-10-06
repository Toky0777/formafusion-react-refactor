import { useEffect, useState, useRef } from "react";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";
import axios from "axios";

import { LoaderCircle } from 'lucide-react';
import { ChevronLeft, ChevronRight, Search, Users, Calendar } from 'lucide-react';
import swal from 'sweetalert';
import { AnimatePresence } from 'framer-motion';
import EditDrawer from "../../../../components/Modals/agenda/annuelModal/EditDrawer";
import ShowDrawer from "../../../../components/Modals/agenda/annuelModal/ShowDrawer";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../../../contexts/AuthContext";
import { useGoogleCalendar } from "../../../../contexts/AuthCalendarProvider";
import { useOutletContext } from "react-router-dom";
import { API_URL, IMAGE_URL, PROJET_URL } from "../../../../config/env";
const SemaineNewCalendar = () => {
  const auth = useAuth();
  const authGoogle = useGoogleCalendar();
  const { eventSem, fetchEventsSemaine, formateursD, loading } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [moduleFiltre, setModuleFiltre] = useState('');
  const [moisFiltre, setMoisFiltre] = useState(null);
  const [selectedFormateurId, setSelectedFormateurId] = useState('')
  const calendarRef = useRef(null);
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

  // Helper functions for colors (ensure these are accessible or defined within the component)
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

  const setColorProjet = (typeProjet) => {
    if (typeProjet === 'Intra') {
      return '#1565c0';
    } else if (typeProjet === 'Inter') {
      return '#7209b7';
    }
    return ''; // Default color
  };

  const setModaliteColor = (modalite) => {

    if (modalite === 'Présentiel') {
      return '#008000'; // Green
    } else if (modalite === 'Distanciel') {
      return '#FFA500'; // Orange
    }
    return '#808080'; // Gray default
  };
  useEffect(() => {
    if (eventSem) {
      const formEvents = eventSem.map((evnt) => {
        const nameEtp = evnt.nameEtp;
        const idFormateur = evnt.idFormateur;
        const HTMLDATA = `
          <div class="flex flex-col items-start gap-2 bg-white rounded-md p-4 w-full h-auto sm:h-full shadow-xl rounded-xl">
            <div class="flex flex-col w-full">
              <div class="flex flex-col flex-wrap gap-2 w-full mb-3">
                <div class="flex flex-col items-start justify-start gap-2 w-full sm:w-auto">
                    <p class="text-sm font-bold text-gray-700">
                      ${evnt.module || 'non assigné'}
                    </p>
                  <div class="flex flex-col">
                    <p class="text-sm text-gray-400">
                      Clients :
                      <span class="text-sm text-gray-500 text-[#369ACC]">
                       ${nameEtp || 'non assigné'}
                      </span>
                    </p>
                    <p class="text-sm text-gray-400">
                      Projet :
                      <span class="text-sm text-white rounded p-1" style="background-color:${setColorProjet(evnt.typeProjet)};">${evnt.typeProjet || 'non assigné'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2 bg-white">
                ${[
            { label: 'Lieu', value: evnt.ville },
            { label: 'Salle', value: evnt.salle },
          ]
            .map(item => `
                    <div class="flex items-start gap-1">
                      <p class="text-sm text-gray-400">${item.label} :</p>
                      <p class="text-sm text-gray-500">${item.value || 'non assigné'}</p>
                    </div>
                  `)
            .join('')}
              </div>
            </div>
          </div>
        `;

        return {
          idSeance: evnt.idSeance,
          start: evnt.start,
          end: evnt.end,
          html: HTMLDATA,
          idProjet: evnt.idProjet,
          module: evnt.module,
          imgModule: evnt.imgModule,
          salle: evnt.salle,
          ville: evnt.ville,
          quartier: evnt.quartier,
          prenom_form: evnt.formateurs,
          nameEtp: evnt.nameEtp,
          idFormateur: idFormateur,
          nameEtps: evnt.nameEtps,
          modalite: evnt.modalite,
          materiels: evnt.materiels,
          statut: evnt.statutProjet,
          paiement: evnt.paiementEtp,
          nb_appr: evnt.apprenants,
          typeProjet: evnt.typeProjet,
          idCalendar: evnt.idCalendar,
          idModule: evnt.idModule,
          idEtp: evnt.idEtp,
        };
      });

      // Ajoute les formattedEvents à l'état
      setEvents(formEvents);
    }
  }, [eventSem]);



  useEffect(() => {
    if (formateursD) {
      setFormateurs(formateursD);
    }
  }, [formateursD]);

  const previousWeek = () => {
    const newStartDate = startDate.addDays(-7);
    setStartDate(newStartDate);
  };

  const nextWeek = () => {
    const newStartDate = startDate.addDays(7);
    setStartDate(newStartDate);
  };

  const config = {
    viewType: "Week",
    startDate: startDate,
    headerDateFormat: "ddd d MMM yyyy",
    businessBeginsHour: 7,
    durationBarVisible: true,
    locale: "fr-fr",
    bubble: new DayPilot.Bubble({
      onLoad: (args) => {
        const e = args.source;
        const module = DayPilot.Util.escapeHtml(e.data.module);
        const salle = DayPilot.Util.escapeHtml(e.data.salle);
        const ville = DayPilot.Util.escapeHtml(e.data.ville);
        const tabForm = e.data.prenom_form || []; // Ensure it's an array
        const nameEtp = DayPilot.Util.escapeHtml(e.data.nameEtp);
        const modalite = DayPilot.Util.escapeHtml(e.data.modalite);
        const materiels = e.data.materiels || []; // Ensure it's an array
        const tabNameEtp = e.data.nameEtps || []; // Ensure it's an array
        const statut = DayPilot.Util.escapeHtml(e.data.statut);
        const paiement = DayPilot.Util.escapeHtml(e.data.paiement);
        const nb_appr = DayPilot.Util.escapeHtml(e.data.nb_appr);
        const typeProjet = DayPilot.Util.escapeHtml(e.data.typeProjet);
        const colors = setColorProjet(typeProjet);
        const colorModalite = setModaliteColor(modalite);
        const img_module = DayPilot.Util.escapeHtml(e.data.imgModule);
        const start = e.start().toString("dd/MM/yyyy");
        const endTime = e.end().toString("h:mm tt");
        const startTime = e.start().toString("h:mm tt");
        const quartier = DayPilot.Util.escapeHtml(e.data.quartier);

        // Correctly call setColorStatutRessource, it's a function within the component scope
        const colorStatus = setColorStatutRessource(e.data.statut);

        const htd = ` <div class="flex items-center gap-2 h-full w-[28em] bg-white p-4">
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
                            class="text-sm text-gray-500"> ${!nameEtp ? tabNameEtp.map(etp => etp.name).join(', ') : nameEtp} </span>
                      </p>

                      <p class="text-sm text-gray-400">Projet : <span
                            
                            <span
                            class="text-base text-white px-2 rounded-md" style="background-color:${colorModalite};">${modalite}</span>
                      </p>

                      <div class="w-[76%] inline-flex items-center justify-center m-2">
                        <div class="px-4 py-1 text-sm text-white rounded-md" style="background-color:${colorStatus};">${statut}</div>
                      </div>

                    </div>
                  </div>
                <div class="flex flex-col w-full">
                  <div class="inline-flex items-start ">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">Le :</p>
                    </div>

                      <div class="w-[66%] inline-flex items-center justify-start">
                        <p class="text-base text-gray-500">${start}</p>
                      </div>

                  </div>
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">De :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${startTime} à ${endTime}</p>
                    </div>
                  </div>
                  
                  <div class="inline-flex items-start gap-x-2">
                    <div class="w-[32%] inline-flex items-center justify-end">
                    <p class="text-sm text-gray-400">Lieu :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-grayS-500">${ville || "non assigné"}</p>
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
            </div>`;
        args.html = htd;
      },
    }),


    contextMenu: new DayPilot.Menu({
      onShow: (args) => {
        const eventData = args.source.data;
        // console.log('eventDataDETAILS==>', eventData);
        args.menu.items = [
          {
            //Dynamic...
            text: "Ouvrir ce projet",
            icon: "fa-solid fa-tarp",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              window.open(
                `${PROJET_URL}/${idProjet}`,
                "_blank" // ouvre dans un nouvel onglet
              );
            },
          },
          {
            text: "Cacher",
            icon: "fa-solid fa-eye-slash",
            onClick: (args) => {
              // dpDetail.message("L'Evenement est caché: ");
              // dpDetail.update();
              // dpDetail.events.remove(args.source);
            },
          },
          {
            text: "Valider ce projet",
            icon: "fa-solid fa-folder",
            onClick: (args) => {

              confirmProject(args);
            },
          },
          {

            text: "Supprimer cette session",
            icon: "fa-solid fa-trash-can",
            onClick: (args) => {
              deleteEvent(args);
            },
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
            icon: "fa-sharp fa-solid fa-folders",
            onClick: (args) => {
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              handleShowDrower(`/cfp/dossier-drawer/${idProjet}`, null, "dossier");


            }
          },
          {
            text: eventData.idCalendar ? "Formation liée à GOOGLE" : "Formation non liée à GOOGLE",
            //icon: "fa-solid text-sm fa-thumbs-up text-green-500",
          },
          {
            text: !eventData.idCalendar
              ? "Ajouter les sessions à Google Calendar"
              : "Enlever les sessions de Google Calendar",
            icon: !eventData.idCalendar
              ? "fa-solid text-sm fa-thumbs-up text-green-500"
              : "fa-solid text-sm fa-thumbs-down text-red-500",
            onClick: async (args) => { // <-- Notez le 'async' ici
              const e = args.source;
              const idProjet = DayPilot.Util.escapeHtml(e.data.idProjet);
              const storage_idAgenda = localStorage.getItem("ID_AGENDA");
              const storedToken = localStorage.getItem("token");

              const allEvents = events.filter((ev) => ev.idProjet == idProjet);

              const selectedEvents = allEvents.map((evnt) => ({
                idSeance: evnt.idSeance,
                idCalendar: evnt.idCalendar,
                start: `${evnt.start}`,
                end: `${evnt.end}`,
                formateurs: [...evnt.prenom_form],
                module_name: evnt.module,
                imgModule: evnt.imgModule,
                quartier: evnt.quartier,
                salle: evnt.salle,
                typeProjet: evnt.typeProjet,
                ville: evnt.ville,
                nb_appr: evnt.nb_appr,
                nameEtp: evnt.nameEtp,
                nameEtps: evnt.nameEtps,
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

                  await authGoogle.executeDeleteListOnGoogle(storage_idAgenda, selectedEvents);
                  for (const evnt of selectedEvents) {
                    evnt.backColor = "rgba(246, 241, 216, 0.5)";
                    evnt.idCalendar = null;

                    await authGoogle.updateIdListCalendarSession(evnt.idSeance, null, storedToken);
                  }
                  fetchEventsSemaine();
                } catch (err) {
                  console.warn("Erreur lors de la suppression dans onClick:", err); // Log l'erreur pour le débogage
                  // dpAnnuaire.message("Erreur lors de la suppression des événements", {
                  //   cssClass: "shadow-2xl rounded-md text-red-500",
                  // });

                }
              }
              // ACTION : AJOUTER À GOOGLE
              else {
                if (!storedToken) {
                  authGoogle.handleAuthClick(); // Démarre le flow OAuth
                  return;
                }

                try {
                  // ✨ AJOUT DU TRY...CATCH ICI
                  for (const evnt of selectedEvents) {
                    evnt.backColor = "rgba(183, 104, 34, 0.5)";
                  }
                  await authGoogle.executeAddListOnGoogle(selectedEvents, storage_idAgenda, storedToken);
                  fetchEventsSemaine();
                } catch (err) {
                  console.warn("Erreur lors de l'ajout dans onClick:", err); // Log l'erreur pour le débogage

                }
              }
            },
          }
        ]
      }
    }),
    onBeforeCellRender: (args) => {
      const now = new DayPilot.Date().getTime();
      if (
        args.cell.start.getTime() <= now &&
        now < args.cell.end.getTime()
      ) {
        args.cell.backColor = "#ffb3b3";
      }
    },

    onBeforeEventRender: (args) => {
      args.data.cssClass = "shadow-2xl rounded-xl bg-white";
      if (args.data.statut) {
        args.data.barColor = setColorStatutRessource(args.data.statut);
      }
      args.data.areas = [
        {
          right: 5,
          top: 5,
          width: 16,
          height: 16,
          icon: "fas fa-chevron-down",
          cssClass: "event-action",
          action: "ContextMenu",
        },
      ];
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

  // filtration par formateur
  const applyFilterparFormateur = (value) => {
    setSelectedFormateurId(value);
    // console.log(selectedFormateurId);
  };
  // filtration par module
  const applyFilterModule = (module) => {
    setModuleFiltre(module);
  };
  // filtration des évenements par mois
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

  useEffect(() => {
    if (moisFiltre && calendarRef?.current?.control?.events?.filter) {
      calendarRef.current.control.events.filter({ mois: moisFiltre });
    }
  }, [moisFiltre]);
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
    const idFormateur = 'FM_' + event.idFormateur;
    const matchesFormateur =
      !selectedFormateurId || idFormateur.toLowerCase() === selectedFormateurId.toLowerCase();

    return matchesModule && matchesFormateur;
  });
  // function pour confirmer le  projet
  const confirmProject = async (args) => {
    const e = args.source;
    const idProjet = e.data.idProjet;

    try {

      await axios.patch(
        `${API_URL}/cfp/projets/${idProjet}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      showAlert("Projet validé avec succès", 'success');
      fetchEventsSemaine();
    } catch (err) {
      console.warn('Error validation projet:', err);

      showAlert(`Erreur lors de validation du projet,veuillez réessayer s'il vous plait`, 'error');
    }

  }
  // function pour supprimer une session de projet
  const deleteEvent = async (args) => {
    const e = args.source;
    const idSeance = e.data.idSeance;
    const isConfirm = await swal({
      title: 'Voulez-vous vraiment supprimer cet session?',
      text: "Vous ne pouvez plus le récupérer",
      icon: 'warning',
      buttons: ['Annuler', 'Oui, supprimer le '],
      dangerMode: true,
    });
    if (!isConfirm) {
      args.preventDefault();
      return;
    }
    try {
      await axios.delete(`${API_URL}/cfp/seances/${idSeance}/delete`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      showAlert("Session supprimée avec succès", 'success');
      if (calendarRef.current && calendarRef.current.control) {
        calendarRef.current.control.events.remove(e);
        calendarRef.current.control.update();
      }
      fetchEventsSemaine();
    } catch (error) {
      console.log(error)
      showAlert(`Erreur lors de la suppression,veuillez réessayer s'il vous plait`, 'error');
    }

  }

  const showAlert = (message, type = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.transition = 'opacity 0.3s ease-in-out';
    alertDiv.style.opacity = 0;
    alertDiv.style.color = 'white';

    switch (type) {
      case 'success':
        alertDiv.style.backgroundColor = '#28a745';
        break;
      case 'error':
        alertDiv.style.backgroundColor = '#dc3545';
        break;
      case 'info':
        alertDiv.style.backgroundColor = '#007bff';
        break;
      default:
        alertDiv.style.backgroundColor = '#6c757d';
    }

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => (alertDiv.style.opacity = 1), 100);
    setTimeout(() => {
      alertDiv.style.opacity = 0;
      setTimeout(() => document.body.removeChild(alertDiv), 300);
    }, 3000);
  };
  console.log(events);
  return (
    <div className="relative flex flex-col w-full h-full">
      <Toaster position="bottom-left" reverseOrder={false} toastOptions={{
        style: { background: "#fff", color: "#363636" },
        duration: 5000,
      }} />

      {/* Barre de contrôles modernisée */}
      <div className="p-2 mb-1 transition-all duration-300 border shadow bg-white/80 backdrop-blur-sm rounded-xl border-white/20 hover:shadow-2xl animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Section gauche - Navigation et recherche */}
          <div className="flex flex-wrap items-center gap-2 font-bold text-purple-600">
            <Calendar className="w-6 h-6 " /> Semaine
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
            {/* Filtre formateurs */}
            <div className="flex items-center gap-3 px-1 transition-all duration-200 bg-white border border-gray-100 shadow rounded-xl hover:shadow-xl">
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
            <button
              onClick={() => setStartDate(DayPilot.Date.today())}
              className="px-2 overflow-hidden text-purple-600 bg-white border border-gray-100 shadow hover:bg-blue-400 hover:text-white rounded-xl"
            >
              Aujourd'hui
            </button>
            <div className="flex items-center overflow-hidden bg-white border border-gray-100 shadow rounded-xl">
              <button
                onClick={previousWeek}
                className="px-2 py-1 text-purple-600 transition-all duration-200 border-r border-gray-100 hover:bg-blue-50"
              >
                <div className="flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Semaine préc</span>
                </div>
              </button>
              <select
                id="mois-select"
                onChange={(e) => applyFilterMois(e.target.value)}
                value={moisFiltre || ""}
                className="font-medium text-gray-800 bg-transparent border cursor-pointer focus:outline-none"
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
                <div className="flex items-center gap-1">
                  <span className="text-sm">Semaine suiv</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

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
          <div className="absolute inset-0 z-10 flex items-start justify-center p-20 bg-white/20 backdrop-blur-none rounded-2x">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <LoaderCircle className="w-6 h-6 mx-auto text-purple-500 border-purple-500 animate-spin" />
              </div>
              <div className="text-center">
                <h4 className="mb-1 text-lg font-semibold text-gray-800">
                  Veuillez patientez...
                </h4>
                <p className="text-sm text-gray-500">Chargement des données  en cours</p>
              </div>
            </div>
          </div>
        )}

        {/* Calendrier principal */}
        <div style={{ height: "100%", overflowY: "auto" }} className="border border-gray-100 custom-scrollbar">

          <DayPilotCalendar
            {...config}
            height="parent"
            ref={calendarRef}
            events={filteredEvents}
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
};
export default SemaineNewCalendar;