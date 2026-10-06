import axios from "../../config/axios";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Composant pour les actions d'employé
function QcmActionsForEmployee({ qcm }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleTestClick = async () => {
    const formData = {
      user_id: user.id,
      qcm_id: qcm.idQCM,
      start_time: Date.now(),
      duration: qcm.duree,
    };

    try {
      await axios.post(`/qcm/solve/${qcm.idQCM}/start-test`, formData);
    } catch (error) {
      console.error("Error starting test:", error);
    }
    navigate(`/particulier/test/qcm/solve/${qcm.idQCM}/respond`);
  };
  return (
    <div className="pt-4 mt-auto border-t border-gray-100">
      <button
        type="button"
        aria-label="Faire le Test"
        onClick={handleTestClick}
        className="inline-flex items-center justify-center w-full px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700"
      >
        <span className="text-sm font-medium">Faire le Test</span>
      </button>
    </div>
  );
}

// Composant pour le dropdown des options
function QcmDropdownEmpReferent({ qcm, isDropdownOpen, dropdownRef }) {
  if (!isDropdownOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg"
    >
      <Link
        to={`/particulier/test/qcm/show/${qcm.idQCM}`}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Voir les détails
      </Link>
      <Link
        to={`/particulier/test/qcm/${qcm.idQCM}/list-apprenants/results`}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      >
        Voir les résultats
      </Link>
    </div>
  );
}

export function CardQcmEmploye({ qcm, onDeleteModalOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  // Détermine le type d'actions à afficher
  // const shouldShowManagerActions = canManageQcm();
  const shouldShowEmployeeActions = "Employe";

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
            {shouldShowEmployeeActions && (
              <QcmDropdownEmpReferent
                qcm={qcm}
                isDropdownOpen={isDropdownOpen}
                dropdownRef={dropdownRef}
              />
            )}
          </div>
        </div>

        <div className="flex items-center mb-6 space-x-2">
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full">
            {qcm.prixUnitaire} Crédits
          </span>
        </div>
        {shouldShowEmployeeActions && <QcmActionsForEmployee qcm={qcm} />}
      </div>
    </div>
  );
}
