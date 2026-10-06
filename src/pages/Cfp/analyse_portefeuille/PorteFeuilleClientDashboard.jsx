import { useState, useEffect, useRef } from 'react';
import ClientGrid from './ClientGrid';
import SettingsPanel from './SettingsPanel';
import HeaderPorteFeuil from './HeaderPorteFeuil';
import { frequencyConfig, getRecommendedAction, logoImages } from './data/clientData';
import axios from '../../../config/axios';
import { Search, X, Filter } from 'lucide-react';

const PorteFeuilleClientDashboard = () => {
  const [displaySettings, setDisplaySettings] = useState({
    ranking: true,
    frequency: true,
    'frequency-stats': true,
    actions: true,
    kpi: true,
    'ca-chart': true,
    'learners-chart': true,
    'revenue-distribution': true,
    'learners-distribution': true
  });

  const [clientData, setClientData] = useState([]);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // 🔍 ÉTATS POUR LA RECHERCHE
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minRevenue: '',
    minLearners: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const loaderRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // ✅ Fonctions de transformation des données
  function transformRevenueData(dataArray = []) {
    const labels = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const current_year = labels.map((_, i) => {
      const item = dataArray.find(d => Number(d.month) === i + 1);
      return item ? Number(item.totalCA) || 0 : 0;
    });

    const previous_year = Array(12).fill(0);
    const total_current_year = current_year.reduce((sum, val) => sum + val, 0);
    const total_previous_year = previous_year.reduce((sum, val) => sum + val, 0);

    const formatEuro = val => {
      if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M€`;
      if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k€`;
      return `${val}€`;
    };

    return {
      labels,
      current_year,
      total_current_year,
      total_previous_year,
      current_year_formatted: current_year.map(formatEuro),
      previous_year_formatted: previous_year.map(formatEuro)
    };
  }

  function transformLearnerData(dataArray = []) {
    const labels = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"
    ];

    const current_year = labels.map((_, i) => {
      const item = dataArray.find(d => Number(d.month) === i + 1);
      return item ? Number(item.total_employe) || 0 : 0;
    });

    const previous_year = Array(12).fill(0);
    const total_current_year = current_year.reduce((sum, val) => sum + val, 0);
    const total_previous_year = previous_year.reduce((sum, val) => sum + val, 0);

    const formatEuro = val => {
      if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M€`;
      if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k€`;
      return `${val}€`;
    };

    return {
      labels,
      current_year,
      total_current_year,
      total_previous_year,
      current_year_formatted: current_year.map(formatEuro),
      previous_year_formatted: previous_year.map(formatEuro)
    };
  }

  // ✅ FONCTION PRINCIPALE DE CHARGEMENT
  const fetchDataClient = async (pageNumber = 1, search = '', filterParams = {}) => {
    if (loading) return;
    
    console.log('📤 Appel API avec:', { pageNumber, search, filterParams });
    setLoading(true);
    setError(null);

    try {
      // Construction des paramètres
      const params = {
        page: pageNumber.toString(),
      };

      if (search && search.trim()) {
        params.q = search.trim();
      }

      if (filterParams.location) {
        params.location = filterParams.location;
      }
      if (filterParams.type) {
        params.type = filterParams.type;
      }
      if (filterParams.minRevenue) {
        params.minRevenue = filterParams.minRevenue;
      }
      if (filterParams.minLearners) {
        params.minLearners = filterParams.minLearners;
      }

      console.log('📤 Paramètres envoyés:', params);

      const response = await axios.get('cfp/client_portefeuille', { params });
      
      console.log('📥 Réponse reçue:', {
        status: response.status,
        dataCount: response.data.data?.length || 0,
        currentPage: response.data.current_page,
        lastPage: response.data.last_page
      });

      const clients = response.data.data || [];
      const currentPage = response.data.current_page;
      const lastPage = response.data.last_page;

      const formattedClients = clients.map(client => {
        const info = client.client_info || {};
        const charts_data = client.charts_data || {};
        const nbjourDernierProject = client.nbjourDernierProject || {};

        const charDataTransformated = {
          revenue_evolution: transformRevenueData(charts_data.revenue_current),
          learners_evolution: transformLearnerData(charts_data.learners_current),
        };

        // ✅ Calculs des sommes et évolutions
        const sumCaPrev = charts_data.revenue_previous?.reduce(
          (sum, item) => sum + Number(item.totalCA || 0),
          0
        ) || 0;

        const sumCaCurrent = charts_data.revenue_current?.reduce(
          (sum, item) => sum + Number(item.totalCA || 0),
          0
        ) || 0;

        const sumLearnerPrev = charts_data.learners_previous?.reduce(
          (sum, item) => sum + Number(item.total_employe || 0),
          0
        ) || 0;

        const sumLearnerCurrent = charts_data.learners_current?.reduce(
          (sum, item) => sum + Number(item.total_employe || 0),
          0
        ) || 0;

        const evolutionCa =
          sumCaPrev === 0
            ? sumCaCurrent > 0
              ? 100
              : 0
            : ((sumCaCurrent - sumCaPrev) / sumCaPrev) * 100;

        const evolutionLearner =
          sumLearnerPrev === 0
            ? sumLearnerCurrent > 0
              ? 100
              : 0
            : ((sumLearnerCurrent - sumLearnerPrev) / sumLearnerPrev) * 100;

        const evolutionCaRounded = Number(evolutionCa.toFixed(2));
        const evolutionLearnerRounded = Number(evolutionLearner.toFixed(2));

        return {
          id: info.id_etp,
          name: info.etp_name,
          location: info.etp_ville,
          frequency: client.frequency,
          projectsPerYear: client.nb_projects,
          lastTrainingDays: nbjourDernierProject.nbjourDernier,
          ca2025: client.total_ca,
          learners: client.nbrapprenant,
          ranking: client.ranking,
          email: info.etp_email,
          phone: info.etp_phone || "",
          type: info.type_etp_desc,
          logo: info.etp_logo,
          regulation: client.regulation,
          charts_data: charDataTransformated,
          caEvolution: evolutionCaRounded,
          learnersEvolution: evolutionLearnerRounded
        };
      });

      if (pageNumber === 1) {
        setClientData(formattedClients);
      } else {
        setClientData(prev => [...prev, ...formattedClients]);
      }

      setHasMore(currentPage < lastPage);
      
    } catch (error) {
      console.error("❌ Erreur API:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 EFFET PRINCIPAL POUR LA RECHERCHE
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      console.log('🔍 Lancement recherche:', { 
        searchTerm, 
        filters,
        page: 1 
      });
      
      setPage(1);
      setClientData([]);
      fetchDataClient(1, searchTerm, filters);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filters]);

  // 🔍 GESTIONNAIRE DE CHANGEMENT DE RECHERCHE
  const handleSearchChange = (term) => {
    console.log('⌨️ Changement recherche:', term);
    setSearchTerm(term);
  };

  // 🔍 GESTIONNAIRE DE CHANGEMENT DES FILTRES
  const handleFiltersChange = (newFilters) => {
    console.log('⚙️ Changement filtres:', newFilters);
    setFilters(newFilters);
  };

  // 🔍 RÉINITIALISER LA RECHERCHE
  const handleResetSearch = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      type: '',
      minRevenue: '',
      minLearners: ''
    });
    setPage(1);
    setClientData([]);
    fetchDataClient(1);
  };

  // ✅ Premier chargement
  useEffect(() => {
    console.log('🚀 Premier chargement');
    fetchDataClient(1);
  }, []);

  // ✅ Gestion des préférences
  useEffect(() => {
    const saved = localStorage.getItem('clientDashboardSettings');
    if (saved) {
      try {
        setDisplaySettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur lors du chargement des paramètres:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clientDashboardSettings', JSON.stringify(displaySettings));
  }, [displaySettings]);

  const toggleSetting = (setting) => {
    setDisplaySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const resetSettings = () => {
    setDisplaySettings({
      ranking: true,
      frequency: true,
      'frequency-stats': true,
      actions: true,
      kpi: true,
      'ca-chart': true,
      'learners-chart': true,
      'revenue-distribution': true,
      'learners-distribution': true
    });
  };

  // ✅ Rafraîchir les données
  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    setSearchTerm('');
    setFilters({
      location: '',
      type: '',
      minRevenue: '',
      minLearners: ''
    });
    fetchDataClient(1);
  };

  // ✅ Intersection Observer (Infinite Scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  // ✅ Charge la page suivante quand `page` change
  useEffect(() => {
    if (page > 1) {
  
      fetchDataClient(page, searchTerm, filters);
    }
  }, [page]);

  // Nettoyer le timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-5 font-['Segoe_UI']">
      <HeaderPorteFeuil onRefresh={handleRefresh} />

      {/* 🔍 BARRE DE RECHERCHE ET FILTRES */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Barre de recherche */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un client, entreprise, ville..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('⌨️ Input change:', e.target.value);
                  handleSearchChange(e.target.value);
                }}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Bouton Filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white shadow-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtres
            {Object.values(filters).filter(Boolean).length > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <ClientFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}

        {/* Indicateur de recherche active */}
        {(searchTerm || Object.values(filters).some(Boolean)) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                {loading ? 'Recherche en cours...' : `Recherche active • ${clientData.length} client(s) trouvé(s)`}
                {searchTerm && ` pour "${searchTerm}"`}
              </div>
              <button
                onClick={handleResetSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Tout effacer
              </button>
            </div>
          </div>
        )}
      </div>

      {settingsPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSettingsPanelOpen(false)}
        />
      )}

      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        displaySettings={displaySettings}
        onToggleSetting={toggleSetting}
        onResetSettings={resetSettings}
      />

      <SettingsButton onClick={() => setSettingsPanelOpen(true)} />

      {error ? (
        <div className="flex justify-center items-center py-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur :</strong> {error}
            <button
              onClick={handleRefresh}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : clientData.length === 0 && !loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm || Object.values(filters).some(Boolean) 
                ? "Aucun client ne correspond à votre recherche" 
                : "Aucun client trouvé"
              }
            </div>
            <button
              onClick={handleRefresh}
              className="bg-[#667eea] text-white px-4 py-2 rounded-lg hover:bg-[#5568d3] transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>
      ) : (
        <>
          <ClientGrid
            clients={clientData}
            displaySettings={displaySettings}
            frequencyConfig={frequencyConfig}
            getRecommendedAction={getRecommendedAction}
            logoImages={logoImages}
          />

          {loading && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <div ref={loaderRef}></div>
        </>
      )}
    </div>
  );
};

