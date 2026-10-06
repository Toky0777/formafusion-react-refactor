import {
  Building2,
  ChevronDown,
  ChevronUp,
  Edit3,
  MapPin,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectService } from "../../../services/projectService";
import AddRoom from "../../Modals/project/AddRoom";

export const PlaceSection = ({
  id,
  setShowPageEntreprise,
  AfficheLieu,
  toggleAfficheLieu,
  roomName,
  neighborhood,
  city,
  setRoomName,
  setNeighborhood,
  setCity,
}) => {
  const [showPage, setShowPage] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomAssigned, setRoomAssigned] = useState(null);
  const [search, setSearch] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);

  const manageRoom = async (idSalle) => {
    try {
      const { data } = await projectService.manageRoom(id, idSalle);
      fetchRoomAssigned();
      fetchAllRoom();
      setRoomName(data.room);
      setNeighborhood(data.quartier);
      setCity(data.city);
      setSearch("");
    } catch (error) {
      console.error("Erreur de l'ajout de salle:", error);
    }
  };

  const deleteRoomForProject = async (idSalle) => {
    try {
      await projectService.deleteRoomForProject(id, idSalle);
      fetchRoomAssigned();
      setRoomName("");
      setNeighborhood("");
      setCity("");
      setRoomAssigned(null);
    } catch (error) {
      console.error("Erreur de l'ajout de salle:", error);
    }
  };

  const fetchAllRoom = async () => {
    const response = await projectService.getAllRoom();
    setRooms(response);
  };

  const fetchRoomAssigned = async () => {
    try {
      const response = await projectService.getRoomAssigned(id);

      if (!response || Object.keys(response).length === 0) {
        setRoomAssigned(null);
        return;
      }

      setRoomAssigned(response);
    } catch (error) {
      console.error("Erreur fetchRoomAssigned:", error);
      setRoomAssigned(null);
    }
  };

  const createNewRoom = () => {
    console.log("dede");

    setShowAddRoom(true);
  };

  const filteredRooms = rooms.filter((s) => {
    const searchValue = search.toLowerCase();

    const room = s?.room?.toLowerCase() || "";
    const place = s?.place?.toLowerCase() || "";
    const quartier = s?.quartier?.toLowerCase() || "";
    const city = s?.city?.toLowerCase() || "";
    const postal = s?.postal_code?.toLowerCase() || "";

    return (
      room.includes(searchValue) ||
      place.includes(searchValue) ||
      quartier.includes(searchValue) ||
      city.includes(searchValue) ||
      postal.includes(searchValue)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!showPage) return;
      fetchAllRoom();
      fetchRoomAssigned();
    };

    fetchData();
  }, [showPage]);

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        <h2 className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
            <button
              onClick={toggleAfficheLieu}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-purple-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lieu et salle
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                    Actifs
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Gérez vos lieu et salle de formation
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {AfficheLieu ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            <div className="flex justify-end w-full pr-4 mt-2">
              <button
                onClick={() => setShowPage(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Éditer</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showPage && (
                  <>
                    {/* Overlay noir semi-transparent */}
                    <motion.div
                      className="fixed inset-0 bg-gray-800/60 "
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowPage(false)}
                    />

                    {/* Panneau de formulaire */}
                    <motion.div
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      transition={{ duration: 1 }}
                      className=""
                    >
                      <div className="fixed inset-0 z-50 overflow-hidden">
                        <div
                          className="absolute top-0 right-0 w-full h-full max-w-6xl overflow-y-auto bg-white shadow-2xl"
                          tabIndex="-1"
                          id="offcanvasSalle"
                          aria-labelledby="offcanvasSalle"
                          aria-modal="true"
                          role="dialog"
                        >
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-xl font-semibold text-gray-800">
                                  Ajouter le lieu et salle
                                </h2>
                              </div>
                              <button
                                onClick={() => setShowPage(false)}
                                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="flex h-[calc(100vh-80px)]">
                              {/* Left Panel - All Companies */}
                              <div className="w-1/2 border-r border-gray-200">
                                <div className="p-4 border-b bg-gray-50">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-red-400 rounded"></div>
                                    <h3 className="text-sm font-medium text-gray-700">
                                      Lieu et adresse
                                    </h3>
                                  </div>

                                  <div className="relative">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                      type="text"
                                      placeholder="Chercher un lieu et adresse"
                                      onChange={(e) =>
                                        setSearch(e.target.value)
                                      }
                                      value={search}
                                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div className="h-full p-4 space-y-3 overflow-y-auto">
                                  {filteredRooms.length > 0 ? (
                                    filteredRooms.map((s, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-cyan-300"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="grid col-span-3">
                                            <div className="flex flex-col">
                                              <span className="text-[13px] font-semibold text-gray-600">
                                                {s.room && `${s.room} de`}{" "}
                                                {s.place}
                                              </span>
                                              <span className="text-gray-500 text-[13px]">
                                                {s.quartier}
                                              </span>
                                              <span className="text-gray-500 text-[13px]">
                                                {s.city} {s.postal_code}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => manageRoom(s.id)}
                                          className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                                        >
                                          <Plus className="w-4 h-4 text-green-600" />
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="py-6 text-center text-gray-500">
                                      <p className="mb-3">Aucun lieu trouvé</p>

                                      {/* BOUTON AJOUTER */}
                                      {search.trim() !== "" && (
                                        <button
                                          onClick={() => createNewRoom()}
                                          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                        >
                                          Créer un nouveau lieu et salle
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Panel - Selected Company */}
                              <div className="w-1/2">
                                <div className="p-4 border-b bg-gray-50">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-green-400 rounded"></div>
                                    <h3 className="text-sm font-medium text-gray-700">
                                      Le lieu sélectionné pour ce projet
                                    </h3>
                                  </div>
                                </div>

                                <div className="h-full p-4 overflow-y-auto">
                                  {roomAssigned != null ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-cyan-300">
                                        <div className="flex items-center gap-3">
                                          <div className="grid col-span-3">
                                            <div className="flex flex-col">
                                              <span>
                                                <span className="text-[13px] font-semibold text-gray-600">
                                                  {roomAssigned.room &&
                                                    `${roomAssigned.room} de`}{" "}
                                                  {roomAssigned.place}
                                                </span>
                                              </span>
                                              <span>
                                                <span className="text-gray-500 text-[13px]">
                                                  {roomAssigned.quartier}
                                                </span>
                                              </span>
                                              <span>
                                                <span className="text-gray-500 text-[13px]">
                                                  {roomAssigned.city} (
                                                  {roomAssigned.postal_code})
                                                </span>
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() =>
                                            deleteRoomForProject(
                                              roomAssigned.id
                                            )
                                          }
                                          className="p-2 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200"
                                        >
                                          <Minus className="w-4 h-4 text-red-600" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="py-12 text-center text-gray-500">
                                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                      <p>Aucun client sélectionné</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={() => setShowPageEntreprise(false)}
                                className="px-4 py-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => setShowPageEntreprise(false)}
                                className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-cyan-600 hover:bg-cyan-700"
                              >
                                Fermer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </span>
        </h2>
        <div className="p-2">
          {AfficheLieu && (
            <div className="accordion-body">
              {roomName ? (
                <div>
                  <p>
                    La formation aura lieu à{" "}
                    <span className="text-gray-600">
                      <span className="salle_ville">{city || "N/A"} - </span>
                      <span className="text-blue-500 salle_re">
                        {neighborhood || "N/A"} -{" "}
                      </span>
                      <span className="salle_nm">{roomName || "N/A"}</span>
                    </span>
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Aucun lieu et salle associé
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Ajoutez de lieu et salle à votre projet
                  </p>
                  <button
                    onClick={() => setShowPage(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-cyan-600 rounded-xl hover:bg-cyan-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une lieu et salle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showAddRoom && (
        <AddRoom
          show={showAddRoom}
          handleClose={() => setShowAddRoom(false)}
          manageRoom={(id) => manageRoom(id)}
        />
      )}
    </div>
  );
};
