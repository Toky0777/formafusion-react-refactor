import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios';
import { FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faAward,
  faCertificate,
  faShareAlt,
  faTasks,
  faLaptopCode,
  faCalendarAlt,
  faStar,
  faLink,
  faInfoCircle,
  faLightbulb,
  faShieldAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

function Verification() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  // Base URL for images
  const endpoint = 'https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg';

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/cfp/badge/attribution/badge-send/${code}`);

        if (response.data.status === 200) {
          setVerificationData(response.data);
          // console.log(response.data);

          setIsExpired(response.data.isExpired);
        } else {
          setError(response.data.message || "Erreur lors de la vérification");
        }
      } catch (err) {
        console.error('Erreur lors de la vérification:', err);
        setError(err.response?.data?.message || "Erreur lors de la vérification");
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationData();
  }, [code]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié dans le presse-papiers');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center p-4 text-indigo-600">
          <FaSpinner className="w-8 h-8 mr-3 animate-spin" />
          <span className="text-xl">Vérification en cours...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center bg-white shadow-lg rounded-xl">
          <div className="mb-6 text-6xl text-red-500">
            <FontAwesomeIcon icon={faCircleExclamation} />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Vérification échouée</h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <a href="/"
            className="inline-block px-6 py-3 font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 text-center text-gray-600">
          <p className="text-xl">Aucune donnée de vérification disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isExpired && (
            <div className="p-4 mb-6 border-l-4 border-yellow-400 bg-yellow-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faCircleExclamation} className="text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Attention:</span> Ce badge a expiré le {formatDate(verificationData.attribution.date_expiration)}.
                  </p>
                </div>
              </div>
            </div>
          )}


          <div className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">

            <div className='relative h-64 grid-pattern bg-gradient-to-r from-purple-600 to-indigo-500'>

              <div className="absolute transform -translate-x-1/2 -bottom-16 left-1/2">
                <div className="flex items-center justify-center w-32 h-32 bg-white border-4 border-white rounded-full shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-center w-24 h-24 bg-purple-600 rounded-full">
                    {verificationData.badge.image_path ? (
                      <img
                        src={`${endpoint}/${verificationData.badge.image_path}`}
                        alt={verificationData.badge.titre}
                        className="w-20 h-20 rounded-full object-contain"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faAward} className="text-4xl text-white" />
                    )}
                  </div>
                </div>
              </div>


              <div className="absolute p-2 bg-white rounded-lg shadow-md top-6 left-6 bg-opacity-90">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-xl text-purple-600" />
                  <span className="font-semibold text-purple-700">{verificationData.cfp.customerName}</span>
                </div>
              </div>


              <div className="absolute top-6 right-6">
                <button
                  className="flex items-center justify-center w-10 h-10 text-purple-600 transition-colors bg-white rounded-full shadow-md hover:bg-gray-50"
                  onClick={shareLink}>
                  <FontAwesomeIcon icon={faShareAlt} />
                </button>
              </div>
            </div>


            <div className="px-6 pt-20 pb-8">

              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">{verificationData.badge.titre}</h2>
                <p className="font-medium text-purple-600">{verificationData.badge.module_nom}</p>
              </div>


              <div className="flex justify-center mb-6">
                <div className="flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                  <span>Certifié le {formatDate(verificationData.attribution.date_attribution)}</span>
                </div>
              </div>

              {/* Badge Description */}
              {verificationData.badge.description && (
                <div className="max-w-2xl mx-auto mb-8 text-center text-gray-600">
                  <p>{verificationData.badge.description}</p>
                </div>
              )}


              {verificationData.criteres.length > 0 && (
                <div className="p-6 mb-8 bg-gray-50 rounded-xl">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-purple-700">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" />
                    <span>Critères d'Obtention</span>
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    {verificationData.criteres.map((critere, index) => (
                      <li key={index} className="flex items-start">
                        <FontAwesomeIcon icon={faCircleCheck} className="flex-shrink-0 mt-1 mr-3 text-purple-500" />
                        <span>{critere.texte_critere}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              {verificationData.competences.length > 0 && (
                <div className="mb-8">
                  <h3 className="flex items-center justify-center mb-4 text-lg font-semibold text-purple-700">
                    <FontAwesomeIcon icon={faLaptopCode} className="mr-2" />
                    <span>Compétences & Fonctionnalités</span>
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {verificationData.competences.map((competence, index) => (
                      <span key={index} className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
                        {competence.nom_competence}
                      </span>
                    ))}
                  </div>
                </div>
              )}


              <div className="flex flex-col items-center pt-8 mb-8 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Badge Attribué à</h3>
                {verificationData.apprenant.photo ? (
                  <img
                    src={`${endpoint}/img/employes/${verificationData.apprenant.photo}`}
                    alt={`${verificationData.apprenant.emp_name} ${verificationData.apprenant.emp_firstname}`}
                    className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://ui-avatars.com/api/?name=' +
                        encodeURIComponent(`${verificationData.apprenant.emp_name} ${verificationData.apprenant.emp_firstname}`);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 bg-gray-200 border-4 border-white rounded-full shadow-md">
                    <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
                  </div>
                )}
                <h4 className="mt-4 text-xl font-bold text-gray-800">
                  {verificationData.apprenant.emp_name} {verificationData.apprenant.emp_firstname}
                </h4>
                <p className="text-gray-600">Apprenant</p>
                <div className="flex items-center mt-4 text-purple-600">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  <span>Délivré le {formatDate(verificationData.attribution.date_attribution)}</span>
                </div>
                {verificationData.attribution.score && (
                  <div className="flex items-center px-3 py-1 mt-2 text-blue-700 bg-blue-100 rounded-full">
                    <FontAwesomeIcon icon={faStar} className="mr-2" />
                    <span>Score: {verificationData.attribution.score}/100</span>
                  </div>
                )}
              </div>


              <div className="flex flex-col items-center pt-6 mb-8 border-t border-gray-200">
                <h3 className="mb-2 text-gray-600 text-md">Dans le cadre du projet</h3>
                <p className="text-xl font-semibold text-gray-800">{verificationData.projet.project_title}</p>
                <div className="text-sm text-gray-500">{verificationData.projet.project_reference}</div>
              </div>


              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-4 text-purple-700">
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  <span className="font-medium">Identifiant unique: {verificationData.verification.code_verification}</span>
                </div>
                <div className="flex items-center px-8 py-3 font-medium text-purple-700 bg-purple-100 rounded-full">
                  <FontAwesomeIcon icon={faCertificate} className="mr-2" />
                  <span>Badge Authentique</span>
                </div>
              </div>
            </div>
          </div>


          <div className="p-6 bg-white shadow-md rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-purple-600" />
              <span>À propos de cette certification</span>
            </h3>
            <p className="mb-4 text-gray-600">
              Cette certification a été délivrée par {verificationData.cfp.customerName} et est vérifiable à tout moment
              grâce à son identifiant unique.
            </p>
            {verificationData.attribution.date_expiration && (
              <div className="p-4 mb-4 border-l-4 border-purple-500 rounded-r bg-purple-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon icon={faLightbulb} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-700">
                      Cette certification est valable jusqu'au {formatDate(verificationData.attribution.date_expiration)}.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Verification;