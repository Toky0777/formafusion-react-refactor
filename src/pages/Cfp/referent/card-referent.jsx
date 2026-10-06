import { Mail, Pencil, Phone, Trash2, User } from "lucide-react";
import { useState } from "react";
import ReferentEditModal from "./edit-referent-cfp";
import DeleteConfirmationModal from "../../../components/Modals/delete-modal";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../../config/env";

export default function CardReferent({
  referent,
  editReferent,
  onUpdateInfoReferent,
  onUpdatePhotoReferent,
  onUpdatePassword,
  onRemove,
}) {
  const imgUrl = IMAGE_URL + "/img/referents";
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEditReferent = async (idReferent) => {
    setShowEditModal(true);
    setLoading(true);
    try {
      const res = await editReferent(idReferent);
      setData(res.emp);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async (idReferent) => {
    try {
      const res = await onRemove(idReferent);
      if (res.status === 200) {
        toastr.success(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center min-w-0 flex-1 mr-2">
              <div className="relative group w-24 h-24 flex-shrink-0">
                {referent.ref_photo ? (
                  <img
                    src={`${imgUrl}/${referent.ref_photo}`}
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
                <span className="font-bold truncate"> {referent.ref_name}</span>
                <span className="text-sm text-gray-500 truncate">
                  {" "}
                  {referent?.ref_firstname}{" "}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-1 group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex-shrink-0">
              <button
                onClick={() => handleEditReferent(referent.idEmploye)}
                className="p-2 text-gray-500 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                title="Éditer"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
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
              <p className="text-sm">{referent?.ref_email || "Aucun email"} </p>
            </div>
            <div className="flex items-center text-gray-600 transition-colors">
              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                {referent?.ref_phone || "Aucun numéro"}
              </span>
            </div>
          </div>
        </div>
        {showEditModal && (
          <ReferentEditModal
            loading={loading}
            data={data}
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            onUpdateInfoReferent={onUpdateInfoReferent}
            onUpdatePassword={onUpdatePassword}
            onUpdatePhotoReferent={onUpdatePhotoReferent}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleRemove(referent.idEmploye)}
          />
        )}
      </div>
    </div>
  );
}
