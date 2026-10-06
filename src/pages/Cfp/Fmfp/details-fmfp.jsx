import {
  ChevronLeft,
  Calendar,
  Building,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { formatNumber } from "../../../utils/objectifs";
import { useAuth } from "../../../contexts/AuthContext";
import { getStatusFmfpColor, dateFormat } from "../../../utils/global";

export default function DetailsFmfp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { symbol } = useAuth();

  const { show } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await show(id);
        setDetails(res.fmfp);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, show]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400 italic text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="mx-auto p-6 max-w-6xl">
        <div className="mb-8 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center  py-1.5 rounded-full text-lg font-medium ">
              Projet n° {details.id}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  {details.type_fmfp}{" "}
                  <span className="text-xs">{details.ap_name || ""}</span>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">
                  {details.type_fmfp_description}
                </span>
              </div>
            </div>

            <div className="lg:text-right">
              <div className="inline-flex flex-col items-end p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Calendar size={18} />
                  <span className="font-medium uppercase tracking-wide text-xs">
                    Date de la demande
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {dateFormat(details.request_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">
                Statut
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusFmfpColor(
                  details.status_name
                )}`}
              >
                {details.status_name}
              </span>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">
                Financement
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Montant demandé</span>
                  <span className="text-gray-900 font-semibold">
                    {formatNumber(details.requested_amount)} {symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Montant approuvé</span>
                  <span className="text-gray-900">
                    {details.approved_amount
                      ? `${formatNumber(details.approved_amount)} ${symbol}`
                      : "En attente"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Période du projet */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Période du projet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Date de début
                </label>
                <p className="text-gray-900 mt-1">
                  {dateFormat(details.start_date)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Date de fin
                </label>
                <p className="text-gray-900 mt-1">
                  {dateFormat(details.end_date)}
                </p>
              </div>
            </div>
          </div>

          {details.module_name && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Formation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 font-medium mb-2">
                  {details.module_name}
                </p>
                <p className="text-gray-600 text-sm">
                  {details.module_description || "Aucune description"}
                </p>
              </div>
            </div>
          )}

          {/* Entreprise */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Entreprise
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 font-medium mb-1">
                {details.etp_name}
              </p>
              <p className="text-gray-600 text-sm">{details.etp_email}</p>
              {details.etp_phone && (
                <p className="text-gray-600 text-sm mt-1">
                  {details.etp_phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
