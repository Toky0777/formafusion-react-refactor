import { useState } from "react";
import { Mail, Phone, Eye, Trash2, Pen, X } from "lucide-react";
import axios from "../../../config/axios";
// import { useAuth } from "../../../contexts/AuthContext";
import { ShowReferentEtp } from "./show-referent-etp";
import ReferentEditEtp from "./edit-referent-etp";
import { IMAGE_URL } from "../../../config/env";

export function CardReferentEtp({ referent, setReferent, index }) {
  const url = IMAGE_URL + "/img/referents";
  const [showEdit, setShowEdit] = useState(false);
  const [showReferent, setShowReferent] = useState(false);
  const [idReferent, setIdReferent] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  //   const { userType } = useAuth();
  const handleDelete = async (idReferent) => {
    try {
      const res = await axios.delete(`/etp/referents/${idReferent}`);
      if (res.data.status === 200) {
        setReferent((prev) => ({
          ...prev,
          referentAll: {
            ...prev.referentAll,
            data: prev.referentAll.data.filter((ref, i) => i !== index),
          },
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenModalDelete(false);
    }
  };
  return (
    <>
      <div className="flex flex-col w-full h-full p-4 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
        {/* Première ligne : Photo + Nom / Prénom */}
        <div className="flex items-center gap-4 mb-3">
          {/* Photo */}
          <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-purple-600 bg-gray-100 flex items-center justify-center">
            <img
              src={`${url}/${referent.ref_photo}`}
              alt="avatar"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nom / Prénom */}
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-lg text-slate-700">
              {referent.ref_name}
            </p>
            <p className="text-gray-500">{referent.ref_firstname}</p>
          </div>
        </div>

        {/* Deuxième ligne : Détails */}
        <div className="flex flex-col gap-1 text-sm mb-3">
          {/* Matricule */}
          <p className="text-gray-700 font-medium">
            MATRICULE :{" "}
            <span className="font-normal">{referent.ref_matricule}</span>
          </p>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="text-purple-600 w-4 h-4" />
            <span className="text-gray-600">{referent.ref_email}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone className="text-purple-600 w-4 h-4" />
            <span className="text-gray-600">{referent.ref_phone}</span>
          </div>

          {/* Fonction */}
          {/* <div className="flex items-center gap-2">
            <User className="text-purple-600 w-4 h-4" />
            <span className="text-gray-600">{referent.ref_fonction}</span>
          </div> */}
        </div>

        {/* Troisième ligne : Actions */}
        <div className="flex justify-end gap-3 mt-auto">
          {/* <button
            className="p-2 rounded-full hover:bg-green-100 transition-colors cursor-pointer"
            title="Voir le CV"
          >
            <Eye className="text-green-600 w-5 h-5" />
          </button> */}

          <>
            <button
              onClick={() => {
                setShowReferent((p) => !p);
                setIdReferent(referent.idEmploye);
              }}
              className="p-2 rounded-full hover:bg-green-100 transition-colors cursor-pointer"
              title="Supprimer"
            >
              <Eye className="text-green-600 w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-yellow-100 transition-colors cursor-pointer"
              title="Modifier"
              onClick={() => {
                setShowEdit((p) => !p);
                setIdReferent(referent.idEmploye);
              }}
            >
              <Pen className="text-yellow-600 w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIdReferent(referent.idEmploye);
                setOpenModalDelete(true);
              }}
              className="p-2 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
              title="Supprimer"
            >
              <Trash2 className="text-red-600 w-5 h-5" />
            </button>
          </>
        </div>
      </div>
      {showEdit && (
        <ReferentEditEtp
          isOpen={showEdit}
          onClose={() => setShowEdit((p) => !p)}
          idReferent={idReferent}
          setReferent={setReferent}
          index={index}
        />
      )}
      {openModalDelete && (
        <ConfirmDeleteModal
          isOpen={openModalDelete}
          onClose={() => setOpenModalDelete(false)}
          onConfirm={handleDelete}
          idReferent={idReferent}
        />
      )}
      {showReferent && (
        <ShowReferentEtp
          idReferent={idReferent}
          onClose={() => setShowReferent(false)}
          isOpen={showReferent}
        />
      )}
    </>
  );
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, idReferent }) {
  if (!isOpen) return null; // Si le modal n'est pas ouvert, ne rien afficher

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Confirmer la suppression
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer{" "}
        </p>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(idReferent)}
            className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            <Trash2 size={16} className="mr-2" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
