import { useEffect, useState, useRef } from "react";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";

import { LoaderCircle } from 'lucide-react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

import { Toaster } from "react-hot-toast";

import { useOutletContext } from "react-router-dom";
import { IMAGE_URL, PROJET_URL } from "../../../../config/env";

const SemaineCalendarFormateur = () => {
    const token = localStorage.getItem("token");
    const [events, setEvents] = useState([]);
    const { eventsD, fetchEvents, loading } = useOutletContext();
    const [startDate, setStartDate] = useState(DayPilot.Date.today());
    const [moduleFiltre, setModuleFiltre] = useState('');
    const [moisFiltre, setMoisFiltre] = useState(null);
    const [selectedFormateurId, setSelectedFormateurId] = useState('')
    console.log(eventsD)
    const calendarRef = useRef(null);
    const [route, setRoutes] = useState('');
    const [idProjet, setIdProjet] = useState('');

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
        if (eventsD) {
            const formEvents = eventsD.map((evnt) => {
                const nameEtp = evnt.nameEtp;
                const idFormateur = evnt.formateurs && evnt.formateurs.length > 0
                    ? evnt.formateurs[0].idFormateur
                    : null;
                const HTMLDATA = `
          <div class="flex flex-col items-start gap-2 bg-purple-600 rounded-md p-4 w-full h-auto sm:h-full  rounded-xl">
            <div class="flex flex-col w-full">
              <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full mb-3">
                <div class="flex flex-col items-start gap-2 w-full sm:w-auto">
                    <p class="text-sm font-bold text-white">
                      ${evnt.module || 'non assigné'}
                    </p>
                  <div class="flex items-start">
                      <span class="text-left text-sm px-1 py-1 text-slate-600  text-white rounded">
                        ${nameEtp}
                      </span>
                  
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2 ">
                ${[
                        { label: 'Lieu', value: evnt.ville },
                        { label: 'Salle', value: evnt.salle_name },
                    ]
                        .map(item => `
                    <div class="flex flex-col sm:flex-row sm:items-center gap-1">
                      <p class="text-sm text-white">${item.label} :</p>
                      <p class="text-sm text-white">${item.value || 'non assigné'}</p>
                    </div>
                  `)
                        .join('')}
              </div>
            </div>
          </div>
        `;

                return {
                    id: evnt.idSeance,
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
                    statut: evnt.statut,
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
    }, [eventsD]);

    useEffect(() => {
        fetchEvents();

    }, [fetchEvents]);
    // recuperation des formateurs



    ;

    const previousWeek = () => {
        setStartDate(prevStartDate => prevStartDate.addDays(-7));
    };

    const nextWeek = () => {
        setStartDate(prevStartDate => prevStartDate.addDays(7));
    };

    const config = {
        viewType: "Week",
        startDate: startDate,
        businessBeginsHour: 7,
        headerDateFormat: " d MMM yyyy",
        durationBarVisible: true,
        locale: "fr-fr",
        bubble: new DayPilot.Bubble({
            onLoad: (args) => {
                const e = args.source;
                const module = DayPilot.Util.escapeHtml(e.data.module);
                const salle = DayPilot.Util.escapeHtml(e.data.salle);
                const ville = DayPilot.Util.escapeHtml(e.data.ville);
                const nameEtp = DayPilot.Util.escapeHtml(e.data.nameEtp);
                const modalite = DayPilot.Util.escapeHtml(e.data.modalite);
                const materiels = e.data.materiels || []; // Ensure it's an array
                const tabNameEtp = e.data.nameEtps || []; // Ensure it's an array
                const statut = DayPilot.Util.escapeHtml(e.data.statut);
                const typeProjet = DayPilot.Util.escapeHtml(e.data.typeProjet);
                const colors = setColorProjet(typeProjet);
                const colorModalite = setModaliteColor(modalite);
                const img_module = DayPilot.Util.escapeHtml(e.data.imgModule);
                const start = e.start().toString("dd/MM/yyyy");
                const endTime = e.end().toString("h:mm tt");
                const startTime = e.start().toString("h:mm tt");


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
                            class="text-base text-white px-2 rounded-md" style="background-color:${colors};">${typeProjet}</span>
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
                     <p class="text-base text-gray-400">Matériel(s) :</p>
                    </div>
                    <div class="w-[66%] inline-flex items-center justify-start">
                      <p class="text-base text-gray-500">${materiels.map(m => m.name).join(', ') || 'non assigné'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
                args.html = htd;
            },
        }),

        onEventFilter: (args) => {
            let visible = true;

            if (moduleFiltre) {
                visible = visible && (args.e.data.module && args.e.data.module.toLowerCase().includes(moduleFiltre.toLowerCase()));
            }
            if (selectedFormateurId) {
                const idFormateur = args.e.data.idFormateur;

                if (typeof idFormateur === 'string') {
                    visible = visible && idFormateur.toLowerCase() === selectedFormateurId.toLowerCase();
                } else if (typeof idFormateur === 'number') {
                    visible = visible && idFormateur.toString() === selectedFormateurId;
                } else {
                    visible = false; // Si ce n'est ni string ni number, on filtre
                }
            }


            if (args.filter && args.filter.mois) {
                let rawDate = args.e.data.start || args.e.data.startDate;

                if (!rawDate) {
                    console.warn("Aucune date trouvée pour l'événement :", args.e.data);
                    args.visible = false;
                    return;
                }

                // Correction du format invalide (double "T")
                if (typeof rawDate === 'string' && rawDate.split('T').length > 2) {
                    const parts = rawDate.split('T');
                    rawDate = `${parts[0]}T${parts[1]}`;
                }

                const eventStart = new Date(rawDate);
                if (!isNaN(eventStart)) {
                    const eventMonth = String(eventStart.getMonth() + 1).padStart(2, '0');
                    const filterMonth = args.filter.mois.padStart(2, '0');
                    visible = visible && (eventMonth === filterMonth);
                } else {
                    console.warn("Date invalide même après correction :", rawDate);
                    visible = false;
                }
            }

            args.visible = visible;
        },


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
    return (
        <div className="w-full  min-h-screen ">
            <Toaster position="bottom-left" reverseOrder={false} toastOptions={{
                style: { background: "#fff", color: "#363636" },
                duration: 5000,
            }} />


            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-white/20 p-1 mb-1 transition-all duration-300 hover:shadow-2xl animate-slide-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">


                    <div className="flex items-center gap-2 text-purple-600 font-bold">
                        <Calendar className="h-6 w-6" />
                        <span className="text-base md:text-lg">Semaine</span>
                    </div>


                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">


                        <button
                            onClick={() => setStartDate(DayPilot.Date.today())}
                            className="text-purple-600 px-1 hover:bg-blue-400 hover:text-white bg-white rounded-xl shadow border border-gray-100 w-full sm:w-auto"
                        >
                            Aujourd'hui
                        </button>


                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-xl shadow border border-gray-100 w-full sm:w-auto">


                            <button
                                onClick={previousWeek}
                                className="px-1 text-purple-600 hover:bg-blue-50 transition duration-200 sm:border-r border-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="text-sm">Semaine précédente</span>
                                </div>
                            </button>


                            <select
                                id="mois-select"
                                onChange={(e) => applyFilterMois(e.target.value)}
                                value={moisFiltre || ""}
                                className="bg-transparent border-none focus:outline-none font-medium text-gray-800 text-sm px-2 py-1"
                            >
                                <option value="">Tous les mois</option>
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={nextWeek}
                                className="px-1 text-purple-600 hover:bg-blue-50 transition duration-200 sm:border-l border-gray-100"
                            >
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">Semaine suivante</span>
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Conteneur du calendrier */}
            <div className="relative bg-white rounded-2xl shadow border border-gray-400 overflow-hidden h-full xl:h-[590px] 2xl:min-h-[1000px] animate-slide-up">

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
                <div style={{ height: "100%", overflowY: "auto" }} className="custom-scrollbar border border-gray-100">

                    <DayPilotCalendar
                        {...config}
                        height="parent"
                        ref={calendarRef}
                        events={events}
                    />

                </div>
            </div>


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
export default SemaineCalendarFormateur;