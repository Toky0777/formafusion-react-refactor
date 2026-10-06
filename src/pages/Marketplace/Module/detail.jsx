import { useState, useEffect } from "react";
import { Star, MapPin, Phone, Mail, ChevronLeft } from "lucide-react";
import Preview from "./Preview";
import { useParams, Link } from "react-router-dom";
import Contact from "../Contact/Contact";
import Notice from "./Notice";
import Event from "./Event";
import DocumentationTabs from "../OtherInformation";
import { getThemeIcon } from "../../../utils/themeUtils";
import { getThemeColors } from "../../../utils/styleUtils";
import { IMAGE_URL } from "../../../config/env";

const CourseDetail = () => {
  const { moduleId } = useParams();
  const [activeTab, setActiveTab] = useState("apercu");
  const [tabContent, setTabContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [data, setData] = useState({
    modules: null,
    simularModules: [],
    noticeEmployee: null,
    moduleWithProject: null,
  });
  // Fetch module data
  useEffect(() => {
    const fetchModuleData = async () => {
      if (!moduleId) return;

      setLoading(true);
      try {
        const API_URL = `${API_URL}/marketplace/showCours/${moduleId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.error) {
          setError(responseData.error);
        } else {
          setData({
            modules: responseData.module || null,
            simularModules: responseData.simularModules || [],
            noticeEmployee: responseData.noticeEmployee || null,
            moduleWithProject: responseData.moduleWithProject || null,
          });

          if (responseData.success) {
            setSuccess(responseData.success);
          }
        }
      } catch (err) {
        setError(`Failed to load module data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId]);

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async () => {
    if (!data.modules?.idModule) return;

    try {
      setLoading(true);
      const API_URL = `${API_URL}/formation/exportPdf/${data.modules.idModule}`;
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Récupérer le blob PDF
      const blob = await response.blob();

      // Créer un URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob);

      // Créer un élément <a> temporaire pour déclencher le téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.download = `formation-${data.modules.moduleName || "module"}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess("PDF téléchargé avec succès!");
    } catch (err) {
      setError(`Erreur lors du téléchargement du PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch tab content
  const fetchTabContent = (tabName) => {
    setActiveTab(tabName);
    setLoading(true);

    try {
      let content = null;

      switch (tabName) {
        case "apercu":
          content = <Preview moduleId={moduleId} />;
          break;
        case "contact":
          content = <Contact customerId={data.modules?.idCustomer} />;
          break;
        case "avis":
          content = <Notice moduleId={moduleId} />;
          break;
        case "evenement":
          content = <Event moduleId={moduleId} />;
          break;
        case "autre":
          content = <DocumentationTabs customerId={data.modules?.idCustomer} />;
          break;
        default:
          content = (
            <div className="p-4 text-gray-600">
              Contenu pour l'onglet {tabName} sera chargé ici pour le module{" "}
              {moduleId}
            </div>
          );
      }

      setTabContent(content);
    } catch (err) {
      setTabContent(
        <div className="p-4 text-red-600">
          Erreur lors du chargement du contenu de l'onglet {tabName}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  // Load apercu tab on initial render
  useEffect(() => {
    if (moduleId) {
      fetchTabContent("apercu");
    }
  }, [moduleId]);

  // Render star rating based on average score
  const renderStars = (average) => {
    const stars = [];
    const avgRating = parseFloat(average) || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(avgRating + 0.5)) {
        stars.push(
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  };

  // Create tab button component to avoid repetition
  const TabButton = ({ name, label }) => (
    <button
      onClick={() => fetchTabContent(name)}
      className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
        activeTab === name
          ? "text-purple-600 border-b-2 border-purple-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  // If still loading initial data
  if (loading && !data.modules) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  // If there was an error loading data
  if (error && !data.modules) {
    return (
      <div className="p-6 m-4 text-red-700 bg-red-100 border border-red-400 rounded">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { modules, simularModules, noticeEmployee } = data;
  const themeIcon = modules?.module_image
    ? getThemeIcon(modules.module_image)
    : null;

  const IconComponent = themeIcon?.icon;

  const themeColors = getThemeColors();

  return (
    <main className="flex-grow">
      {/* Alert Messages */}
      {success && (
        <div className="px-4 py-3 mx-4 my-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="px-4 py-3 mx-4 my-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Hero Section with Background Image */}
      <div className="container relative overflow-hidden h-48 bg-white p-3">
        <div className="container mx-auto p-2">
          <Link
            className="inline-flex items-center mb-3 space-x-2 hover:underline"
            to="/cours"
          >
            <ChevronLeft />
            <p>Retour aux Cours</p>
          </Link>

          <div className="flex h-32 p-0.5">
            <div
              className={`w-28 ${themeIcon?.bg} flex items-center justify-center flex-shrink-0`}
            >
              {IconComponent && (
                <IconComponent className={`w-14 h-14 ${themeIcon?.color}`} />
              )}
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0 p-4">
              <div className="flex items-center mb-1">
                <span className="px-3 py-1 mr-3 text-sm font-medium bg-purple-600 text-white rounded-full">
                  {modules?.nomDomaine}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-white bg-gray-700 rounded-full">
                  {modules?.module_level_name}
                </span>
              </div>

              <h1 className="text-2xl font-medium md:text-3xl text-purple-600">
                {modules?.moduleName}
              </h1>

              <p className="mt-1 text-base">
                Proposé par{" "}
                <Link
                  className="underline"
                  to={`/cfp/detail/${modules?.idCustomer}`}
                >
                  {modules?.customerName}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column: Tabs */}
          <div className="lg:w-2/3">
            <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
              <div className="flex overflow-x-auto border-b">
                <TabButton name="apercu" label="Aperçu" />
                <TabButton name="avis" label="Avis" />
                <TabButton name="contact" label="Contact" />
                <TabButton name="evenement" label="Formations à venir" />
                <TabButton name="autre" label="Autre" />
              </div>
              <div className="p-6">
                {loading && activeTab !== "apercu" ? (
                  <div className="flex justify-center p-4">
                    <p>Chargement du contenu...</p>
                  </div>
                ) : (
                  tabContent
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Info Boxes */}
          <div className="lg:w-1/3">
            <div className="sticky space-y-6 top-4">
              {/* Quick Information */}
              <div className="p-4 space-y-3 bg-[#f1f5f9] rounded-xl border-[1px] border-dashed border-[#dee2e6] shadow-sm">
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading || !modules?.idModule}
                  className="w-full text-center"
                >
                  <p className="text-xl font-bold underline underline-offset-8 text-[#475569] hover:text-[#334155] disabled:opacity-50 disabled:cursor-not-allowed">
                    <i className="mr-2 text-xl fa-solid fa-download"></i>
                    {loading ? "Téléchargement..." : "Télécharger en PDF"}
                  </p>
                </button>
              </div>
              <div className="w-full p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4 text-2xl font-bold text-purple-600">
                  MGA {modules?.prix}
                </div>
                <Link to={`/devis/${modules?.idCustomer}/${modules?.idModule}`}>
                  <p className="w-full py-3 font-medium text-center text-white bg-purple-600 rounded-md hover:bg-purple-700">
                    Demander un Devis
                  </p>
                </Link>
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="mb-3 font-semibold text-gray-800">
                    Informations sur le Centre de Formation
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-600" size={14} />
                      <span className="text-gray-600">
                        {modules?.customer_addr_lot}
                        {modules?.customer_addr_quartier}, {modules?.ville_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-600" size={14} />
                      <span className="text-gray-600">
                        {modules?.customerPhone ?? "Pas de téléphone"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-gray-600" size={14} />
                      <span className="text-gray-600">
                        {modules?.customerEmail ?? "Pas d'email"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Courses */}
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  À Propos du Centre de Formation
                </h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-16 h-16 mr-4 overflow-hidden rounded-md">
                    <img
                      src={`${IMAGE_URL}/img/entreprises/${modules?.logo}`}
                      alt="Logo du centre"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {modules?.customerName}
                    </h4>
                    <p className="mb-2 text-sm text-gray-600">
                      {modules?.ville_name}
                    </p>
                    <Link
                      className="text-sm font-medium text-purple-600 hover:underline"
                      to={`/cfp/detail/${modules?.idCustomer}`}
                    >
                      Voir le Profil du Centre de Formation
                    </Link>
                  </div>
                </div>
              </div>

              {/* Student Testimonial */}
              {noticeEmployee && (
                <div className="p-6 rounded-lg shadow-md bg-purple-50">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Témoignage d'Étudiant
                  </h3>
                  <div className="mb-4 italic text-gray-600">
                    "{noticeEmployee.temoignage}"
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 mr-3 font-bold text-purple-700 bg-purple-200 rounded-full">
                      {noticeEmployee.employee
                        ? noticeEmployee.employee.charAt(0)
                        : "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {noticeEmployee.employee || "Anonyme"}
                      </p>
                      <div className="flex">
                        {renderStars(noticeEmployee.average)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchTabContent("avis")}
                    className="w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-white rounded-md hover:bg-gray-100"
                  >
                    Lire Tous les Avis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;
