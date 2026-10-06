import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useApi from "../../../hooks/Api";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

const EntrepriseDrawer = ({ idEtp, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [entreprise, setEntreprise] = useState(null);
  const endpoint = process.env.REACT_APP_URL_IMAGE;
  const role = parseInt(sessionStorage.getItem("role"));
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

  // Charger l'entreprise quand le drawer s'ouvre
  useEffect(() => {
    if (!isOpen || !idEtp) return;

    const openEntrepriseDrawer = async (id) => {
      setIsLoading(true);
      setEntreprise(null);
      try {
        const res = await callApi(`/cfp/attendance/etp-drawer/${id}`);
        setEntreprise(res);
      } catch (error) {
        console.error("Erreur chargement entreprise", error);
      } finally {
        setIsLoading(false);
      }
    };
    openEntrepriseDrawer(idEtp);
  }, [idEtp, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 z-50 h-full w-full max-w-[720px] bg-white shadow-xl overflow-y-auto px-6 md:px-8"
          role="dialog"
          aria-modal="true"
        >
          <div ref={drawerRef} className="h-full flex flex-col">
            {/* Header sticky */}
            <div className="sticky top-0 z-20 flex items-center justify-between py-4 bg-white border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 truncate">
                {entreprise?.customer?.customerName ||
                  "Détails de l'entreprise"}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 text-gray-600 transition rounded-md hover:bg-gray-200"
                aria-label="Fermer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {isLoading ? (
              <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-purple-300 rounded-full border-t-transparent animate-spin"></div>
                  <p className="text-lg font-semibold tracking-wide text-gray-500">
                    Chargement...
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-6 mb-12"
              >
                {/* Profil Entreprise */}
                <section className="flex items-center gap-4 mb-8">
                  <div className="w-[116px] h-[77px] rounded-xl overflow-hidden shadow-md flex items-center justify-center p-1 bg-white">
                    <img
                      className="object-contain w-full h-full"
                      src={
                        entreprise?.customer?.logo
                          ? `${endpoint}/img/entreprises/${entreprise.customer.logo}`
                          : `no_img.svg`
                      }
                      alt="Logo entreprise"
                    />
                  </div>
                  <div className="flex flex-col justify-start w-full gap-1 truncate">
                    <h3 className="text-2xl font-bold text-gray-700 truncate">
                      {entreprise?.customer?.customerName}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {entreprise?.customer?.siteWeb}
                    </p>
                  </div>
                </section>

                {/* Référent principal */}
                <section className="mb-8">
                  <p className="mb-4 text-xl font-semibold text-gray-900">
                    Référent principal
                  </p>
                  {entreprise?.referents?.[0] ? (
                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg shadow-sm">
                      <div className="flex items-center justify-center w-12 h-12 text-xl text-gray-500 bg-gray-100 rounded-full">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {`${entreprise.referents[0].name || ""} ${
                            entreprise.referents[0].firstName || ""
                          } ${entreprise.referents[0].fonction || ""}`}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <i className="fa-solid fa-envelope"></i>
                          {entreprise.referents[0].email || ""}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-gray-600">
                          <i className="fa-solid fa-phone"></i>
                          {entreprise.referents[0].phone || ""}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun référent</p>
                  )}
                </section>

                {/* Autres référents */}
                <section className="mb-10">
                  <p className="mb-4 text-xl font-semibold text-gray-900">
                    Autres référents
                  </p>
                  {entreprise?.referents?.slice(1).length ? (
                    <ul className="space-y-3">
                      {entreprise.referents.slice(1).map((referent, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg shadow-sm"
                        >
                          <div className="flex-shrink-0">
                            {referent.photo ? (
                              <img
                                className="object-cover w-12 h-12 rounded-full"
                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${referent.photo}`}
                                alt={`${referent.name || ""}`}
                              />
                            ) : (
                              <div className="flex items-center justify-center w-12 h-12 text-2xl font-bold text-gray-500 bg-gray-200 rounded-full">
                                {referent.name ? referent.name?.charAt(0) : "I"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 truncate">
                              <i className="text-sm fa-solid fa-user"></i>
                              {referent.name || ""} {referent.firstName || ""}{" "}
                              {referent.fonction
                                ? `(${referent.fonction})`
                                : ""}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-gray-500 truncate">
                              <i className="text-sm fa-solid fa-envelope"></i>
                              {referent.email || "--"}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-gray-500 truncate">
                              <i className="text-sm fa-solid fa-phone"></i>
                              {referent.phone || "--"}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Aucun autre référent</p>
                  )}
                </section>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntrepriseDrawer;

// TableProject sans traductio
