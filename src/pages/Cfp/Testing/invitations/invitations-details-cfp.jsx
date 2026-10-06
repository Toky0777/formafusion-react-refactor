import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";
import { formatDate } from "../../../../utils/TestdateUtils";

export default function InvitationDetailsModal({ isOpen, onClose, id }) {
  console.log("isOpen" + isOpen);
  console.log("id" + id);
  const [invitation, setInvitation] = useState({});
  const [employee, setEmployee] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const InvitationRequest = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/qcm/invitations/${id}`);
      setInvitation(data.invitation);
      console.log(data.invitation);
      setEmployee(data.employee);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      InvitationRequest();
    }
  }, [isOpen, id]);

  // Gestion de la fermeture avec l'échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Empêcher le scroll du body
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const ApprActionButton = (invitation) => {
    const handleNavigateToTest = () => {
      sessionStorage.setItem(
        "idInvitation",
        invitation.idInvitation.idInvitation || null
      );
      sessionStorage.setItem(
        "campId",
        invitation.idInvitation.idInvitCamp || null
      );
      navigate(`/qcm/solve/${invitation.idInvitation.idQCM}/respond`);
      onClose(); // Fermer la modal après navigation
    };

    return (
      <div className="gap-4 mt-4">
        <button
          onClick={handleNavigateToTest}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white transition-all duration-300 bg-purple-700 border border-gray-200 shadow-lg group rounded-2xl hover:shadow-xl hover:border-indigo-200 hover:scale-105 hover:-translate-y-1 hover:text-white"
          title="Faire le test"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Faire le test
        </button>
      </div>
    );
  };

  if (!isOpen) return null;
  console.log(invitation);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white rounded-full shadow-lg hover:shadow-xl"
          title="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Contenu modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 scale-100 opacity-100">
          {/* Overlay loading */}
          {isLoading && <Spinner />}

          {!isLoading && (
            <>
              <h2 className="mb-6 font-serif text-3xl font-bold text-gray-800">
                Invitation au test
              </h2>

              <div className="p-6 transition-all duration-300 bg-gray-50 border border-gray-100 shadow-sm rounded-2xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-left">
                    <h3 className="pt-2 text-2xl font-medium text-gray-900">
                      {invitation?.intituleQCM || "QCM Invitation"}
                    </h3>
                  </div>
                </div>

                <div className="mb-6 text-left">
                  <p className="mb-2 text-lg text-gray-700">
                    Hello{" "}
                    <span className="font-medium">
                      {employee?.name || "Guest"}
                    </span>
                    ,
                  </p>
                  <p className="text-gray-600">
                    You have been invited to take the QCM:
                    <span className="ml-1 font-semibold text-gray-800">
                      {invitation?.intituleQCM || ""}
                    </span>
                  </p>
                </div>

                {invitation?.message && (
                  <div className="p-4 mb-6 border-l-4 border-blue-500 bg-white rounded-xl">
                    <p className="italic text-gray-600 text-left">
                      <span className="not-italic font-medium text-gray-700">
                        Message:{" "}
                      </span>
                      {invitation.message}
                    </p>
                  </div>
                )}

                <div className="grid gap-4 mb-6 md:grid-cols-2">
                  <div className="space-y-2 text-left">
                    <p className="text-sm text-gray-500">Valid from</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(invitation?.validFrom) || "16/04/2025 13:00"}
                    </p>
                  </div>
                  <div className="space-y-2 text-left">
                    <p className="text-sm text-gray-500">Valid until</p>
                    <p className="font-medium text-gray-800">
                      {formatDate(invitation?.validUntil) || "16/04/2025 16:00"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-800">
                        {invitation?.duration || "12:00"}
                      </p>
                    </div>

                    {/* Bouton d’action */}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                <Link
                  className="px-6 py-3 text-white bg-blue-700 border border-blue-700 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                  to="/cfp/prequal/qcm/invitations-index"
                  onClick={handleClose}
                >
                  Retour aux invitations
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
