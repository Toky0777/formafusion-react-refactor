import { useEffect, useState, useMemo } from 'react';
import { Calendar, Building2, Search, Filter, X, ChevronDown } from 'lucide-react';
import axios from '../../config/axios';
import LoadingSpinner from '../ui/loading-spinner';
import clsx from 'clsx';

const ProjectsTableEvaluation = ({ onProjectSelect, selectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [dateSort, setDateSort] = useState('newest');

  const DataRequest = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`cfp/evaluations/froids`);
      setProjects(data.projets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DataRequest();
  }, []);

  // Extraire les entreprises uniques pour le filtre
  const companies = useMemo(() => {
    const uniqueCompanies = [...new Set(projects.map(project => project.etp_name))];
    return uniqueCompanies.filter(Boolean).sort();
  }, [projects]);

  // Fonction pour valider et parser une date
  const parseDate = (dateString) => {
    if (!dateString) return null;

    // Essayer de parser la date
    const parsedDate = new Date(dateString);

    // Vérifier si la date est valide
    if (isNaN(parsedDate.getTime())) {
      // Essayer d'autres formats de date courants
      const alternativeParsed = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'));
      if (!isNaN(alternativeParsed.getTime())) {
        return alternativeParsed;
      }
      return null;
    }

    return parsedDate;
  };

  // Fonction de formatage de date sécurisée
  const formatDate = (dateString) => {
    const date = parseDate(dateString);
    if (!date) return 'N/A';

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Fonction pour formater la période sur une ligne
  const formatDateRange = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      return 'Dates non définies';
    }

    // Vérifier si les dates sont valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Dates invalides';
    }

    // Même mois et année
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} - ${end.getDate()} ${new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(start)} ${start.getFullYear()}`;
    }

    // Même année
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.getDate()} ${new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(start)} - ${end.getDate()} ${new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(end)} ${start.getFullYear()}`;
    }

    // Années différentes
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Filtrer et trier les projets
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project =>
        (project.module_name?.toLowerCase() || '').includes(term) ||
        (project.etp_name?.toLowerCase() || '').includes(term)
      );
    }

    // Filtre par entreprise
    if (selectedCompany !== 'all') {
      result = result.filter(project => project.etp_name === selectedCompany);
    }

    // Trier par date (avec gestion des dates invalides)
    result.sort((a, b) => {
      const dateA = parseDate(a.dateFin || a.dateDebut);
      const dateB = parseDate(b.dateFin || b.dateDebut);

      // Gestion des dates invalides (elles seront placées à la fin)
      if (!dateA || isNaN(dateA.getTime())) return 1;
      if (!dateB || isNaN(dateB.getTime())) return -1;

      return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [projects, searchTerm, selectedCompany, dateSort]);

  const handleRowClick = (project) => {
    onProjectSelect(project);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCompany('all');
    setDateSort('newest');
  };

  return (
    <div className="overflow-hidden bg-white border shadow-lg rounded-xl border-gray-200/50">
      {/* Header avec recherche et filtres */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liste des projets terminés</h3>
              <p className="text-sm text-gray-600">
                {filteredAndSortedProjects.length} projet{filteredAndSortedProjects.length !== 1 ? 's' : ''} disponible{filteredAndSortedProjects.length !== 1 ? 's' : ''}
                {filteredAndSortedProjects.length !== projects.length && ` (sur ${projects.length} au total)`}
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 py-2 pl-10 pr-4 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-2 top-1/2 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors",
                showFilters
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              )}
            >
              <Filter className="w-4 h-4" />
              Filtres
              <ChevronDown className={clsx("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Entreprise</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">Toutes les entreprises</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Trier par date</label>
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="h-[35rem] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Cours
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase" style={{ width: "200px" }}>
                  Période
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right text-gray-700 uppercase">
                  Entreprise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAndSortedProjects.length > 0 ? (
                filteredAndSortedProjects.map((project) => (
                  <tr
                    key={project.idProjet}
                    onClick={() => handleRowClick(project)}
                    className={clsx(
                      "cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 group",
                      selectedProject?.idProjet === project.idProjet &&
                      "bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-600 transition-colors duration-200 group-hover:text-purple-700 line-clamp-2">
                        {project.module_name || 'Nom non disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-800">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDateRange(project.dateDebut, project.dateFin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Building2 className="w-4 h-4 text-gray-400 transition-colors duration-200 group-hover:text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-purple-700">
                          {project.etp_name || 'Non spécifiée'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-2 text-gray-300" />
                      <p className="font-medium">Aucun projet trouvé</p>
                      <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                      {(searchTerm || selectedCompany !== 'all') && (
                        <button
                          onClick={clearFilters}
                          className="px-4 py-1 mt-2 text-sm text-purple-600 hover:text-purple-700"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredAndSortedProjects.length} projet{filteredAndSortedProjects.length !== 1 ? 's' : ''} affiché{filteredAndSortedProjects.length !== 1 ? 's' : ''}
          </span>
          {selectedProject && (
            <span className="font-medium text-purple-600">
              Sélectionné: {selectedProject.module_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTableEvaluation;