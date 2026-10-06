import {
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Minus,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
  X,
  Plus,
  Calendar,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { projectService } from "../../../services/projectService";
import { toast } from "react-hot-toast";
import AddLearnerDrawer from "../../drawer/project/AddLearner";
import AddParticular from "../../drawer/project/AddParticular";
import { IMAGE_URL } from "../../../config/env";

export const LearnerList = ({
  learnersAdded,
  id,
  projectType,
  setLearnersAdded,
  entreprise,
}) => {
  const [showDrawerAssignLearner, setShowDrawerAssignLearner] = useState(false);
  const [showEmargement, setShowEmargement] = useState(false);
  const [apprenants, setApprenants] = useState([]);
  const [learnerAdded, setLearnerAdded] = useState([]);
  const [showAddLearner, setShowAddLearner] = useState(false);
  const [selectedEtp, setSelectedEtp] = useState("");
  const [entreprises, setEntreprises] = useState([]);
  const [toggleLearner, setToggleLearner] = useState(true);
  const [showLeanrer, setShowLearner] = useState(false);
  const [learners, setLearners] = useState([]);

  const photoUrl = IMAGE_URL + "/";
  const getPresenceColor = (presence) => {
    switch (presence) {
      case "present":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "absent":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLearnerAdded = async () => {
    const response = await projectService.getLearnerAdded(id);
    setLearnerAdded(response);
    setLearnersAdded(response);
  };

  const getAllParticular = async () => {
    const response = await projectService.getAllParticulars();
    setLearners(response);
  };

  const getAllEntreprise = async () => {
    const response = await projectService.getEntrepriseByProject(id);
    setEntreprises(response);
  };

  const showDrawerLearner = (status) => {
    status == true
      ? setShowDrawerAssignLearner(true)
      : setShowDrawerAssignLearner(false);
    getLearnerAdded();
    projectType === 4 ? getAllParticular() : getAllEntreprise();
    if (projectType == 1 && entreprise[0]?.idEtp) {
      getLearnerByEntreprise(entreprise[0]?.idEtp);
    }
  };

  const getLearnerByEntreprise = async (id) => {
    const response = await projectService.getLearnerByEntreprise(id);
    setLearners(response);
  };

  const manageLearner = async (method, idEmploye) => {
    if (method === "delete") {
      try {
        await projectService.deassignLearnerToProject(id, idEmploye);

        getLearnerAdded();
      } catch (error) {
        console.error("Erreur suppression apprenant:", error);
      }
    }

    if (method === "post") {
      try {
        await projectService.assignLearnerToProject(id, idEmploye);

        getLearnerAdded();
      } catch (error) {
        toast.error("Cet apprenant est déja ajouté!");
      }
    }
  };

  const getLearnerByKey = async (key) => {
    const response = await projectService.getLearnerByKey(id, key);

    setLearners(response);
  };

  const getPresenceIcon = (presence) => {
    switch (presence) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "partial":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };
  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
      {/* Header Section */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setToggleLearner((prev) => !prev)}
            className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-purple-600 group"
          >
            <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {learnersAdded.length || 0} Apprenants
                </h2>
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  Actifs
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Gérez vos participants à la formation
              </p>
            </div>
            <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
              {toggleLearner ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {/* Action Buttons */}
          <div className="relative">
            <button
              onClick={() => setShowLearner((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Éditer</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showLeanrer && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-20 min-w-[200px]">
                <button
                  onClick={() => showDrawerLearner(true)}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-lg hover:bg-purple-50 hover:text-purple-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter des apprenants
                </button>
                <button
                  onClick={() => setShowEmargement(true)}
                  className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 rounded-lg hover:bg-purple-50 hover:text-purple-700"
                >
                  <UserCheck className="w-4 h-4" />
                  Émargement
                </button>
                <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-400 rounded-lg opacity-50 cursor-not-allowed">
                  <BarChart3 className="w-4 h-4" />
                  Évaluation
                </button>
                <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-gray-400 rounded-lg opacity-50 cursor-not-allowed">
                  <Award className="w-4 h-4" />
                  Skill matrix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {toggleLearner && (
        <div className="p-6">
          <div className="mb-6">
            {/* Participants List */}
            <div className="space-y-3">
              {learnersAdded?.length > 0 ? (
                learnersAdded.map((apprenant, index) => (
                  <div
                    key={index}
                    className="p-5 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-200 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Participant Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="overflow-hidden rounded-full w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400">
                            {apprenant.photo ? (
                              <img
                                src={`${IMAGE_URL}/img/employes/${apprenant.photo}`}
                                alt="photo"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-lg font-bold text-white">
                                {apprenant.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getPresenceColor(
                              apprenant?.presence
                            )}`}
                          ></div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {apprenant.name} {apprenant.firstName}
                          </h4>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => manageLearner("delete", apprenant.id)}
                          className="p-2 text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Aucun apprenant trouvé
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Commencez par ajouter vos premiers apprenants
                  </p>
                  <button
                    onClick={() => showDrawerLearner(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-purple-600 rounded-xl hover:bg-purple-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    Ajouter des apprenants
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Apprenants */}
      {showDrawerAssignLearner && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => showDrawerLearner(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full max-w-6xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Ajouter des apprenants
              </h2>
              <button
                onClick={() => showDrawerLearner(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-80px)]">
              {/* Left Panel - All Employees */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-red-400 rounded"></div>
                    <h3 className="text-lg font-medium text-gray-700">
                      Tous les employés
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Chercher un apprenant"
                        onChange={(e) => getLearnerByKey(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {projectType == 2 && (
                      <select
                        value={selectedEtp}
                        onChange={(e) => {
                          const etpId = e.target.value;
                          setSelectedEtp(etpId);
                          if (etpId) getLearnerByEntreprise(etpId);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner une entreprise</option>
                        {entreprises.map((etp, index) => (
                          <option key={index} value={etp.id}>
                            {etp.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {projectType == 1 && (
                      <select
                        value={selectedEtp}
                        onChange={(e) => {
                          const etpId = e.target.value;
                          setSelectedEtp(etpId);
                          if (etpId) getLearnerByEntreprise(etpId);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {entreprises.map((etp, index) => (
                          <option key={index} value={etp.id}>
                            {etp.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="h-full p-4 space-y-3 overflow-y-auto">
                  {learners?.length > 0 ? (
                    learners.map((learner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-purple-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                            <div className="flex items-center justify-center w-full h-full font-bold text-white">
                              {learner.photo
                                ? photoUrl + learner.photo
                                : learner.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 uppercase">
                              {learner.name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {learner.firstName}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => manageLearner("post", learner.id)}
                          className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        Aucune apprenant associée
                      </h3>
                      <p className="mb-6 text-gray-500">
                        Ajoutez des apprenants à votre projet
                      </p>
                      <button
                        onClick={() => setShowAddLearner(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-cyan-600 rounded-xl hover:bg-cyan-700"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un apprenant
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Selected Employees */}
              <div className="w-1/2">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-400 rounded"></div>
                    <h3 className="text-lg font-medium text-gray-700">
                      {learnerAdded.length || 0} employés sélectionnés
                    </h3>
                  </div>
                </div>

                <div className="h-full p-4 space-y-3 overflow-y-auto">
                  {learnerAdded && learnerAdded.length > 0 ? (
                    learnerAdded.map((learner, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                            <div className="flex items-center justify-center w-full h-full font-bold text-white">
                              {learner.photo
                                ? photoUrl + learner.photo
                                : learner.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 uppercase">
                              {learner.name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {learner.firstName}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => manageLearner("delete", learner.id)}
                          className="p-2 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <Minus className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun apprenant sélectionné</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => showDrawerLearner(false)}
                className="px-4 py-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => showDrawerLearner(false)}
                className="px-4 py-2 text-white transition-colors duration-200 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Émargement */}
      {showEmargement && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowEmargement(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full bg-white shadow-2xl max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Fiche de présence
                </h2>
              </div>
              <button
                onClick={() => setShowEmargement(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">Présent</span>
                  <span className="font-bold text-green-600">
                    {apprenants.percentPresent}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">Partiellement</span>
                  <span className="font-bold text-yellow-600">
                    {apprenants.percentPartiel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-gray-600">Absent</span>
                  <span className="font-bold text-red-600">
                    {apprenants.percentAbsent}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <span className="text-sm text-gray-600">Non défini</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Présent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Partiellement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 h-[calc(100vh-200px)] overflow-auto">
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                {/* Table Header */}
                <div className="grid grid-cols-6 border-b bg-gray-50">
                  <div className="p-4 font-medium text-gray-700">Apprenant</div>
                  {apprenants?.getSeance?.map((seance, i) => (
                    <div
                      key={i}
                      className="p-4 text-center border-l border-gray-200"
                    >
                      <div className="mb-1 font-medium text-gray-700">
                        {seance.dateSeance}
                      </div>
                      <div className="text-sm text-gray-500">
                        {seance.heureDebut} - {seance.heureFin}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Rows */}
                {apprenants?.apprs?.map((apprenant, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                        <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white">
                          {apprenant.emp_initial_name}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {apprenant.emp_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {apprenant.emp_firstname}
                        </p>
                      </div>
                    </div>

                    {apprenants?.getSeance?.map((_, j) => (
                      <div
                        key={j}
                        className="flex items-center justify-center p-4 border-l border-gray-100"
                      >
                        <button className="w-6 h-6 transition-colors duration-200 bg-gray-300 rounded hover:bg-gray-400"></button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddLearner && projectType !== 4 && (
        <AddLearnerDrawer
          onClose={() => setShowAddLearner(false)}
          projectId={id}
          manageLearner={(method, employeeId) =>
            manageLearner(method, employeeId)
          }
        />
      )}

      {showAddLearner && projectType == 4 && (
        <AddParticular
          isOpen={showAddLearner}
          onClose={() => setShowAddLearner(false)}
          manageLearner={(method, employeeId) =>
            manageLearner(method, employeeId)
          }
        />
      )}
    </div>
  );
};