// 🔍 COMPOSANT FILTRES
const ClientFilters = ({ filters, onFiltersChange }) => {
  const locations = ['Antananarivo', 'Tamatave', 'Diego', 'Fianarantsoa', 'Toliara'];
  const types = ['PME', 'Grande Entreprise', 'Startup', 'ONG', 'Administration'];

  const applyFilters = (newFilters) => {
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    applyFilters({
      location: '',
      type: '',
      minRevenue: '',
      minLearners: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre Ville */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <select
            value={filters.location}
            onChange={(e) => applyFilters({...filters, location: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les villes</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Filtre Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type d'entreprise</label>
          <select
            value={filters.type}
            onChange={(e) => applyFilters({...filters, type: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Filtre CA Minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CA Minimum (Ar)</label>
          <input
            type="number"
            value={filters.minRevenue}
            onChange={(e) => applyFilters({...filters, minRevenue: e.target.value})}
            placeholder="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtre Apprenants Minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apprenants Minimum</label>
          <input
            type="number"
            value={filters.minLearners}
            onChange={(e) => applyFilters({...filters, minLearners: e.target.value})}
            placeholder="0"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {activeFiltersCount > 0 && `${activeFiltersCount} filtre(s) actif(s)`}
        </div>
        <button
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

const SettingsButton = ({ onClick }) => (
  <button
    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-full shadow-lg text-xl hover:rotate-90 hover:scale-110 hover:shadow-xl transition-all duration-300 z-30 flex items-center justify-center"
    onClick={onClick}
    title="Paramètres d'affichage"
  >
    ⚙️
  </button>
);

export default PorteFeuilleClientDashboard;