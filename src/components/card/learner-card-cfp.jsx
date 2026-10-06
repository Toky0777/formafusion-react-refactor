import {
  Book,
  Building,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import ApprenantEditModal from "../../pages/Cfp/learner/edit-apprenant-cfp";
import ShowEmpl from "../Modals/learner/ShowLea";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import DeleteConfirmationModal from "../Modals/delete-modal";
import T from "../translate/AutoTranslator";
import ProjectDrawer from "../drawer/customer/ProjectDrawer";
import { IMAGE_URL } from "../../config/env";

export default function LearnerCard({
  learner,
  showEtp,
  editLearner,
  updateLearner,
  updatePhotoLearner,
  deleteLearner,
  isFormateur = false,
}) {
  const imgUrl = IMAGE_URL + "/img/employes";
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [othersData, setOthersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCours, setShowCours] = useState(false);
  const [employeId, setEmployeId] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [dataEtp, setDataEtp] = useState({});
  const [showDrawerEtp, setShowDrawerEtp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleShowCours = (id) => {
    setEmployeId(id);
    setShowCours(true);
  };

  const handleEditLeaner = async (id) => {
    setShowModalEdit(true);
    setLoading(true);
    try {
      const res = await editLearner(id);
      setOthersData({
        villes: res.villes,
        etps: res.etps,
        learner: res.apprenant,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setShowModalEdit(false);
    setOthersData(null);
  };

  const handleDeleteLearner = async (id) => {
    try {
      const res = await deleteLearner(id);
      if (res.status === 200) {
        toastr.success(res.message);
      } else {
        toastr.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowEtp = async (idEtp) => {
    setIsLoading(true);
    setShowDrawerEtp(true);
    try {
      const res = await showEtp(idEtp);
      setDataEtp(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white shadow rounded-xl hover:shadow-xl group">
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1 min-w-0 mr-2">
              <div className="relative flex-shrink-0 w-24 h-24 group">
                {learner?.emp_photo ? (
                  <img
                    src={`${imgUrl}/${learner.emp_photo}`}
                    alt="Photo apprenant"
                    className="object-cover w-20 h-20 border-2 border-gray-200 rounded-full shadow-sm"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 bg-gray-100 border-2 border-gray-200 rounded-full shadow-sm">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold truncate"> {learner.emp_name}</span>
                <span className="text-sm text-gray-500 truncate">
                  {" "}
                  {learner?.emp_firstname}{" "}
                </span>
              </div>
            </div>
            <div className="flex justify-end flex-shrink-0 gap-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleEditLeaner(learner.idEmploye)}
                className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-blue-200"
                title="Éditer"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setShowModalDelete(true)}
                className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-rose-100"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <Mail className="flex-shrink-0 w-4 h-4 mr-2" />
              <p className="text-sm">
                {learner?.emp_email || <T> Aucun email</T>}
              </p>
            </div>
            <div className="flex items-center text-gray-600 transition-colors">
              <Phone className="flex-shrink-0 w-4 h-4 mr-2" />
              <span className="text-sm">
                {learner?.emp_phone || <T>Aucun numéro</T>}
              </span>
            </div>

            <div
              className="flex items-center text-gray-600 transition-colors cursor-pointer hover:underline"
            // onClick={() => handleShowEtp(learner.idEtp)}
            >
              <Building className="flex-shrink-0 w-4 h-4 mr-2" />
              <span className="text-sm">
                {learner?.etp_name || <T>Aucune entreprise</T>}
              </span>
            </div>

            {!isFormateur && (
              <div
                className="flex items-center text-blue-500 transition-colors cursor-pointer"
                onClick={() => handleShowCours(learner.idEmploye)}
              >
                <Book className="flex-shrink-0 w-4 h-4 mr-2" />
                <span className="text-sm">
                  <T>Voir les cours</T>
                </span>
              </div>
            )}
          </div>
        </div>

        {showModalEdit && (
          <ApprenantEditModal
            data={othersData}
            isOpen={showModalEdit}
            onClose={handleCloseModal}
            loading={loading}
            updateLearner={updateLearner}
            updatePhotoLearner={updatePhotoLearner}
          />
        )}
        {showCours && (
          <ShowEmpl
            isOpen={showCours}
            idEmploye={employeId}
            onClose={() => setShowCours(false)}
          />
        )}

        {showModalDelete && (
          <DeleteConfirmationModal
            isOpen={showModalDelete}
            onClose={() => setShowModalDelete(false)}
            onConfirm={() => handleDeleteLearner(learner.idEmploye)}
          />
        )}

        {showDrawerEtp && (
          <ProjectDrawer
            account="cfp"
            isLoading={isLoading}
            data={dataEtp}
            isShow={showDrawerEtp}
            onClose={() => setShowDrawerEtp(false)}
          />
        )}
      </div>
    </div>
  );
}
