import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { MoreVertical, Trash2, PenTool as Tool } from "lucide-react";
import axios from "../../config/axios";
import { Checkbox } from "../checkbox/checkbox-test-cfp";

// Composant pour les actions de gestion (Cfp, Formateur, EmployeCfp)
function QcmActionsForManager({ qcm, checked, handleChange, confirmDelete }) {
  return (
    <>
      <div className="flex items-center mb-4 space-x-2">
        <span className="text-sm font-medium text-gray-700">Statut :</span>
        <Checkbox checked={checked} onChange={handleChange} />
      </div>
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
        <Link
          to={`/formateur/testing/qcm/bareme/create/${qcm.idQCM}`}
          className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700"
        >
          <Tool className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Gérer les barèmes</span>
        </Link>
        <button
          type="button"
          onClick={() => confirmDelete(qcm.idQCM)}
          className="p-2 text-gray-400 transition-colors duration-200 rounded-full hover:text-red-500 hover:bg-gray-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

// Composant pour le dropdown des options
function QcmDropdownCfpFormateur({ qcm, isDropdownOpen, dropdownRef }) {
  if (!isDropdownOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg"
    >
      <Link
        to={`/formateur/testing/qcm/${qcm.idQCM}/edit`}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Mettre à jour
      </Link>
      <Link
        to={`/formateur/testing/qcm/show/${qcm.idQCM}`}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Voir les détails
      </Link>
      <Link
        to={`/formateur/testing/qcm/${qcm.idQCM}/list-apprenants/results`}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Voir les résultats
      </Link>
    </div>
  );
}
// Composant pour le dropdown des options

export function CardQcmFormateur({ qcm, onDeleteModalOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const [checked, setChecked] = useState(qcm.statut ?? false);

  const toggleDropdownQCM = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const confirmDelete = (qcmId) => {
    onDeleteModalOpen(qcmId);
  };

  const handleChange = async (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    try {
      const res = await axios.post(`/qcm/${qcm.idQCM}/update-status`, {
        statut: newChecked ? 1 : 0,
      });
      if (!res.data.success) {
        setChecked(!newChecked);
        alert("Erreur lors de la mise à jour");
      } else {
        alert("Statut mis à jour avec succès.");
      }
    } catch (err) {
      setChecked(!newChecked);
      alert(`Erreur : ${err}`);
    }
  };

  // Effets
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {qcm.intituleQCM}
          </h2>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleDropdownQCM}
              className="p-1 text-gray-400 transition-colors duration-200 rounded-full hover:text-gray-600 hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <QcmDropdownCfpFormateur
              qcm={qcm}
              isDropdownOpen={isDropdownOpen}
              dropdownRef={dropdownRef}
            />
          </div>
        </div>

        <div className="flex items-center mb-6 space-x-2">
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
            {qcm.prixUnitaire} Crédits
          </span>
        </div>

        {/* Actions selon le rôle */}
        <QcmActionsForManager
          qcm={qcm}
          checked={checked}
          handleChange={handleChange}
          confirmDelete={confirmDelete}
        />
      </div>
    </div>
  );
}
