import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { Spinner } from "../../../components/ui/spinner";

export default function DetailsQcmCfp() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [qcms, setQcms] = useState({});

  const DataRequest = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/qcm/show/${id}`);
      setQcms(data.one_qcm);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    DataRequest();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen py-8 bg-gradient-to-r from-gray-50 via-gray-100 to-purple-50">
          <div className="container max-w-4xl p-4 mx-auto mt-20">
            <div className="p-8 transition-all duration-500 border shadow-2xl bg-white/10 backdrop-blur-sm rounded-3xl border-white/20 hover:shadow-3xl">
              {/* Header avec gradient */}
              <div className="p-8 mb-8 -m-8 text-white bg-purple-600 rounded-t-3xl">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
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
                  <div>
                    <h1 className="text-4xl font-bold leading-tight">
                      {qcms.intituleQCM}
                    </h1>
                    <div className="flex items-center mt-2 text-blue-100">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Date de Création:{" "}
                        {new Date(qcms.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cartes d'information */}
              <div className="grid gap-6 mb-8 md:grid-cols-2">
                <div className="p-6 text-white transition-all duration-300 transform bg-gray-600 rounded-2xl hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-6 h-6 mr-2"
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
                        <span className="text-xl font-medium opacity-90">
                          Prix
                        </span>
                      </div>
                      <p className="text-3xl font-bold">{qcms.prixUnitaire}</p>
                      <p className="text-sm opacity-75">Crédits</p>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                      <svg
                        className="w-8 h-8"
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
                  </div>
                </div>

                <div className="p-6 text-gray-600 transition-all duration-300 transform bg-white rounded-2xl hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-6 h-6 mr-2"
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
                        <span className="text-sm font-medium opacity-90">
                          Domaine de Formation
                        </span>
                      </div>
                      <p className="text-2xl font-bold leading-tight">
                        {qcms.domaine_formation?.nomDomaine}
                      </p>
                      <p className="text-sm opacity-75">Formation</p>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20">
                      <svg
                        className="w-8 h-8"
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
                  </div>
                </div>
              </div>

              {/* Section Description */}
              <div className="p-8 mb-8 bg-white border border-gray-100 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <svg
                      className="h-12 p-2 font-bold text-gray-800 border border-gray-800 rounded-full w-14"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Description
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg font-medium leading-relaxed text-gray-700">
                    {qcms.descriptionQCM}
                  </p>
                </div>
              </div>

              {/* Bouton de retour */}
              <div className="flex justify-center">
                <Link
                  to="/cfp/prequal"
                  className="relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform bg-blue-700 shadow-lg group rounded-2xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
                >
                  <svg
                    className="w-5 h-5 mr-3 transition-transform duration-300 transform group-hover:-translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:opacity-100 blur-xl -z-10"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
