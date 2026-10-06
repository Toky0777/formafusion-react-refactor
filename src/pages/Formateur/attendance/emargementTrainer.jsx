import { ChevronLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  FaCheck,
  FaExclamation,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { motion } from "framer-motion";
import useApi from "../../../hooks/Api";
import { IMAGE_URL } from "../../../config/env";

dayjs.locale("fr");

export default function EmargementTrainer() {
  const { showEmg } = useOutletContext();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // États pour la fiche de présence
  const sheetRef = useRef(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const endpoint = IMAGE_URL;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [presenceMap, setPresenceMap] = useState({});
  const [reload, setReload] = useState(1);
  const [invalidCells, setInvalidCells] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const role = parseInt(localStorage.getItem("rle_d"));
  const { callApi } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await showEmg(id);
        setData(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const openPresenceDrawer = async (projectId) => {
      setData([]);
      setSession(null);
      setError(null);

      try {
        setLoading(true);

        const url = `/formateur/presence/${projectId}`;

        const [result, res] = await Promise.all([
          callApi(`/formateur/presence/projects/${projectId}/data`),
          callApi(url),
        ]);

        if (!result) return;

        setSession(result.seances);
        setData(res);

        setPresenceMap(() => {
          const map = {};
          res.getPresence?.forEach((v_gp) => {
            map[`${v_gp.idSeance}_${v_gp.idEmploye}`] = v_gp.isPresent;
          });
          return map;
        });
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de présence",
          error
        );
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    openPresenceDrawer(id);
  }, [id, reload]);

  // 🔹 CORRECTION : Logique unifiée pour la gestion des cases à cocher
  const handleCheckboxChange = (dayId, apprenticeId) => {
    const key = `${dayId}_${apprenticeId}`;

    setSelectedCheckboxes((prev) => {
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = true;
      }

      // Mettre à jour selectAll en fonction de l'état actuel
      const totalCheckboxes =
        data?.getSeance?.length * data?.apprs?.length || 0;
      setSelectAll(
        Object.keys(updated).length === totalCheckboxes && totalCheckboxes > 0
      );

      return updated;
    });
  };

  // 🔹 CORRECTION : Logique améliorée pour "Tout sélectionner"
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;

    if (newSelectAll) {
      // Sélectionner toutes les cases
      const newSelected = {};
      data?.getSeance?.forEach((seance) => {
        data?.apprs?.forEach((apprenant) => {
          newSelected[`${seance.idSeance}_${apprenant.idEmploye}`] = true;
        });
      });
      setSelectedCheckboxes(newSelected);
    } else {
      // Désélectionner toutes les cases
      setSelectedCheckboxes({});
    }

    setSelectAll(newSelectAll);
  };

  // 🔹 CORRECTION : Logique améliorée pour la sélection d'une journée
  const handleDaySelect = (dayId) => {
    setSelectedCheckboxes((prev) => {
      const updated = { ...prev };

      // Vérifier si tous les apprenants de cette journée sont déjà sélectionnés
      const allSelected = data?.apprs?.every(
        (appr) => updated[`${dayId}_${appr.idEmploye}`]
      );

      // Basculer l'état de tous les apprenants de cette journée
      data?.apprs?.forEach((appr) => {
        const key = `${dayId}_${appr.idEmploye}`;
        if (allSelected) {
          delete updated[key];
        } else {
          updated[key] = true;
        }
      });

      // Mettre à jour selectAll
      const totalCheckboxes =
        data?.getSeance?.length * data?.apprs?.length || 0;
      setSelectAll(
        Object.keys(updated).length === totalCheckboxes && totalCheckboxes > 0
      );

      return updated;
    });
  };

  // 🔹 CORRECTION : Synchroniser selectAll quand selectedCheckboxes change
  useEffect(() => {
    const totalCheckboxes = data?.getSeance?.length * data?.apprs?.length || 0;
    const currentSelectedCount = Object.keys(selectedCheckboxes).length;

    // Mettre à jour selectAll seulement si nécessaire
    if (totalCheckboxes > 0) {
      const shouldBeSelectAll = currentSelectedCount === totalCheckboxes;
      if (selectAll !== shouldBeSelectAll) {
        setSelectAll(shouldBeSelectAll);
      }
    }
  }, [selectedCheckboxes, data?.getSeance, data?.apprs]);

  // Vérifier s'il y a des cases cochées
  const hasSelectedCheckboxes = Object.keys(selectedCheckboxes).length > 0;

  const confirmChecking = async (status, projectId) => {
    try {
      const formatSelectedCheckboxes = () => {
        return Object.entries(selectedCheckboxes).map(([key]) => {
          const [dayId, apprenticeId] = key.split("_");
          return {
            idEmploye: parseInt(apprenticeId),
            idSeance: parseInt(dayId),
            isPresent: status,
            idProjet: projectId,
            key: `${dayId}_${apprenticeId}`,
          };
        });
      };

      const dataToSend = formatSelectedCheckboxes();
      console.log(JSON.stringify(dataToSend));

      if (dataToSend.length === 0) {
        console.warn("Aucune case cochée !");
        return;
      }

      if (role === 5 || role === 3) {
        if (status === 4) {
          setIsDeleting(true);

          // Vérification : empêcher suppression de cases sans présence définie
          const undefinedCases = dataToSend.filter((item) => {
            const presence = presenceMap[item.key];
            return presence === null || presence === undefined;
          });

          if (undefinedCases.length > 0) {
            // Récupérer le détail des cases concernées (format : ligne X, colonne Y)
            const cages = undefinedCases.map((item) => {
              const apprenant = data.apprs.find(
                (a) => a.idEmploye === item.idEmploye
              );
              const seance = data.getSeance.find(
                (s) => s.idSeance === item.idSeance
              );
              return {
                nom: `${apprenant?.emp_name || ""} ${
                  apprenant?.emp_firstname || ""
                }`,
                date: dayjs(seance?.dateSeance).format("DD MMM YYYY"),
                key: item.key,
              };
            });

            setInvalidCells(cages);
            setShowAlertModal(true);

            // 🔹 CORRECTION : Décocher seulement les cases vides quand suppression impossible
            setSelectedCheckboxes((prev) => {
              const updated = { ...prev };
              undefinedCases.forEach((item) => {
                delete updated[item.key];
              });
              return updated;
            });

            return;
          }

          // DELETE pour chaque présence définie
          const url = `/formateur/presence/emargement/delete`;

          const res = await callApi(url, {
            method: "delete",
            body: JSON.stringify({ items: dataToSend }),
            headers: { "Content-Type": "application/json" },
          });

          if (res?.status === 200) {
            console.log("Suppression réussie");
            setReload((v) => v + 1);

            // 🔹 CORRECTION : Décocher toutes les cases après suppression réussie
            setSelectedCheckboxes({});
          } else {
            console.warn("Erreur :", res?.message);
          }

          setReload((v) => v + 1);
        } else {
          // POST pour enregistrer la présence
          const res = await callApi("/formateur/presence/emargement", {
            method: "POST",
            body: JSON.stringify(dataToSend),
          });

          if (res?.success === "Succès") {
            setReload((v) => v + 1);
            // 🔹 CORRECTION : Décocher toutes les cases après action réussie
            setSelectedCheckboxes({});
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 "
      >
        <ChevronLeft className="w-5 h-5" />
        Retour
      </button>
      <h1 className="text-3xl text-center font-semibold text-gray-800">
        Fiche de présence
      </h1>

      {/* Contenu de la fiche de présence */}
      <div className="space-y-6">
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center transition duration-300 bg-white/50 backdrop-blur-md">
            <div className="w-full max-w-sm p-5 space-y-4 bg-white shadow-xl rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-red-500">⚠️</span>
                <h3 className="text-lg font-semibold text-red-600">
                  Suppression impossible
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                {
                  "Les cellules suivantes n'ont pas encore de présence enregistrée :"
                }
              </p>
              <ul className="overflow-auto text-sm text-gray-600 list-disc list-inside max-h-40">
                {invalidCells.map((cell, index) => (
                  <li key={index}>
                    {cell.nom} — {cell.date}
                  </li>
                ))}
              </ul>
              <div className="text-right">
                <button
                  className="mt-2 px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  onClick={() => setShowAlertModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Le reste du code reste inchangé */}
        {/* Instructions d'utilisation */}
        {role !== 4 && showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-800">
                    Comment utiliser la fiche de présence :
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside">
                    <li>
                      <span className="font-medium">Sélectionnez</span> une ou
                      plusieurs cases en cliquant dessus
                    </li>
                    <li>
                      Les cases sélectionnées deviennent{" "}
                      <span className="font-medium">grises</span> avec une coche
                    </li>
                    <li>
                      Les boutons d'action apparaissent automatiquement lorsque
                      des cases sont sélectionnées
                    </li>
                    <li>
                      Utilisez "Tout sélectionner" pour cocher/décocher toutes
                      les cases
                    </li>
                    <li>
                      Cliquez sur la case d'un jour pour
                      sélectionner/désélectionner tous les apprenants de cette
                      journée
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1 text-blue-400 rounded hover:text-blue-600 hover:bg-blue-100"
                aria-label="Masquer les instructions"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages de chargement / erreur / pas de session */}
        {loading ? (
          <div className="py-10 italic text-center text-gray-500">
            Chargement des données de présence...
          </div>
        ) : error ? (
          <div className="py-4 text-center text-red-500 border border-red-200 rounded bg-red-50">
            {error}
          </div>
        ) : session === null ? (
          <div className="py-10 italic text-center text-gray-400">
            Pas de session pour ce projet
          </div>
        ) : (
          <>
            {/* Légendes */}
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-medium text-green-600">
                  <FaCheck /> Présent {data?.percentPresent}
                </div>
                <div className="flex items-center gap-2 font-medium text-yellow-500">
                  <FaExclamation /> Partiellement {data?.percentPartiel}
                </div>
                <div className="flex items-center gap-2 font-medium text-red-400">
                  <FaTimes /> Absent {data?.percentAbsent}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div> Non défini
                </span>
                <span className="flex items-center gap-2 text-green-400">
                  <div className="w-4 h-4 bg-green-400 rounded"></div> Présent
                </span>
                <span className="flex items-center gap-2 text-yellow-400">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>{" "}
                  Partiellement
                </span>
                <span className="flex items-center gap-2 text-red-400">
                  <div className="w-4 h-4 bg-red-400 rounded"></div> Absent
                </span>
              </div>
            </div>

            {/* Actions - Afficher seulement s'il y a des cases cochées */}
            {role !== 4 && hasSelectedCheckboxes && (
              <div className="flex flex-wrap items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="inline-flex items-center gap-2">
                  <input
                    disabled={role === 4}
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Tout sélectionner</span>
                </label>

                <button
                  onClick={() => confirmChecking(3, id)}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                >
                  Marquer comme Présent
                </button>

                <button
                  onClick={() => confirmChecking(1, id)}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
                >
                  Marquer comme Absent
                </button>

                <button
                  onClick={() => confirmChecking(2, id)}
                  className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
                >
                  Marquer comme Partiel
                </button>

                <button
                  onClick={() => confirmChecking(4, id)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Supprimer la présence
                </button>

                <div className="text-sm text-blue-600 font-medium">
                  {Object.keys(selectedCheckboxes).length} case(s)
                  sélectionnée(s)
                </div>
              </div>
            )}

            {/* Tableau */}
            <div className="overflow-x-auto text-sm border border-gray-200 shadow-sm rounded-xl">
              <table className="min-w-full text-gray-700">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-3 font-semibold text-left">Apprenant</th>
                    {data?.getSeance?.map((day) => (
                      <th
                        key={day.idSeance}
                        className="p-3 font-semibold text-center"
                      >
                        <div>{dayjs(day.dateSeance).format("DD MMM YYYY")}</div>
                        {role !== 4 && (
                          <input
                            type="checkbox"
                            checked={data?.apprs?.every(
                              (appr) =>
                                selectedCheckboxes[
                                  `${day.idSeance}_${appr.idEmploye}`
                                ]
                            )}
                            onChange={() => handleDaySelect(day.idSeance)}
                            className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                  <tr className="text-gray-500 bg-white">
                    <td className="p-3 font-medium">Heure début</td>
                    {data?.getSeance?.map((day) => (
                      <td
                        key={`start-${day.idSeance}`}
                        className="p-3 text-center"
                      >
                        {day.heureDebut}
                      </td>
                    ))}
                  </tr>
                  <tr className="text-gray-500 bg-white border-b border-gray-200">
                    <td className="p-3 font-medium">Heure fin</td>
                    {data?.getSeance?.map((day) => (
                      <td
                        key={`end-${day.idSeance}`}
                        className="p-3 text-center"
                      >
                        {day.heureFin}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.apprs?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={data?.countDate?.length + 1}
                        className="py-6 italic text-center text-gray-400"
                      >
                        Aucun apprenant trouvé
                      </td>
                    </tr>
                  ) : (
                    data?.apprs?.map((apprentice) => (
                      <tr
                        key={apprentice.idEmploye}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="flex items-center gap-3 p-3 font-medium text-gray-800">
                          <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-sm font-semibold text-gray-600 uppercase bg-gray-100 rounded-full">
                            {apprentice.emp_photo ? (
                              <img
                                src={`${endpoint}/img/employes/${apprentice.emp_photo}`}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              `${apprentice.emp_name[0]}${apprentice.emp_firstname[0]}`
                            )}
                          </div>
                          {apprentice.emp_name} {apprentice.emp_firstname}
                        </td>
                        {data.getSeance.map((day) => {
                          const key = `${day.idSeance}_${apprentice.idEmploye}`;
                          const rawStatus = presenceMap[key];
                          const status =
                            rawStatus === null || rawStatus === undefined
                              ? "undefined"
                              : parseInt(rawStatus);
                          const isChecked = selectedCheckboxes[key] || false;

                          const getCheckColor = (status, isChecked) => {
                            if (isChecked) {
                              return "bg-gray-400 border-gray-500";
                            }
                            switch (status) {
                              case 3:
                                return "bg-green-500 border-green-600";
                              case 2:
                                return "bg-yellow-400 border-yellow-500";
                              case 1:
                                return "bg-red-500 border-red-600";
                              case "undefined":
                                return "bg-gray-300 border-gray-400";
                              default:
                                return "bg-gray-300 border-gray-400";
                            }
                          };

                          return (
                            <td key={key} className="p-3 text-center">
                              <label className="flex items-center justify-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      day.idSeance,
                                      apprentice.idEmploye
                                    )
                                  }
                                  className="hidden"
                                  disabled={role === 4}
                                />

                                <div
                                  className={`w-6 h-6 flex items-center justify-center rounded-md border transition-all duration-200 cursor-pointer hover:scale-110 ${getCheckColor(
                                    status,
                                    isChecked
                                  )}`}
                                >
                                  <FaCheck
                                    className={`text-white text-xs ${
                                      isChecked ? "block" : "hidden"
                                    }`}
                                  />
                                </div>
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isDeleting && (
        <motion.div
          key="deletingModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-gray-300 rounded-full border-t-blue-500"
          />
          <p className="absolute top-[70%] text-white text-lg font-semibold select-none">
            Suppression en cours...
          </p>
        </motion.div>
      )}
    </div>
  );
}
