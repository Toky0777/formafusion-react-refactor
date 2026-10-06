import { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, Eye, Pen, Trash2 } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { ErrorDisplay } from "../../ui/error-display";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import axios from "../../../config/axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import FormateurVoir from "../../../pages/Cfp/trainers/FormateurVoir";
import { AnimatePresence } from "framer-motion";
import { IMAGE_URL } from "../../../config/env";

const Trainer = ({ searchQuery }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formateurEdit, setFormateurEdit] = useState(null);
  const [ShowModalEdit, setShowModalEdit] = useState(false);
  const [showModalVoir, setShowModalVoir] = useState(false);
  const [formateurVoir, setFormateurVoir] = useState(null);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await searchService.getTrainer(searchQuery);

      setTrainers(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des formateurs";
      setError(errorMessage);
      console.error("Error fetching trainers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoir = (formateur) => {
    setFormateurVoir(formateur);
    setShowModalVoir(true);
  };

  const handleEdit = (formateur) => {
    setFormateurEdit(formateur);
    setShowModalEdit(true);
  };

  const handleDelete = async (id) => {
    const isConfirm = await Swal({
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
      const response = await axios.delete(`/cfp/formateurs/${id}`);
      toast.success("Formateur supprimé avec succès");
      fetchTrainers();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Une erreur inconnue est survenue."
      );
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Chargement des formateurs..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Erreur de chargement"
        message={error}
        onRetry={fetchTrainers}
      />
    );
  }

  if (!trainers || trainers.length === 0) {
    return (
      <EmptyState
        icon={<UserCheck className="w-12 h-12 text-gray-400" />}
        title="Aucun formateur trouvé"
        description="Il n'y a actuellement aucun formateur correspondant à votre recherche."
      />
    );
  }

  return (
    <>
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {trainers.length} Formateur{trainers.length > 1 ? "s" : ""} trouvé
            {trainers.length > 1 ? "s" : ""}
          </h1>
          <button
            onClick={fetchTrainers}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {trainers.map((trainer) => (
            <div
              key={trainer.idFormateur}
              className="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]"
            >
              <div className="flex flex-col w-full h-full gap-2 justify-first">
                <div className="flex flex-wrap gap-2 p-2">
                  {/* Image du formateur */}
                  <div className="flex justify-start col-span-2">
                    <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 border-purple-600 rounded-full">
                      <img
                        src={`${IMAGE_URL}/img/formateurs/${trainer.photo}`}
                        alt={`${trainer.namw} ${trainer.firstName}`}
                        className="object-cover w-full h-full border-purple-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* name et préname */}
                  <div className="flex flex-col col-span-4 gap-2 ">
                    <p className="font-semibold  text-slate-500">
                      {trainer.name}
                    </p>
                    <p className=" text-slate-500">{trainer.firstName}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-50 h-1/3 rounded-xl">
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
                          <Mail className="text-purple-600" size={16} />
                        </div>
                        <p className="text-gray-500">{trainer.email}</p>
                      </div>
                      <div className="inline-flex items-center gap-1">
                        <div className="w-[18px]">
                          <Phone className="text-purple-600" size={16} />
                        </div>
                        <p className="text-gray-500">{trainer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* boutton */}
                <div className="flex items-center justify-end border-t-[1px] gap-3 p-3">
                  <button
                    title="Voir le CV"
                    onClick={() => handleVoir(trainer)}
                  >
                    <Eye className="w-4 h-4 text-green-600" />
                  </button>
                  <button onClick={() => handleEdit(trainer)} title="Modifier">
                    <Pen className="w-4 h-4 text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.idFormateur)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showModalVoir && (
          <FormateurVoir
            formateur={formateurVoir}
            setShowModalVoir={setShowModalVoir}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Trainer;
