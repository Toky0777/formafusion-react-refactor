import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import useApi from "../../../hooks/Api";

dayjs.locale("fr");

const FormateurDrawer = ({ idFormateur, isOpen, onClose }) => {
  const endpoint = process.env.REACT_APP_URL_IMAGE;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { callApi } = useApi();

  const drawerRef = useRef(null);

  // Click outside pour fermer le drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Charger les données
  useEffect(() => {
    if (!idFormateur) return;

    const openFormateurDrawer = async (id) => {
      setIsLoading(true);
      setData([]);
      try {
        const res = await callApi(`/cfp/attendance/formateur/${id}/mini-cv`);
        setData(res);
      } catch (error) {
        console.error("Erreur chargement formateur", error);
      } finally {
        setIsLoading(false);
      }
    };

    openFormateurDrawer(idFormateur);
  }, [idFormateur]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="formateur-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed top-0 right-0 z-50 h-full w-full max-w-[60rem] bg-white shadow-2xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={drawerRef}
            className="h-full flex flex-col bg-white w-[60rem] shadow-xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-100">
              <p className="text-lg font-medium text-gray-500">
                À propos du formateur
              </p>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
                aria-label="Fermer"
              >
                <i className="text-gray-500 fa-solid fa-xmark"></i>
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center w-full h-full bg-white/70">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-[6px] border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-semibold tracking-wide text-gray-500">
                    Chargement...
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Profil */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex p-4 rounded-3xl bg-gray-50"
                >
                  <div className="w-32 h-32 overflow-hidden rounded-full">
                    <img
                      src={`${endpoint}/img/formateurs/${data?.form?.photo}`}
                      alt="Profil"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-gray-700">
                      {data.form?.name} {data.form?.firstName}
                    </h3>
                    <p className="text-base text-gray-500">
                      {data.speciality?.form_titre}
                    </p>
                  </div>
                </motion.div>

                {/* Coordonnées */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 space-y-2 border border-gray-200 border-dashed rounded-md"
                >
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold text-gray-600">
                      Email :
                    </h5>
                    <p className="text-base text-gray-400">
                      {data.form?.email}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h5 className="text-lg font-semibold text-gray-600">
                      Téléphone :
                    </h5>
                    <p className="text-base text-gray-400">
                      {data.form?.phone}
                    </p>
                  </div>
                </motion.div>

                {/* Expériences et Formations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 space-y-4 border border-gray-200 border-dashed rounded-md"
                >
                  {/* Expériences */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-600">
                      Expériences
                    </h5>
                    <ul className="space-y-2">
                      {data.experiences?.length === 0 ? (
                        <li className="flex justify-between text-gray-400">
                          Aucune expérience
                        </li>
                      ) : (
                        data.experiences.map((exp, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-gray-400"
                          >
                            <div className="flex gap-2">
                              <span>{exp.Fonction}</span>
                              <span>- {exp.Lieu_de_stage}</span>
                            </div>
                            <span>
                              {dayjs(exp.Date_debut).format("D MMM YYYY")} -{" "}
                              {dayjs(exp.Date_fin).format("D MMM YYYY")}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Formations */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-600">
                      Formations
                    </h5>
                    <ul className="space-y-2">
                      {data.diplomes?.length === 0 ? (
                        <li className="flex justify-between text-gray-400">
                          Aucun diplôme
                        </li>
                      ) : (
                        data.diplomes.map((dpl, i) => (
                          <li
                            key={i}
                            className="flex justify-between text-gray-400"
                          >
                            <div className="flex gap-2">
                              <span>{dpl.Diplome}</span>
                              <span>- {dpl.Ecole}</span>
                            </div>
                            <span>
                              {dayjs(dpl.Date_debut).format("D MMM YYYY")} -{" "}
                              {dayjs(dpl.Date_fin).format("D MMM YYYY")}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </motion.div>

                {/* Compétences et Langues */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 space-y-4 border border-gray-200 border-dashed rounded-md"
                >
                  {/* Compétences */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-600">
                      Compétences
                    </h5>
                    <ul className="space-y-2 text-gray-400">
                      {data.competences?.length === 0 ? (
                        <li className="flex justify-between text-gray-400">
                          Aucune compétence
                        </li>
                      ) : (
                        data.competences.map((cmpt, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <span>{cmpt.Competence}</span>
                            <span className="flex gap-1">
                              {[...Array(5)].map((_, index) => (
                                <img
                                  key={index}
                                  src={
                                    index < cmpt.note
                                      ? "/img/star.png"
                                      : "/img/star-empty.png"
                                  }
                                  alt="star"
                                  className="w-5 h-5"
                                />
                              ))}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Langues */}
                  <div>
                    <h5 className="text-lg font-semibold text-gray-600">
                      Langues
                    </h5>
                    <ul className="space-y-2 text-gray-400">
                      {data.langues?.length === 0 ? (
                        <li className="flex justify-between text-gray-400">
                          Aucune langue
                        </li>
                      ) : (
                        data.langues.map((lng, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{lng.Langue}</span>
                            <span className="flex gap-1">
                              {[...Array(5)].map((_, index) => (
                                <img
                                  key={index}
                                  src={
                                    index < lng.note
                                      ? "/img/star.png"
                                      : "/img/star-empty.png"
                                  }
                                  alt="star"
                                  className="w-5 h-5"
                                />
                              ))}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormateurDrawer;
