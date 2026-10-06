import { Link, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "../../../config/axios";
import { formatDateFr, numberToHour } from "../../../utils/fonction";
import AlertMessage from "../../../components/Modals/AlertMessage";
import { Spinner } from "../../../components/ui/spinner";

export default function RapportFormateur() {
  const { id, idApprenant, idSession } = useParams();
  const [apprenant, setApprenant] = useState([]);
  const [date, setDate] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [qcm, setQcm] = useState({});
  const [categoriesQuestion, setCategoriesQuestion] = useState([]);
  const [scorePercentage, setScorePercentage] = useState(null);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  });

  const ApprenantRequest = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/qcm/${id}/apprenant/${idApprenant}/session/${idSession}/rapport`
      );
      setApprenant(response.data.apprenant);
      setDate(response.data.results.session_info);
      setCategoriesQuestion(response.data.results.categories);
      setResults(response.data.results);
      setScorePercentage(response.data.averagePercentage);
      setIsLoading(false);
      setQcm(response.data.qcm);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    ApprenantRequest();
  }, []);

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/qcm/${id}/apprenant/${idApprenant}/session/${idSession}/rapport/pdf`,
        {
          responseType: "blob", // important pour recevoir un fichier binaire
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-competances-${apprenant.name}_${
        apprenant.firstName ?? ""
      }.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
      setNotification({
        type: "success",
        message: "Téléchargement réussi.",
        show: true,
      });
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
      }, 2000);
    } catch (error) {
      setNotification({
        type: "error",
        message: `Erreur lors du téléchargement du PDF: ${error}`,
        show: true,
      });
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Spinner />}
      <AlertMessage
        type={notification.type}
        message={notification.message}
        visible={notification.show}
      />
      <div className="h-full py-4 bg-violet-50 sm:py-5">
        <div className="px-3 mx-auto max-w-7xl sm:px-10 lg:px-12">
          {/* Boutons d'action alignés à droite */}
          <div className="flex justify-end gap-4 mb-4">
            <Link
              to={`/formateur/testing/qcm/${id}/list-apprenants/results`}
              className="inline-flex items-center px-3 py-1 text-white transition rounded-lg shadow-md bg-violet-600 hover:bg-violet-700"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Retour
            </Link>

            <button
              onClick={downloadPdf}
              className="inline-flex items-center px-3 py-1 text-white transition rounded-lg shadow-md bg-violet-700 hover:bg-violet-800"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Télécharger PDF
            </button>
          </div>

          {/* Carte principale */}
          <div className="overflow-hidden bg-white shadow rounded-xl">
            <div className="p-5 sm:p-6">
              <h1 className="mb-10 text-xl font-bold sm:text-xl text-violet-900">
                Rapport de Compétences - {qcm.intituleQCM}
              </h1>

              {/* Informations générales */}
              <div className="p-2 mb-10 shadow bg-violet-50 rounded-xl">
                <h2 className="mb-6 text-xl font-semibold text-violet-800">
                  Informations Générales
                </h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="space-y-4">
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Nom :</span>
                      <span className="ml-2 text-gray-800">
                        {apprenant.name}
                      </span>
                    </p>
                    {apprenant.firstName && (
                      <p className="text-lg text-violet-700">
                        <span className="font-semibold">Prénom :</span>
                        <span className="ml-2 text-gray-800">
                          {apprenant.firstName}
                        </span>
                      </p>
                    )}
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Date du test :</span>
                      <span className="ml-2 text-gray-800">
                        {formatDateFr(date.date_debut)}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Points Maximum :</span>
                      <span className="ml-2 text-gray-800">
                        {results.max_points}
                      </span>
                    </p>
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Durée :</span>
                      <span className="ml-2 text-gray-800">
                        {numberToHour(date.duree)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tableau des catégories */}
              <div className="mb-10 overflow-x-auto">
                <table className="min-w-full divide-y divide-violet-200">
                  <thead className="bg-violet-600">
                    <tr>
                      <th className="px-3 py-2 text-lg font-semibold text-left text-white">
                        Catégorie
                      </th>
                      <th className="px-3 py-2 text-lg font-semibold text-left text-white">
                        Points Maximum
                      </th>
                      <th className="px-3 py-2 text-lg font-semibold text-left text-white">
                        Points Obtenus
                      </th>
                      <th className="px-3 py-2 text-lg font-semibold text-left text-white">
                        Pourcentages
                      </th>
                      <th className="px-3 py-2 text-lg font-semibold text-left text-white">
                        Critique
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-violet-100">
                    {Object.entries(categoriesQuestion).map(
                      ([categories, content]) => {
                        return (
                          <>
                            <tr
                              className="hover:bg-violet-50 transition-colors\"
                              key={categories}
                            >
                              <td className="px-6 py-4 text-lg text-gray-900">
                                {content.nom}
                              </td>
                              <td className="px-6 py-4 text-lg text-gray-600">
                                {content.points_max}
                              </td>
                              <td className="px-6 py-4 text-lg text-gray-600">
                                {content.points_obtenus}
                              </td>
                              <td className="px-6 py-4 text-lg text-gray-600">
                                {content.pourcentage}
                              </td>
                              <td className="px-6 py-4 text-lg text-gray-600">
                                {content.analyse?.description ??
                                  "Non disponible"}
                              </td>
                            </tr>
                          </>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Résumé global */}
              <div className="p-10 shadow-sm bg-violet-50 rounded-xl">
                <h2 className="mb-8 text-2xl font-semibold text-violet-800">
                  Résumé Global
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">
                        Total de Points Obtenus :
                      </span>
                      <br />
                      <span className="text-gray-800">
                        {results.total_points} / {results.max_points}
                      </span>
                    </p>
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Score Global :</span>
                      <br />
                      <span className="text-gray-800">{scorePercentage}%</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">
                        Moyenne des pourcentages :
                      </span>
                      <br />
                      <span className="text-gray-800">100%</span>
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-lg text-violet-700">
                      <span className="font-semibold">Analyse Globale :</span>
                      <br />
                      <span className="text-gray-400">Non disponible</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
