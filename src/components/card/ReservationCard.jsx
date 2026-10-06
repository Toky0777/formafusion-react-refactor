import { ChevronRight } from "lucide-react";
import { useState } from "react";
import DrawerParent from "../drawer/drawer-parent";
import axios from "../../config/axios";
import ProjectRsvDetails from "../reservation/ProjectRsvDetails";
import T from "../translate/AutoTranslator";

function formatDateFR(dateString) {
  const [annee, mois, jour] = dateString.split("-").map(Number);

  const moisNoms = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  return `${jour} ${moisNoms[mois - 1]} ${annee}`;
}

export default function ReservationCard({ reservation, code }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [reservationsDetails, setReservationsDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRsvById = async (id) => {
    setLoading(true);
    try {
      let res = null;
      if (code === "cfp") {
        res = await axios.get(`/cfp/rsv/${id}`);
      } else {
        res = await axios.get(`/entreprises/rsv/${id}`);
      }
      setReservationsDetails(res.data.reservation);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id) => {
    setShowDrawer(true);
    await fetchRsvById(id);
  };

  return (
    <div>
      <div class="overflow-hidden transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-gray-200">
        <div class="flex h-48">
          <div class="w-5 bg-green-100 flex items-center justify-center flex-shrink-0"></div>
          <div class="flex flex-col justify-between flex-1 min-w-0 p-5">
            <div className="bg-white  rounded-xl   transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-gray-800 mb-2 truncate">
                      {reservation.project_module_name}
                    </h3>
                    <p className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 rounded-full ">
                      {reservation.etp_name || reservation.cfp_name}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        <T>Début:</T>
                      </span>
                      <span>
                        <T>{formatDateFR(reservation.project_start_date)}</T>
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        <T>Fin:</T>
                      </span>
                      <span>
                        <T>{formatDateFR(reservation.project_end_date)}</T>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations secondaires et action */}
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="text-right space-y-2">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {reservation.project_ville}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {reservation.nbPlaceReserved != 0 ? (
                          reservation.nbPlaceReserved
                        ) : (
                          <T>Aucune</T>
                        )}{" "}
                        <T>place</T>
                        {reservation.nbPlaceReserved > 1 ? "s" : ""}{" "}
                        <T>réservée</T>
                        {reservation.nbPlaceReserved > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClick(reservation.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    <span>
                      <T>Voir détails</T>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                {reservation.project_module_domaine_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {showDrawer && (
          <DrawerParent
            title="Détails de la réservation"
            isOpen={showDrawer}
            onClose={() => setShowDrawer(false)}
          >
            <ProjectRsvDetails rsv={reservationsDetails} loading={loading} />
          </DrawerParent>
        )}
      </div>
    </div>
  );
}
