import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Folder,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import ButtonSecondary from "../button/ButtonSecondary";
import ButtonDanger from "../button/ButtonDanger";
import { useState } from "react";
import DrawerProjetsParticulier from "../drawer/particulier/DrawerProjetsParticulier";
import EditFormParticulier from "../forms/EditFormParticulier";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../config/env";

export default function CardParticulier({
  parts,
  onDelete,
  editParticulier,
  updateParticulier,
  updatePhotoParticulier,
  projets,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [partProjets, setPartProjets] = useState([]);
  const [loadingProject, setLoadingProject] = useState(false);

  const imgUrl = IMAGE_URL + "/img/particuliers";

  const handleSubmit = async (idParticulier) => {
    setShowModal(false);
    try {
      const res = await onDelete(idParticulier);
      toastr.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditParticulier = async (idParticulier) => {
    setIsLoading(true);
    setShowEditModal(true);

    try {
      const data = await editParticulier(idParticulier);
      setEditData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowProject = async (idParticulier) => {
    setLoadingProject(true);
    try {
      setShowDrawerProject(idParticulier);
      const res = await projets(idParticulier);
      setPartProjets(res.projets);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const ModalConfirm = ({ children, onClose }) => {
    return (
      <div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[700] overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <div className="fixed inset-0 bg-black/20" onClick={onClose} />

              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:p-6"
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const EditModal = ({ onClose }) => {
    return (
      <div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[700] overflow-y-auto"
          >
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <div className="fixed inset-0 bg-black/20" onClick={onClose} />

              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:p-6 max-w-2xl w-full mx-auto"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : editData ? (
                  <EditFormParticulier
                    dataEdit={editData}
                    onClose={onClose}
                    updateParticulier={updateParticulier}
                    updatePhoto={updatePhotoParticulier}
                  />
                ) : (
                  <div className="text-center py-10">
                    <p>Erreur lors du chargement des données</p>
                    <ButtonSecondary onClick={onClose} className="mt-4">
                      Fermer
                    </ButtonSecondary>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1 mr-2">
              <div className="relative group w-24 h-24 flex-shrink-0">
                {parts?.part_photo ? (
                  <img
                    src={`${imgUrl}/${parts.part_photo}`}
                    alt="Photo apprenant"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-bold truncate"> {parts?.part_name}</span>
                <span className="text-sm text-gray-500 truncate">
                  {" "}
                  {parts?.part_firstname}{" "}
                </span>
              </div>
            </div>
            <div className="flex justify-end group-hover:opacity-100 opacity-0 transition-opacity duration-300">
              <button
                onClick={() => handleEditParticulier(parts.idParticulier)}
                className="p-2 text-gray-500 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                title="Éditer"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="p-2 text-gray-500 rounded-lg hover:bg-rose-100 transition-colors duration-200"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <p className="text-sm">
                {parts?.part_email || "Aucun email disponible"}
              </p>
            </div>
            <div className="flex items-center text-gray-600 transition-colors">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                {parts?.part_phone &&
                parts?.part_phone.trim() !== "" &&
                parts?.part_phone !== "undefined"
                  ? parts?.part_phone
                  : "Aucun numéro"}
              </span>
            </div>
            <div
              className="flex items-center text-blue-600 transition-colors cursor-pointer"
              onClick={() => handleShowProject(parts?.idParticulier)}
            >
              <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Voir les projets</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ModalConfirm onClose={() => setShowModal(false)}>
          <div>
            <div className="flex justify-center items-center text-red-400 mb-3">
              <AlertCircle size={50} />
            </div>
            <h1 className="text-center font-bold mb-5">Suppression</h1>
            <p>
              Voulez-vous supprimer
              <span className="font-bold"> {parts?.part_name} </span> ?
            </p>
            <div className="flex justify-end mt-5 gap-2">
              <ButtonSecondary onClick={() => setShowModal(false)}>
                Annuler
              </ButtonSecondary>
              <ButtonDanger onClick={() => handleSubmit(parts?.idParticulier)}>
                Confirmez
              </ButtonDanger>
            </div>
          </div>
        </ModalConfirm>
      )}

      {showDrawerProject && (
        <DrawerProjetsParticulier
          isOpen={showDrawerProject}
          onClose={() => setShowDrawerProject(false)}
          partProjets={partProjets}
          loading={loadingProject}
        />
      )}

      {showEditModal && <EditModal onClose={handleCloseEditModal} />}
    </div>
  );
}
