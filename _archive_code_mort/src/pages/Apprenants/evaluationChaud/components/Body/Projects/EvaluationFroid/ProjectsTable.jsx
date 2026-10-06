import React, { useEffect, useState } from 'react';
import { Calendar, Building2, Search, Filter } from 'lucide-react';
import { useStateContext } from '../../../Context/ContextProvider';
import axios from 'axios';
import LoadingSpinner from '../../LoadingSpinner';

const ProjectsTable = ({ onProjectSelect, selectedProject }) => {
  const [ projects, setProjects ] = useState([]);
  const { token, api_base_url } = useStateContext();
  const [ projectResults, setProjectResults ] = useState({})
  const [ loading, setLoading ] = useState(false)

  // Données simulées basées sur le HTML original

  // const projects = [
  //   {
  //     id: 133,
  //     course: "Analyse moderne dans Excel",
  //     dateRange: "23 sept. 2024 au 30 sept. 2024",
  //     company: "BOA-MADAGASCAR"
  //   },
  //   {
  //     id: 147,
  //     course: "Analyse moderne dans Excel",
  //     dateRange: "23 sept. 2024 au 30 sept. 2024",
  //     company: "BOA-MADAGASCAR"
  //   },
  //   {
  //     id: 148,
  //     course: "Analyse moderne dans Excel",
  //     dateRange: "23 sept. 2024 au 30 sept. 2024",
  //     company: "BOA-MADAGASCAR"
  //   },
  //   {
  //     id: 77,
  //     course: "Bundle Analyse Moderne dans Excel",
  //     dateRange: "2 déc. 2024 au 6 déc. 2024",
  //     company: "Humanity & Inclusion"
  //   },
  //   {
  //     id: 18,
  //     course: "Bundle Power BI Fondamentaux + DAX + Dataviz et Analytics",
  //     dateRange: "10 juin 2024 au 14 juin 2024",
  //     company: "JHPIEGO"
  //   },
  //   {
  //     id: 3,
  //     course: "BUNDLES EXCEL Fondamentaux + Calculs avancés + Analyse de données",
  //     dateRange: "15 juil. 2024 au 31 juil. 2024",
  //     company: "ALOE"
  //   },
  //   {
  //     id: 4,
  //     course: "EXCEL NIVEAU I Fondamentaux",
  //     dateRange: "11 juin 2024 au 25 déc. 2024",
  //     company: "Paul Boye Industries"
  //   },
  //   {
  //     id: 22,
  //     course: "EXCEL NIVEAU II Calculs et fonctions avancés",
  //     dateRange: "12 août 2024 au 16 août 2024",
  //     company: "CONCENTRIX Madagascar"
  //   },
  //   {
  //     id: 124,
  //     course: "POWER BI Dataviz",
  //     dateRange: "30 oct. 2024 au 31 oct. 2024",
  //     company: "AXIAN UNIVERSITY"
  //   },
  //   {
  //     id: 8,
  //     course: "POWERPOINT",
  //     dateRange: "19 juin 2024 au 21 juin 2024",
  //     company: "AXIAN UNIVERSITY"
  //   }
  // ];

    const DataRequest = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`${api_base_url}cfp/evaluations/froids`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProjects(data.projets)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        DataRequest();
    }, [])

  const handleRowClick = (project) => {
    onProjectSelect(project);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liste des projets terminés</h3>
              <p className="text-sm text-gray-600">{projects.length} projets disponibles</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : 
      <div className="h-[35rem] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cours
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Entreprise
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((project) => (
              <tr
                key={project.idProjet}
                onClick={() => handleRowClick(project)}
                className={`cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 group ${
                  selectedProject?.idProjet === project.idProjet 
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500' 
                    : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-200 line-clamp-2">
                    {project.module_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    {project.dateDebut} au {project.dateFin}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                      {project.etp_name}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total: {projects.length} projets</span>
          {selectedProject && (
            <span className="text-purple-600 font-medium">
              Projet sélectionné: {selectedProject.module_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;