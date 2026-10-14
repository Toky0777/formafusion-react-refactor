import {
  Briefcase,
  GraduationCap,
  Mail,
  Minus,
  Phone,
  Search,
  User,
  ChevronUp,
  ChevronDown,
  Edit3,
  Award,
  EyeIcon,
  UserPlus,
  X,
  Plus,
  Calendar,
  BookOpen,
  Languages,
  MapPin,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { projectService } from "../../../services/projectService";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";

export const TrainerSection = ({ id, formateur, onTrainersChange }) => {
  const [cvForm, setCvForm] = useState([]);
  const [allTrainer, setAllTrainer] = useState([]);
  const [trainerAdded, setTrainerAdded] = useState([]);
  const [showPageFormateur, setShowPageFormateur] = useState(false);
  const [searchForm, setSearchForm] = useState("");
  const [showPageDetailFormateur, setShowPageDetailFormateur] = useState(false);
  const [AfficheFormateur, setAfficheFormateur] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filteredTrainer, setFilteredTrainer] = useState([]);

  const renderStars = (rating, maxStars = 5) => {
    return [...Array(maxStars)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const toggleAfficheFormateur = () => {
    setAfficheFormateur((prev) => !prev);
  };

  useEffect(() => {
    if (!searchForm) {
      setFilteredTrainer(allTrainer || []);
    } else {
      const filtered = (allTrainer || []).filter((t) => {
        const name = t?.form_name?.toLowerCase() || "";
        const firstname = t?.form_firstname?.toLowerCase() || "";
        const search = searchForm.toLowerCase();
        return name.includes(search) || firstname.includes(search);
      });
      setFilteredTrainer(filtered);
    }
  }, [searchForm, allTrainer]);

  const manageForm = async (method, id, idFormateur) => {
    if (method === "delete") {
      try {
        await axios.delete(`/cfp/projets/${id}/${idFormateur}/form/assign`);

        const trainers = await fetchTrainerAdded(id);
        onTrainersChange?.(trainers);
      } catch (error) {
        console.error("Erreur suppression formateur:", error);
      }
    }

    if (method === "post") {
      try {
        await axios.post(`/cfp/projets/${id}/${idFormateur}/form/assign`);
        const trainers = await fetchTrainerAdded(id);
        onTrainersChange?.(trainers);
      } catch (error) {
        console.error("Erreur de l'ajout de  formateur:", error);
      }
    }
  };

  const fetchTrainer = async () => {
    const response = await axios.get("/cfp/projets/formateur/all");
    setAllTrainer(response.data.forms);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!showPageFormateur) return;

      try {
        await Promise.all([fetchTrainer(), fetchTrainerAdded(id)]);
      } catch (error) {
        console.error("Erreur lors du chargement des formateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showPageFormateur, id]);

  const fetchTrainerAdded = async (id) => {
    const { data } = await axios.get(`/cfp/projets/${id}/getFormAdded`);

    const trainers = data.forms || [];
    setTrainerAdded(trainers);
    return trainers;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const loadFormateurCv = async (idFormateur) => {
    const formCv = await projectService.getCvTrainer(idFormateur);

    const formCvRes = await formCv.data;

    setCvForm(formCvRes);
  };

  const TrainerSkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        <div className="space-y-2">
          <div className="w-24 h-3 bg-gray-300 rounded" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-8 h-8 bg-gray-300 rounded-full" />
    </div>
  );

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      {/* Header Card */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Header Section */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleAfficheFormateur}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-indigo-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Formateurs
                </h2>
                <p className="text-sm text-gray-600">
                  Faites connaissance avec les formateurs
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {AfficheFormateur ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Action Button */}
            <button
              onClick={() => setShowPageFormateur(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">Éditer</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {AfficheFormateur && (
          <div className="p-6">
            {formateur && formateur.length > 0 ? (
              <div className="space-y-4">
                {formateur.map((f, index) => (
                  <div
                    key={index}
                    className="p-5 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-indigo-200 group"
                  >
                    <div className="flex items-center justify-between">
                      {/* Trainer Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                            {f.form_photo ? (
                              <img
                                src={`${IMAGE_URL}/img/formateurs/${f.form_photo}`}
                                alt={f.form_name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-lg font-bold text-white">
                                {getInitials(f.form_firstname, f.form_name)}
                              </div>
                            )}
                          </div>
                          <div className="absolute w-5 h-5 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-gray-800 uppercase">
                            {f.form_name}
                          </h4>
                          <p className="font-medium text-gray-600 capitalize">
                            {f.form_firstname}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Consultant Formateur
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setShowPageDetailFormateur(true);
                            loadFormateurCv(f.idFormateur);
                          }}
                          className="p-3 text-indigo-600 transition-all duration-200 rounded-lg hover:bg-indigo-50 group/btn"
                        >
                          <EyeIcon className="w-5 h-5 transition-transform duration-200 group-hover/btn:scale-110" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Aucun formateur assigné
                </h3>
                <p className="mb-6 text-gray-500">
                  Commencez par ajouter des formateurs à votre projet
                </p>
                <button
                  onClick={() => setShowPageFormateur(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter des formateurs
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Ajouter Formateurs */}
      {showPageFormateur && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPageFormateur(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full max-w-5xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Ajouter un formateur
                </h2>
              </div>
              <button
                onClick={() => setShowPageFormateur(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-80px)]">
              {/* Left Panel - All Trainers */}
              <div className="w-1/2 border-r border-gray-200">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-red-400 rounded"></div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Liste de tous les formateurs
                    </h3>
                  </div>

                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Chercher un formateur"
                      onChange={(e) => setSearchForm(e.target.value)}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="h-full p-4 space-y-3 overflow-y-auto">
                  {loading ? (
                    <>
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                    </>
                  ) : filteredTrainer?.length > 0 ? (
                    filteredTrainer.map((f, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 transition-colors duration-200 bg-white border border-gray-200 rounded-lg hover:border-indigo-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                            {f.form_photo ? (
                              <img
                                src={`${IMAGE_URL}/img/formateurs/${f.form_photo}`}
                                alt={f.form_name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white">
                                {getInitials(f.form_firstname, f.form_name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 uppercase">
                              {f.form_name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {f.form_firstname}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => manageForm("post", id, f.idFormateur)}
                          className="p-2 transition-colors duration-200 bg-green-100 rounded-full hover:bg-green-200"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun formateur trouvé</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Selected Trainers */}
              <div className="w-1/2">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-400 rounded"></div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Formateurs sélectionnés pour ce projet
                    </h3>
                  </div>
                </div>

                <div className="h-full p-4 space-y-3 overflow-y-auto">
                  {loading ? (
                    <>
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                      <TrainerSkeleton />
                    </>
                  ) : trainerAdded && trainerAdded.length > 0 ? (
                    trainerAdded.map((f, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                            {f.form_photo ? (
                              <img
                                src={`${IMAGE_URL}/img/formateurs/${f.form_photo}`}
                                alt={f.form_name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white">
                                {getInitials(f.form_firstname, f.form_name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 uppercase">
                              {f.form_name}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {f.form_firstname}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            manageForm("delete", id, f.idFormateur)
                          }
                          className="p-2 transition-colors duration-200 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <Minus className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun formateur sélectionné</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPageFormateur(false)}
                className="px-4 py-2 text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowPageFormateur(false)}
                className="px-4 py-2 text-white transition-colors duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Formateur */}
      {showPageDetailFormateur && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPageDetailFormateur(false)}
          />
          <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  À propos du formateur
                </h2>
              </div>
              <button
                onClick={() => setShowPageDetailFormateur(false)}
                className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Profile Header */}
              <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                <div className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-purple-500">
                  {cvForm?.form?.photo ? (
                    <img
                      src={`${IMAGE_URL}/img/formateurs/${cvForm.form.photo}`}
                      alt="profil"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white">
                      {getInitials(cvForm?.form?.firstname, cvForm?.form?.name)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-3xl font-bold text-gray-800">
                    {cvForm?.form?.name} {cvForm?.form?.firstname}
                  </h3>
                  <p className="mb-4 text-lg font-medium text-indigo-600">
                    Consultant Formateur
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {cvForm?.form?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {cvForm?.form?.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experiences */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Expériences
                  </h4>
                </div>
                {cvForm?.experiences?.length > 0 ? (
                  <div className="space-y-6">
                    {cvForm.experiences.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="pb-6 pl-6 border-l-4 border-blue-200 last:pb-0"
                      >
                        <h5 className="text-lg font-semibold text-gray-800">
                          {exp.Fonction}
                        </h5>
                        <div className="flex items-center gap-2 mt-1 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {exp.Lieu_de_stage}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(exp.Date_debut).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            -
                            {exp.Date_fin
                              ? new Date(exp.Date_fin).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "Aujourd'hui"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">
                    Aucune expérience renseignée
                  </p>
                )}
              </div>

              {/* Formations */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-green-600" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Formations
                  </h4>
                </div>
                {cvForm?.diplomes?.length > 0 ? (
                  <div className="space-y-4">
                    {cvForm.diplomes.map((diplome, index) => (
                      <div
                        key={diplome.id}
                        className="pl-6 border-l-4 border-green-200"
                      >
                        <h5 className="font-semibold text-gray-800">
                          {diplome.Diplome} en {diplome.Domaine}
                        </h5>
                        <p className="mt-1 text-gray-600">{diplome.Ecole}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(diplome.Date_debut).toLocaleDateString(
                              "fr-FR"
                            )}{" "}
                            -
                            {new Date(diplome.Date_fin).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">
                    Aucun diplôme renseigné
                  </p>
                )}
              </div>

              {/* Compétences */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-purple-600" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Compétences
                  </h4>
                </div>
                {cvForm?.competences?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cvForm.competences.map((comp, index) => (
                      <span
                        key={comp.id}
                        className="px-3 py-2 text-sm font-medium text-purple-800 bg-purple-100 rounded-lg"
                      >
                        {comp.Competence}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">
                    Aucune compétence renseignée
                  </p>
                )}
              </div>

              {/* Langues */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Languages className="w-6 h-6 text-orange-600" />
                  <h4 className="text-xl font-semibold text-gray-800">
                    Langues
                  </h4>
                </div>
                {cvForm?.langues?.length > 0 ? (
                  <div className="space-y-4">
                    {cvForm.langues.map((lang, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-orange-50"
                      >
                        <span className="font-medium text-gray-800">
                          {lang.Langue}
                        </span>
                        <div className="flex items-center gap-1">
                          {renderStars(lang.note)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-500">
                    Aucune langue renseignée
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
