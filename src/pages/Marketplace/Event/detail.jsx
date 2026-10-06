import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../config/axios";
import { getThemeIcon } from "../../../utils/themeUtils";
import { IMAGE_URL } from "../../../config/env";

const EventDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState([]);

  const [placeAvailable, setPlaceAvailable] = useState(0);
  const [totalPlace, setTotalPlace] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/marketplace/showEvent/${projectId}`);

        setProject(response.data.project);
        setPlaceAvailable(response.data.placeAvailable);
        setTotalPlace(response.data.totalPlace);
      } catch (err) {
        setError(`Failed to load project data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const themeIcon = project?.module_image
    ? getThemeIcon(project.module_image)
    : null;

  const IconComponent = themeIcon?.icon;

  return (
    <>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <Link
                to="/"
                class="text-gray-500 hover:text-purple-600 text-sm transition-colors"
              >
                Retour aux Événements
              </Link>
            </li>
            <li class="text-gray-400">/</li>
            <li>
              <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {project.moduleName}
              </span>
            </li>
          </ol>
        </nav>
      </div>
      <section class="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="absolute inset-0">
          <div class="absolute top-10 left-10 w-20 h-20 bg-amber-400 rounded-full opacity-20 animate-pulse"></div>
          <div class="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div class="absolute bottom-20 left-1/3 w-12 h-12 bg-indigo-400 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 class="text-4xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                {project.moduleName}
                <span class="block text-amber-400">
                  {project.module_level_name}
                </span>
              </h1>
              <p class="text-xl mb-8 text-purple-100 leading-relaxed">
                Organisé par{" "}
                <span class="text-amber-400 font-semibold">
                  <Link
                    className="underline hover:text-white"
                    to={`/cfp/detail/${project.idCustomer}`}
                  >
                    {project.customerName}
                  </Link>
                </span>
              </p>
              <p class="text-lg mb-8 text-purple-100 leading-relaxed max-w-2xl">
                Trouvez le centre de formation idéal pour vos besoins à
                Madagascar.
              </p>
              <div class="flex flex-wrap gap-4 mb-8">
                <div class="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-clock w-6 h-6 text-amber-400 mr-3"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {project.dureeJ !== null ? (
                    <span className="text-sm font-medium">
                      {project.dureeJ} jours
                    </span>
                  ) : (
                    <span className="text-sm font-medium">
                      Jour non déterminé
                    </span>
                  )}
                </div>
                <div class="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-clock w-6 h-6 text-amber-400 mr-3"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {project.dureeH !== null ? (
                    <span className="text-sm font-medium">
                      {project.dureeH} heures
                    </span>
                  ) : (
                    <span className="text-sm font-medium">
                      Heure non déterminé
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div class="relative">
              <div className="overflow-hidden backdrop-blur-sm rounded-2xl">
                {IconComponent && (
                  <IconComponent className="w-1/3 h-1/3 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <main class="max-w-7xl mx-auto py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                À Propos de cet Événement
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="flex items-center p-4 bg-gray-100 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-calendar w-6 h-6 text-purple-600 mr-3"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-purple-600 font-medium">
                      Date début
                    </p>
                    <p class="text-lg font-semibold text-gray-900">
                      {project.dateDebut}
                    </p>
                  </div>
                </div>
                <div class="flex items-center p-4 bg-gray-100 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-clock w-6 h-6 text-purple-600 mr-3"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div>
                    <p class="text-sm text-purple-600 font-medium">Date fin</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {project.dateFin}
                    </p>
                  </div>
                </div>
                <div class="flex items-center p-4 bg-amber-50 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-map-pin w-6 h-6 text-amber-600 mr-3"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div>
                    <p class="text-sm text-amber-600 font-medium">Lieu</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {project.ville_name}
                    </p>
                  </div>
                </div>
                <div class="flex items-center p-4 bg-green-50 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-users w-6 h-6 text-green-600 mr-3"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <div>
                    <p class="text-sm text-green-600 font-medium">
                      Disponibilité
                    </p>
                    <p class="text-lg font-semibold text-gray-900">
                      {placeAvailable} sur {totalPlace} places
                    </p>
                  </div>
                </div>
              </div>
              <div class="prose prose-lg max-w-none">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                  Détails de l'Événement
                </h3>
                <p class="text-gray-700 mb-6 leading-relaxed">
                  Cet événement {project.moduleName}{" "}
                  <span className="uppercase">{project.module_level_name}</span>{" "}
                  aura lieu le {project.dateDebut} au {project.dateFin} à{" "}
                  {project.ville_name}. Avec nos experts partageant leurs
                  connaissances, c'est une excellente opportunité pour le
                  développement et le réseautage.
                </p>
                <p class="text-gray-700 mb-6 leading-relaxed">
                  L'événement est organisé par {project.customerName}, un
                  prestataire de formation de premier plan en{" "}
                  {project.moduleName}{" "}
                  <span className="uppercase">{project.module_level_name}</span>
                  . Il reste actuellement {placeAvailable} places disponibles
                  sur une capacité totale de {totalPlace}.
                </p>
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <div class="flex items-center mb-2">
                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <p class="text-amber-800 font-medium">
                      L'inscription anticipée est recommandée car les places
                      sont limitées et se remplissent rapidement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">
                À Propos de l'Organisateur
              </h3>
              <div class="flex items-start space-x-4">
                <div class="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src={`${IMAGE_URL}/img/entreprises/${project.logo}`}
                    alt=""
                    className="object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">
                    {project.customerName}
                  </h4>
                  <p class="text-gray-600 font-medium mb-3">
                    {project.ville_name}
                  </p>
                  <p class="text-gray-600 leading-relaxed mb-4">
                    {project.description_cfp}
                  </p>
                  <Link
                    to={`/cfp/detail/${project.idCustomer}`}
                    class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Voir le Profil de l'Organisateur →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-gray-600 mb-2">
                  MGA{" "}
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(project.prix)}
                </div>
                <p class="text-sm text-gray-600">Prix par participant</p>
              </div>
              <div class="space-y-4 mb-6">
                {placeAvailable > 0 ? (
                  <Link to={`/reservation/${project.idProjet}`}>
                    <button class="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                      Réserver des places
                    </button>
                  </Link>
                ) : (
                  <button class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                    Places indisponibles
                  </button>
                )}
                <button class="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-colors">
                  <Link to={`/devis/${project.idCustomer}/${project.idModule}`}>
                    Demander un Devis
                  </Link>
                </button>
              </div>
              <div class="text-center text-sm text-gray-600 mb-6">
                <p>
                  {placeAvailable} places restantes • Événement le{" "}
                  {project.dateDebut}
                </p>
              </div>
              <div class="border-t border-gray-100 pt-6">
                <h4 class="font-semibold text-gray-900 mb-4">
                  Informations sur l'événement
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-map-pin w-4 h-4 text-gray-400 mr-2"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="text-gray-600">{project.ville_name}</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-phone w-4 h-4 text-gray-400 mr-2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span class="text-gray-600">{project.customerPhone}</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-mail w-4 h-4 text-gray-400 mr-2"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <span class="text-gray-600">{project.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default EventDetailPage;
