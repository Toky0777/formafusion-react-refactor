import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { motion, AnimatePresence } from "framer-motion";

import useApi from "../../../hooks/Api";
import { FaCheck, FaExclamation, FaTimes } from "react-icons/fa";

dayjs.locale("fr");

export function AttendanceDrawer({ idProjet, onClose }) {
  const sheetRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { callApi } = useApi();

  // 🔹 Gestion du click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 🔹 Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setItems([]);
      setError(null);
      try {
        setLoading(true);
        const res = await callApi(`/employes/emargements/projets/${idProjet}`);

        if (res && res.projects && res.projects.project_items) {
          setItems(res.projects);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de présence", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    if (idProjet) {
      fetchData();
    }
  }, [idProjet, callApi]);

  const getStatusColor = (status) => {
    switch (status) {
      case 3:
        return "bg-green-500 border-green-600"; // Présent
      case 2:
        return "bg-yellow-400 border-yellow-500"; // Partiel
      case 1:
        return "bg-red-500 border-red-600"; // Absent
      case null:
      case undefined:
        return "bg-gray-300 border-gray-400"; // Non défini
      default:
        return "bg-gray-300 border-gray-400";
    }
  };
  console.log(items);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        ref={sheetRef}
        className="fixed top-0 right-0 z-50 w-full h-full overflow-y-auto bg-white shadow-lg max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-600">
            Fiche de présence
          </h2>
          <button
            className="p-2 text-gray-500 rounded hover:bg-gray-200"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✖
          </button>
        </div>

        <div className="p-4 space-y-6">
          {loading ? (
            <div className="py-10 italic text-center text-gray-500">
              Chargement des données de présence...
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-500 border border-red-200 rounded bg-red-50">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 italic text-center text-gray-400">
              Pas de séance pour ce projet
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-medium text-green-600">
                    <FaCheck /> Présent {items?.pourcentage.present} %
                  </div>
                  <div className="flex items-center gap-2 font-medium text-yellow-500">
                    <FaExclamation /> Partiellement {items?.pourcentage.partiel}{" "}
                    %
                  </div>
                  <div className="flex items-center gap-2 font-medium text-red-400">
                    <FaTimes /> Absent {items?.pourcentage.absent} %
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2 text-gray-400">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div> Non
                    défini
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
              <div className="overflow-x-auto text-sm border border-gray-200 shadow-sm rounded-xl">
                <table className="min-w-full text-gray-700">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      {items?.project_items.map((it) => (
                        <th
                          key={it.idSeance}
                          className="p-3 font-semibold text-center"
                        >
                          {dayjs(it.session_date).format("DD MMM YYYY")}
                        </th>
                      ))}
                    </tr>
                    <tr className="text-gray-500 bg-white">
                      {items?.project_items.map((it) => (
                        <td
                          key={`start-${it.idSeance}`}
                          className="p-3 text-center"
                        >
                          {it.start_hour}
                        </td>
                      ))}
                    </tr>
                    <tr className="text-gray-500 bg-white border-b border-gray-200">
                      {(items?.project_items).map((it) => (
                        <td
                          key={`end-${it.idSeance}`}
                          className="p-3 text-center"
                        >
                          {it.end_hour}
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {items?.project_items.map((it) => (
                        <td
                          key={`status-${it.idSeance}`}
                          className="p-3 text-center"
                        >
                          <div
                            className={`w-6 h-6 rounded-md border mx-auto ${getStatusColor(
                              it.isPresent
                            )}`}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
