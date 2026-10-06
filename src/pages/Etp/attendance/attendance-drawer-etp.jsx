import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaExclamation, FaTimes } from "react-icons/fa";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";

dayjs.locale("fr");

export function AttendanceDrawerEtp({ idProjet, onClose }) {
  const sheetRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endpoint = IMAGE_URL;

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
      setError(null);
      try {
        setLoading(true);
        const res = await axios.get(
          `/entreprise/emargements/projets/${idProjet}`
        );
        if (res.data && res.data.projects) {
          setData(res.data.projects);
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
  }, [idProjet]);

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-red-500 border-red-600"; // Absent
      case 2:
        return "bg-yellow-400 border-yellow-500"; // Partiel
      case 3:
        return "bg-green-500 border-green-600"; // Présent
      case null:
      case undefined:
        return "bg-gray-300 border-gray-400"; // Non défini
      default:
        return "bg-gray-300 border-gray-400";
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        ref={sheetRef}
        className="fixed top-0 right-0 z-50 w-full h-full overflow-y-auto bg-white shadow-lg max-w-5xl"
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
          ) : !data ? (
            <div className="py-10 italic text-center text-gray-400">
              Pas de séance pour ce projet
            </div>
          ) : (
            <>
              {/* Légende et % */}
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 font-medium text-green-600">
                    <FaCheck /> Présent {data?.pourcentage.present} %
                  </div>
                  <div className="flex items-center gap-2 font-medium text-yellow-500">
                    <FaExclamation /> Partiel {data?.pourcentage.partiel} %
                  </div>
                  <div className="flex items-center gap-2 font-medium text-red-400">
                    <FaTimes /> Absent {data?.pourcentage.absent} %
                  </div>
                </div>
              </div>

              {/* Tableau */}
              <div className="overflow-x-auto text-sm border border-gray-200 shadow-sm rounded-xl">
                <table className="min-w-full text-gray-700">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Apprenants</th>
                      {data.seances.map((seance, index) => (
                        <th
                          key={index}
                          className="p-3 font-semibold text-center"
                        >
                          {dayjs(seance.dateSeance).format("DD MMM")}
                          <br />
                          {seance.heureDebut} - {seance.heureFin}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.apprenants.map((appr, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-sm font-semibold text-gray-600 uppercase bg-gray-100 rounded-full">
                            {appr.emp_photo ? (
                              <img
                                src={`${endpoint}/img/employes/${appr.emp_photo}`}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              `${appr.emp_name[0]}${appr.emp_firstname[0]}`
                            )}
                          </div>
                          <div className="ml-2">
                            {" "}
                            {/* ← marge entre photo et nom */}
                            {appr.emp_name} {appr.emp_firstname}
                          </div>
                        </td>
                        {data.matrix.map((seance) => (
                          <td
                            key={`${appr.idEmploye}-${seance.idSeance}`}
                            className="p-3 text-center"
                          >
                            <div
                              className={`w-6 h-6 rounded-md border mx-auto ${getStatusColor(
                                seance[appr.idEmploye]
                              )}`}
                            ></div>
                          </td>
                        ))}
                      </tr>
                    ))}
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
