import { useState, useEffect } from "react";
import { Mail, Phone, Eye, Pen, Trash2 } from "lucide-react";
import FormateurEdit from "./FormateurEdit";
import swal from "sweetalert";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import FormateurVoir from "./FormateurVoir";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import axios from "../../../config/axios";
import FormateurProjet from "./FormateurProjet";
import { IMAGE_URL } from "../../../config/env";

const FormateurListe = ({ formateurs, count, refreshData, search }) => {
  const user = useAuth();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const [formateurEdit, setFormateurEdit] = useState(null);
  const [ShowModalEdit, setShowModalEdit] = useState(false);
  const [showModalVoir, setShowModalVoir] = useState(false);
  const [showModalProjetFormateur, setShowModalProjetFormateur] =
    useState(false);
  const [formateurVoir, setFormateurVoir] = useState(null);
  const [formateurProjet, setFormateurProjet] = useState(null);
  const [activeFormateurs, setActiveFormateurs] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("activeFormateurs");
    if (saved) {
      setActiveFormateurs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (formateurs && formateurs.length > 0) {
      const initialState = {};
      formateurs.forEach((f) => {
        initialState[f.idFormateur] = f.isActiveFormateur === 1;
      });

      const saved = localStorage.getItem("activeFormateurs");
      const savedState = saved ? JSON.parse(saved) : {};

      const mergedState = { ...initialState, ...savedState };
      setActiveFormateurs(mergedState);
      localStorage.setItem("activeFormateurs", JSON.stringify(mergedState));
    }
  }, [formateurs]);

  const toggleFormateur = async (idFormateur) => {
    const currentStatus = activeFormateurs[idFormateur];
    const newStatus = currentStatus ? 0 : 1;

    try {
      const response = await axios.post(
        `/cfp/formateurs/formateurs/${idFormateur}/toggle`,
        { isActiveFormateur: newStatus }
      );

      if (response.data?.success || response.status === 200) {
        setActiveFormateurs((prev) => {
          const newState = {
            ...prev,
            [idFormateur]: newStatus === 1,
          };

          localStorage.setItem("activeFormateurs", JSON.stringify(newState));
          return newState;
        });
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
    }
  };

  const handleVoir = (formateur) => {
    setFormateurVoir(formateur);
    setShowModalVoir(true);
  };

  const handleProjetFormateur = (idFormateur) => {
    setFormateurProjet(idFormateur);
    setShowModalProjetFormateur(true);
  };

  const handleEdit = (formateur) => {
    setFormateurEdit(formateur);
    setShowModalEdit(true);
  };
  const handleDelete = async (id) => {
    const isConfirm = await swal({
      title: "Voulez-vous vraiment supprimer cet bien?",
      text: "Vous ne pouvez plus le récupérer",
      icon: "warning",
      buttons: ["Annuler", "Oui, supprimer le "],
      dangerMode: true,
    });
    if (!isConfirm) {
      return;
    }
    try {
      await axios.delete(`/cfp/formateurs/${id}`);

      toast.success("Formateur supprimé avec succès");
      refreshData();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(
          "Suppression impossible, ce formateur est déjà associé à un projet !"
        );
      } else {
        toast.error(
          error.response?.data?.message || "Une erreur inconnue est survenue."
        );
      }
    }
  };

  const FormateurFiltered = (formateurs || [])
    .filter((f) => Number(f.form_is_active) === 0) // 0 = ancien
    .filter((f) =>
      f.form_initial_name?.toLowerCase().includes((search || "").toLowerCase())
    );

  return (
    <>
      <div className="flex items-center justify-between w-full mb-3">
        <section id="filterSection" className="">
          <div className="flex flex-col text-md">
            <h3 className="text-slate-600">
              <span>
                {" "}
                Vous avez <span className="text-[#A462A4]   "> {count} </span>
                Formateurs
              </span>
            </h3>
          </div>
        </section>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 animate-slide-up">
        {FormateurFiltered.length > 0 ? (
          FormateurFiltered.map((formateur) => (
            <div
              key={formateur.idFormateur}
              className="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"
            >
              <div className="flex flex-col w-full h-full gap-2 justify-first">
                <div className="flex flex-wrap gap-2 p-2">
                  {/* Image du formateur */}
                  <div className="flex justify-start col-span-2">
                    <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 border-purple-600 rounded-full">
                      <img
                        src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`}
                        alt={`${formateur.form_name} ${formateur.form_firstname}`}
                        className="object-cover w-full h-full border-purple-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* name et préname */}
                  <div className="flex flex-col col-span-4 gap-2 ">
                    <p className="font-semibold  text-slate-500">
                      {formateur.form_name}
                    </p>
                    <p className=" text-slate-500">
                      {formateur.form_firstname}
                    </p>
                  </div>
                </div>
                <div className="w-full  h-1/3 rounded-xl">
                  <div className="flex flex-col h-full gap-2 p-2">
                    <div className="w-full">
                      <div className="grid grid-cols-5">
                        <div className="grid justify-start col-span-2 grid-cols-subgrid">
                          <div className="flex flex-col"></div>
                        </div>
                      </div>
                    </div>
                    {/* mail et phone */}
                    <div className="flex flex-col w-full gap-1">
                      <div className="inline-flex items-center gap-1">
                        <div className="w-[18px]">
                          <Mail className="text-gray-500" size={16} />
                        </div>
                        <p className="text-gray-500">{formateur.form_email}</p>
                      </div>
                      <div className="inline-flex items-center gap-1">
                        <div className="w-[18px]">
                          <Phone className="text-gray-500" size={16} />
                        </div>
                        <p className="text-gray-500">{formateur.form_phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* boutton */}
                <div className="flex justify-between items-center border-t w-full">
                  <div>
                    <button
                      onClick={() => toggleFormateur(formateur.idFormateur)}
                      className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        activeFormateurs[formateur.idFormateur]
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      <span
                        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          activeFormateurs[formateur.idFormateur]
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></span>
                    </button>
                  </div>
                  <div className="flex items-center  gap-3 p-3">
                    <button
                      title="Voir les cours"
                      onClick={() =>
                        handleProjetFormateur(formateur.idFormateur)
                      }
                    >
                      <span className="text-gray-600">Voir les cours</span>
                    </button>
                    <button
                      title="Voir le CV"
                      onClick={() => handleVoir(formateur)}
                    >
                      <Eye className="w-4 h-4 text-gray-600 hover:text-yelow-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(formateur)}
                      title="Modifier"
                    >
                      <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(formateur.idFormateur)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-lg text-center text-gray-500">
            Aucun formateurs trouvé..
          </p>
        )}
      </div>
      <AnimatePresence>
        {ShowModalEdit && (
          <FormateurEdit
            formateur={formateurEdit}
            setShowModalEdit={setShowModalEdit}
            refreshData={refreshData}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModalVoir && (
          <FormateurVoir
            formateur={formateurVoir}
            setShowModalVoir={setShowModalVoir}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModalProjetFormateur && (
          <FormateurProjet
            idFormateur={formateurProjet}
            setShowModalProjetFormateur={setShowModalProjetFormateur}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FormateurListe;
