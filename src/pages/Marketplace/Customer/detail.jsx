import { useState, useEffect } from "react";
import { Star, MapPin, Phone, Mail, ChevronLeft } from "lucide-react";
import Preview from "./Preview";
import { Link, useParams } from "react-router-dom";
import Contact from "../Contact/Contact";
import Course from "./Course";
import Notice from "./Notice";
import Event from "./Event";
import DocumentationTabs from "../OtherInformation";
import { IMAGE_URL } from "../../../config/env";

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [activeTab, setActiveTab] = useState("apercu");
  const [tabContent, setTabContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [data, setData] = useState({
    customer: null,
    notice: null,
    modules: [],
    noticeEmployee: null,
    moduleWithProject: null,
  });

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const API_URL = `${API_URL}/marketplace/customer/show/${customerId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.error) {
          setError(responseData.error);
        } else {
          setData({
            customer: responseData.customer || {},
            notice: responseData.notice || { average: 0, total: 0 },
            modules: responseData.modules || [],
            noticeEmployee: responseData.noticeEmployee || null,
            moduleWithProject: responseData.moduleWithProject || null,
          });

          if (responseData.success) {
            setSuccess(responseData.success);
          }
        }
      } catch (err) {
        setError(`Failed to load customer data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  // Function to fetch tab content
  const fetchTabContent = async (tabName) => {
    setActiveTab(tabName);
    setLoading(true);

    try {
      if (tabName === "apercu") {
        setTabContent(<Preview customerId={customerId} />);
      } else if (tabName == "contact") {
        setTabContent(<Contact customerId={customerId} />);
      } else if (tabName == "cours") {
        setTabContent(<Course customerId={customerId} />);
      } else if (tabName == "avis") {
        setTabContent(<Notice customerId={customerId} />);
      } else if (tabName == "evenement") {
        setTabContent(<Event customerId={customerId} />);
      } else if (tabName == "autre") {
        setTabContent(<DocumentationTabs customerId={customerId} />);
      } else {
        // This would be an actual API call in production
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: `Content for ${tabName} tab would be loaded here for customer ${customerId}`,
            });
          }, 300);
        });
        setTabContent(response.data);
      }
    } catch (err) {
      setTabContent(`Error loading ${tabName} content`);
    } finally {
      setLoading(false);
    }
  };

  // Load apercu tab on initial render (with proper dependency array)
  useEffect(() => {
    fetchTabContent("apercu");
  }, [customerId]); // Only re-run when customerId changes

  // Render star rating based on average score
  const renderStars = (average) => {
    const stars = [];
    const avgRating = average || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(avgRating + 0.4)) {
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
      className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === name
        ? "text-purple-600 border-b-2 border-purple-600"
        : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {label}
    </button>
  );

  // If still loading initial data
  if (loading && !data.customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  // If there was an error loading data
  if (error && !data.customer) {
    return (
      <div className="p-6 text-red-700 bg-red-100 border border-red-400 rounded">
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

  const { customer, notice, modules, noticeEmployee } = data;

  return (
    <main className="flex-grow">
      {/* Alert Messages */}
      {success && (
        <div className="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Hero Section with Background Image */}
      <div className="container px-4 py-8 mx-auto bg-gray-50">
        <div className="relative overflow-hidden h-80 md:h-96">
          {customer?.logo ? (
            <img
              src={`${IMAGE_URL}/img/entreprises/${customer.logo}`}
              alt={customer.customerName || "Customer"}
              className="object-fill w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-300">
              <p className="text-gray-500">Image non disponible</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <Link
                className="inline-flex items-center mb-4 space-x-2 hover:underline"
                to={"/cfp"}
              >
                <ChevronLeft className="text-white" />
                <p className="text-white">Retour aux centres des formations</p>
              </Link>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {renderStars(notice?.average)}
                  <span className="ml-2 text-sm">
                    ({notice?.total || 0} avis)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {customer?.customerName || "Nom de l'entreprise"}
              </h1>
              <p className="max-w-3xl mt-2 text-lg text-gray-100">
                {customer?.description || "Aucune description disponible"}
              </p>
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
                  <TabButton name="cours" label="Cours" />
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
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Informations Rapides
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-purple-600" size={16} />
                      <span className="text-gray-600">
                        {customer?.customer_addr_lot ? (
                          <>
                            {customer.customer_addr_lot}{" "}
                            {customer.customer_addr_quartier},{" "}
                            {customer.ville_name}
                          </>
                        ) : (
                          "Pas d'adresse"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-purple-600" size={16} />
                      <span className="text-gray-600">
                        {customer?.customerPhone || "Pas de téléphone"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-purple-600" size={16} />
                      <span className="text-gray-600">
                        {customer?.customerEmail || "Pas d'email"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured Courses */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Cours en Vedette
                  </h3>
                  {modules && modules.length > 0 ? (
                    <div className="space-y-4">
                      {modules.map((module) => (
                        <div
                          key={module.idModule}
                          className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <Link
                            to={`/cours/detail/${module.idModule}`}
                            className="font-medium text-gray-800 hover:text-purple-600"
                          >
                            {module.moduleName}
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            {module.dateDebut && (
                              <span className="text-sm text-gray-500">
                                {module.dateDebut}
                              </span>
                            )}
                            <span className="font-medium text-purple-600">
                              {module.prix ? `MGA ${module.prix}` : "Gratuit"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Aucun cours disponible pour le moment
                    </p>
                  )}
                  {modules && modules.length > 0 && (
                    <button
                      onClick={() => fetchTabContent("cours")}
                      className="w-full px-4 py-2 mt-4 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Voir Tous les Cours
                    </button>
                  )}
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
                          ? noticeEmployee.employee[0]
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
      </div>
    </main>
  );
};

export default CustomerDetail;
