import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../../config/axios";
import { TablePaginator } from "../../../../components/tabs/TablePaginator";
import { Spinner } from "../../../../components/ui/spinner";
import AlertMessage from "../../../../components/Modals/AlertMessage";
import { ArrowLeft, Plus } from "lucide-react";

// Composant Modal pour les détails de campagne
function CampaignDetailsModal({ campaign, isOpen, onClose }) {
  const [openPage, setOpenPage] = useState({ details: "campaign", data: {} });
  const [invitation, setInvitation] = useState({});
  const [employee, setEmployee] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Déplacer useEffect à l'extérieur de la condition
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (openPage.data.invitation) {
        setIsLoading(true);
        setInvitation(openPage.data.invitation);
        try {
          const { data } = await axios.get(
            `/qcm/invitation/${invitation.idInvitation}`
          );
          setEmployee(data.QcmInvitCamp.original);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEmployeeData();
  }, [invitation.idInvitation, openPage.data.invitation]); // Dépendances du useEffect

  if (!isOpen || !campaign) return null;
  if (isLoading) return <Spinner />;
  return openPage.details == "campaign" ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-5xl mx-4 bg-white border-0 rounded-3xl shadow-2xl max-h-[90vh] animate-slideUp overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Détails de la Campagne
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Informations complètes et invitations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 text-gray-400 transition-all duration-200 bg-white rounded-full shadow-md hover:text-gray-600 hover:shadow-lg hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="relative flex-auto p-8 overflow-auto bg-gradient-to-br from-white to-gray-50">
          <div className="space-y-8">
            {/* Campaign Info Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Nom de la Campagne
                  </h4>
                </div>
                <p className="font-medium text-gray-700">{campaign.name}</p>
              </div>

              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Créé par</h4>
                </div>
                <p className="font-medium text-gray-700">
                  {campaign.creator?.firstName || "Inconnu"}
                </p>
              </div>

              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Total Invitations
                  </h4>
                </div>
                <p className="font-medium text-gray-700">
                  {campaign.invitations?.length || 0}
                </p>
              </div>

              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-xl">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Crédits</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Total:{" "}
                    <span className="font-medium text-gray-900">
                      {campaign.totalCredits || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-green-600">
                    Payés:{" "}
                    <span className="font-medium">
                      {campaign.paidCredits} crédits
                    </span>
                  </p>
                  <p className="text-sm text-blue-600">
                    Restants:{" "}
                    <span className="font-medium">
                      {campaign.remainingCredits} crédits
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Date de création
                  </h4>
                </div>
                <p className="font-medium text-gray-700">
                  {campaign.created_date}
                </p>
              </div>

              {campaign.description && (
                <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900">Description</h4>
                  </div>
                  <p className="text-gray-700">{campaign.description}</p>
                </div>
              )}
            </div>

            {campaign.invitations && campaign.invitations.length > 0 && (
              <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Détails des Invitations
                    </h3>
                    <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                      {campaign.invitations.length} invitation
                      {campaign.invitations.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-8 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Employé
                        </th>
                        <th className="px-8 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          QCM
                        </th>
                        <th className="px-8 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Crédits
                        </th>
                        <th className="px-8 py-4 text-sm font-semibold tracking-wider text-left text-gray-700 uppercase">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {campaign.invitations.map((invitation, index) => (
                        <tr
                          key={index}
                          className="transition-colors duration-150 hover:bg-gray-50"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                                  <span className="text-sm font-semibold text-indigo-700">
                                    {(invitation.employee_campagne.name?.[0] ||
                                      "") +
                                      (invitation.employee_campagne
                                        .firstName?.[0] || "")}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {invitation.employee_campagne.name +
                                    " " +
                                    invitation.employee_campagne.firstName ||
                                    "N/A"}
                                </p>
                                <button
                                  className="inline-flex items-center gap-1 mt-1 text-xs text-indigo-600 transition-colors duration-150 hover:text-indigo-800"
                                  onClick={() =>
                                    setOpenPage({
                                      details: "invitation",
                                      data: { invitation },
                                    })
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512"
                                    className="w-3 h-3"
                                    fill="currentColor"
                                  >
                                    <path d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm64 80c0 8.8 7.2 16 16 16l224 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L80 128c-8.8 0-16 7.2-16 16zm16 80c-8.8 0-16 7.2-16 16s7.2 16 16 16l224 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L80 224zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16l128 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L80 320z"></path>
                                  </svg>
                                  Voir détails
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-medium text-gray-900">
                              {invitation.qcm.intituleQCM || "N/A"}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-medium text-gray-900">
                              {campaign.remainingCredits || "N/A"}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                invitation.Status === "completed" ||
                                invitation.status === "completed"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : invitation.Status === "pending" ||
                                    invitation.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {invitation.Status === "completed" ||
                              invitation.status === "completed" ? (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : invitation.Status === "pending" ||
                                invitation.status === "pending" ? (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                              {invitation.Status || invitation.status || "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl mx-6 my-6">
        <div className="relative flex flex-col w-full overflow-hidden bg-white border-0 shadow-2xl rounded-3xl animate-slideUp">
          {/* Modal Header */}
          <div className="flex items-start justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenPage({ details: "campaign", data: {} })}
                className="flex items-center justify-center w-10 h-10 text-gray-600 transition-all duration-200 bg-white rounded-full shadow-md hover:text-gray-800 hover:shadow-lg hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Détails de l'Invitation
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Informations employé et entreprise
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpenPage({ details: "campaign", data: {} })}
              className="flex items-center justify-center w-10 h-10 text-gray-400 transition-all duration-200 bg-white rounded-full shadow-md hover:text-gray-600 hover:shadow-lg hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="relative flex-auto p-8 overflow-auto max-h-96 bg-gradient-to-br from-white to-gray-50">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Employee Information */}
              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Informations Employé
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Nom complet
                    </label>
                    <p className="mt-1 font-semibold text-gray-900">
                      {employee.employe_nom} {employee.employe_prenom}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Email
                    </label>
                    <p className="mt-1 font-medium text-gray-900">
                      {employee.employe_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Informations Entreprise
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Entreprise
                    </label>
                    <p className="mt-1 font-semibold text-gray-900">
                      {employee.nom_entreprise}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Email Employeur
                    </label>
                    <p className="mt-1 font-medium text-gray-900">
                      {employee.employeur_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credits Information */}
              <div className="p-6 transition-shadow duration-200 bg-white border border-gray-100 shadow-sm md:col-span-2 rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Informations Crédits
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Montant crédits
                    </label>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      {employee.credits} crédits
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                      Statut de paiement
                    </label>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          employee.payment_status === "paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : employee.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {employee.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignListCfp() {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // États pour le modal
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CampagneRequest = async () => {
    setIsLoading(true);
    await axios
      .get(`/qcm/invitation/cfp/campaign`)
      .then(({ data }) => {
        const campaignsWithActions = data.campaigns.map((item, index) => ({
          ...item,
          actions: <Actions key={index} campagne={item} />,
        }));
        setDatas(campaignsWithActions);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.response?.data);
      });
  };

  // Fonction modifiée pour ouvrir le modal avec les détails de la campagne
  const actionButtonModal = (campagne) => {
    console.log("Campagne sélectionnée:", campagne);

    // Parsing des données si elles sont dans l'attribut data-modal-content

    setSelectedCampaign(campagne);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const removeCampagne = async (e, id) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(`/qcm/invit-camp/${id}`);

      // Mettre à jour les données
      setDatas((prevDatas) =>
        prevDatas.filter((campagne) => campagne.idInvitCamp !== id)
      );

      // Afficher notification de succès
      setNotification({
        show: true,
        message: "Campagne supprimée avec succès",
        type: "success",
      });

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setNotification({
        show: true,
        message: "Erreur lors de la suppression de la campagne",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      setIsLoading(false);
    }
  };

  const Actions = ({ campagne }) => {
    return (
      <div className="inline-flex items-center gap-2">
        {/* Button for campaign details */}
        <button
          onClick={() => actionButtonModal(campagne)}
          className="flex items-center justify-center text-gray-500 transition-all duration-200 border border-gray-200 group w-9 h-9 bg-gray-50 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md hover:scale-105"
          title="Voir les détails"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Button for deleting campaign */}
        <form onSubmit={(e) => removeCampagne(e, campagne.idInvitCamp)}>
          <button
            type="submit"
            className="flex items-center justify-center text-gray-500 transition-all duration-200 border border-gray-200 group w-9 h-9 bg-gray-50 rounded-xl hover:text-red-600 hover:bg-red-50 hover:border-red-200 hover:shadow-md hover:scale-105"
            title="Supprimer la campagne"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    );
  };

  useEffect(() => {
    CampagneRequest();
    sessionStorage.removeItem("valid_from");
    sessionStorage.removeItem("valid_until");
  }, []);

  const columns = ["Campagne", "Date de création", "Actions"];
  const dataNames = ["name", "created_date", "actions"];
  if (isLoading) return <Spinner />;
  console.log(selectedCampaign);
  return (
    <>
      <div className="min-h-[110vh] relative overflow-hidden">
        <AlertMessage
          type={notification.type}
          message={notification.message}
          visible={notification.show}
        />

        {/* Main Content */}
        <div className="relative px-6 mx-auto max-w-7xl">
          {/* Action Buttons en haut à droite */}
          <div className="flex justify-end gap-4 mt-6">
            <Link
              to="/cfp/prequal"
              className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Link>

            <Link
              to="/cfp/prequal/qcm/campaign/create-1"
              className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl hover:border-indigo-200 hover:text-indigo-600"
            >
              <Plus className="w-5 h-5 text-indigo-600" />
              Créer une campagne
            </Link>

            <Link
              to="/cfp/prequal/qcm/invitation/create"
              className="flex items-center gap-2 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl hover:border-indigo-200 hover:text-indigo-600"
            >
              <Plus className="w-5 h-5 text-indigo-600" />
              Créer une invitation
            </Link>
          </div>

          {/* Table Container */}
          <div className="mt-8 mb-12 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Campagnes Actives
                  </h2>
                  <p className="text-sm text-gray-600">
                    Gérez vos campagnes et leurs invitations
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <TablePaginator
                dataNames={dataNames}
                columns={columns}
                datas={datas}
              />
            </div>
          </div>
        </div>

        {/* Modal pour les détails de campagne */}
        <CampaignDetailsModal
          campaign={selectedCampaign}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </>
  );
}
