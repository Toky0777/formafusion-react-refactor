import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../../config/axios";
import { formatDate } from "../../../utils/TestdateUtils";
import { Spinner } from "../../../components/ui/spinner";

export default function InvitationDetails() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState({});
  const [employee, setEmployee] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const InvitationRequest = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/qcm/invitations/${id}`);
      setInvitation(data.invitation);
      setEmployee(data.employee);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    InvitationRequest();
  }, []);

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
      navigate(
        `/particulier/test/qcm/solve/${invitation.idInvitation.idQCM}/respond`
      );
    };
    return (
      <>
        <div className="gap-4 mt-4 ">
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
      </>
    );
  };
  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="p-8 mt-20 text-center md:p-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-6 font-serif text-3xl font-bold text-gray-800">
            Invitation au test
          </h2>

          <div className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="pt-2 text-2xl font-medium text-gray-900">
                  {invitation?.intituleQCM || "QCM Invitation"}
                </h3>
              </div>
              <div className="mb-6">
                <Link
                  className="px-10 py-4 text-white bg-blue-700 border-l-4 border-blue-700 rounded-lg hover:bg-blue-800"
                  to="/particulier/test/qcm/invitations-index"
                >
                  Retour
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-lg text-gray-700">
                Hello{" "}
                <span className="font-medium">{employee?.name || "Guest"}</span>
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
              <div className="p-4 mb-6 border-l-4 border-blue-500 bg-gray-50 rounded-xl">
                <p className="italic text-gray-600">
                  <span className="not-italic font-medium text-gray-700">
                    Message:{" "}
                  </span>
                  {invitation.message}
                </p>
              </div>
            )}

            <div className="grid gap-4 mb-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Valid from</p>
                <p className="font-medium text-gray-800">
                  {formatDate(invitation?.validFrom) || "16/04/2025 13:00"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Valid until</p>
                <p className="font-medium text-gray-800">
                  {formatDate(invitation?.validUntil) || "16/04/2025 16:00"}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-800">
                      {invitation?.duration || "12:00"}
                    </p>
                  </div>
                </div>
              </div>
              {invitation?.invitation_status == "pending" && (
                <ApprActionButton idInvitation={invitation} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
