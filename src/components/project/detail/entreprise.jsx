import {
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Mail,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { projectService } from "../../../services/projectService";
import AddCustomer from "../../drawer/project/AddCustomer";
import ProjectDrawer from "../../drawer/customer/ProjectDrawer";
import { IMAGE_URL } from "../../../config/env";

export const EntrepriseSection = ({ etp, projectId, setEtp }) => {
  const [showPageEntreprise, setShowPageEntreprise] = useState(false);
  const [openDrawerEtp, setOpenDrawerEtp] = useState(false);
  const [AfficheEntreprise, setAfficheEntreprise] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entreprises, setEntreprises] = useState([]);
  const [entrepriseAssigneds, setEntrepriseAssigneds] = useState([]);
  const [showDrawerAddEntreprise, setShowDrawerAddEntreprise] = useState(false);
  const [isLoadingEtpProject, setiILoadingEtpProject] = useState(true);
  const [dataEtp, setDataEtp] = useState([]);

  const toggleAfficheEntreprise = () => {
    setAfficheEntreprise((prev) => !prev);
  };

  const getCompanyInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleShowEntreprise = async (idEtp) => {
    setOpenDrawerEtp(true);
    setiILoadingEtpProject(true);
    const data = await projectService.getInvoiceAndProjectEtp(idEtp);
    setiILoadingEtpProject(false);
    setDataEtp(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!showPageEntreprise) return;

      await Promise.all([fetchAllEtp(), getEtpAssigned()]);
    };

    fetchData();
  }, [showPageEntreprise]);

  const filteredEntreprises = entreprises.filter((e) => {
    const name = e?.name?.toLowerCase() || "";
    const email = e?.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || email.includes(search);
  });

  const assignEtp = async (projectId, idEtp) => {
    try {
      await projectService.assignEtp(projectId, idEtp);
      getEtpAssigned();
    } catch (error) {
      console.error("Erreur de l'ajout de 'entreprise:", error);
    }
  };

  const deassignEtp = async (projectId, idEtp) => {
    try {
      await projectService.deassignEtp(projectId, idEtp);
      getEtpAssigned();
    } catch (error) {
      console.error("Erreur de l'ajout de 'entreprise:", error);
    }
  };

  const fetchAllEtp = async () => {
    const response = await projectService.getAllEntreprise();
    setEntreprises(response);
  };

  const getEtpAssigned = async () => {
    const response = await projectService.getEtpAssigned(projectId);

    setEntrepriseAssigneds(response);
    setEtp(response);
    fetchAllEtp();
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      {/* Header Card */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Header Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleAfficheEntreprise}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-cyan-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Entreprise(s)
                </h2>
                <p className="text-sm text-gray-600">
                  Clients et partenaires du projet
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {AfficheEntreprise ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Action Button */}
            <button
              onClick={() => setShowPageEntreprise(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Éditer</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {AfficheEntreprise && (
          <div className="p-6">
            {etp && etp.length > 0 ? (
              <div className="space-y-4">
                {etp.map((e, index) => (
                  <div
                    key={index}
                    className="p-5 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-cyan-200 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Company Info */}
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 uppercase">
                            {e.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-600">
                              {e.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-500">
                              Client actif
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleShowEntreprise(e.idEtp)}
                          className="p-3 transition-all duration-200 rounded-lg text-cyan-600 hover:bg-cyan-50 group/btn"
                        >
                          <Eye className="w-5 h-5 transition-transform duration-200 group-hover/btn:scale-110" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Aucune entreprise associée
                </h3>
                <p className="mb-6 text-gray-500">
                  Ajoutez des entreprises clientes à votre projet
                </p>
                <button
                  onClick={() => setShowPageEntreprise(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-cyan-600 rounded-xl hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une entreprise
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ajouter Entreprises */}
      {showPageEntreprise && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPageEntreprise(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full max-w-5xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-cyan-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Ajouter un client
                </h2>
              </div>
              <button
                onClick={() => setShowPageEntreprise(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-80px)]">
              {/* Left Panel - All Companies */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-red-400 rounded"></div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Liste de toutes les entreprises clientes
                    </h3>
                  </div>

                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Chercher un client"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="h-full p-4 space-y-3 overflow-y-auto">
                  {filteredEntreprises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="mb-1 text-lg font-medium text-gray-500">
                        Aucune entreprise trouvée
                      </p>
                      <p className="text-sm text-gray-400">
                        Essayez de modifier vos critères de recherche
                      </p>
                      <p className="text-sm text-gray-400">
                        Ou souhaitez-vous créer une nouvelle entreprise ?
                      </p>
                      <button
                        onClick={() => setShowDrawerAddEntreprise(true)}
                        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Créer une entreprise
                      </button>
                    </div>
                  ) : (
                    filteredEntreprises.map((e, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-cyan-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden border rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 border-cyan-200">
                            {e.logo ? (
                              <img
                                src={`${IMAGE_URL}/img/entreprises/${e.logo}`}
                                alt={e.name}
                                className="object-cover w-full h-full rounded-md"
                              />
                            ) : (
                              <span className="text-sm font-bold text-cyan-600">
                                {getCompanyInitials(e.name)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 uppercase">
                              {e.name}
                            </p>
                            <p className="text-sm text-gray-500">{e.email}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => assignEtp(projectId, e.id)}
                          className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - Selected Company */}
              <div className="w-1/2">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-400 rounded"></div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Le client sélectionné pour ce projet
                    </h3>
                  </div>
                </div>

                <div className="h-full p-4 overflow-y-auto">
                  {entrepriseAssigneds && entrepriseAssigneds.length > 0 ? (
                    <div className="space-y-3">
                      {entrepriseAssigneds.map((e, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-red-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 overflow-hidden border rounded-lg bg-gradient-to-br from-red-100 to-blue-100 border-red-200">
                              {e.logo ? (
                                <img
                                  src={`${IMAGE_URL}/img/entreprises/${e.logo}`}
                                  alt={e.name}
                                  className="object-cover w-full h-full rounded-md"
                                />
                              ) : (
                                <span className="text-sm font-bold text-cyan-600">
                                  {getCompanyInitials(e.name)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 uppercase">
                                {e.name}
                              </p>
                              <p className="text-sm text-gray-500">{e.email}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => deassignEtp(projectId, e.id)}
                            className="p-2 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200"
                          >
                            <Minus className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun client sélectionné</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPageEntreprise(false)}
                className="px-4 py-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowPageEntreprise(false)}
                className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-cyan-600 hover:bg-cyan-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDrawerAddEntreprise && (
        <AddCustomer
          show={showDrawerAddEntreprise}
          close={() => setShowDrawerAddEntreprise(false)}
          getAllEtps={entreprises}
          name={searchTerm}
          manageEtp={(idEtp) => assignEtp(projectId, idEtp)}
          idProjet={projectId}
        />
      )}

      {openDrawerEtp && (
        <ProjectDrawer
          isLoading={isLoadingEtpProject}
          isShow={openDrawerEtp}
          onClose={() => setOpenDrawerEtp(false)}
          data={dataEtp}
          account="cfp"
        />
      )}
    </div>
  );
};
