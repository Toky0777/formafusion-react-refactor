import { useState, useEffect, useRef } from "react";
import axios from "../../../config/axios";
import { useTranslation } from "react-i18next";
import toastr from "toastr";

const INITIAL_FORM = {
  emp_name: "",
  emp_firstname: "",
  emp_email: "",
  emp_phone: "",
  idEntreprise: "",
  emp_photo: null,
  matricule: "",
  idProjet: "",
  isExist: false,
};

function AddLearnerFormateurModal({ isOpen, type, closeModal }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [entreprises, setEntreprises] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [firstNameSuggestions, setFirstNameSuggestions] = useState([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      setError(null);
      setFieldErrors({});
      fetchProjects();
      setFormData(INITIAL_FORM);
      setNameSuggestions([]);
      setFirstNameSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    toastr.options = {
      positionClass: "toast-top-center",
      timeOut: 6000,
      progressBar: true,
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("/list_project");
      setProjects(data);
    } catch (err) {
      setError("Erreur lors du chargement des projets.");
    }
  };

  const fetchEntreprises = async (projectId, projectType) => {
    try {
      const { data } = await axios.get(`/list_etp/${projectId}/${projectType}`);
      setEntreprises(data || []);
    } catch (err) {
      setError("Erreur lors du chargement des entreprises.");
    }
  };

  const handleNameChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      emp_name: value,
      isExist: false,
    }));

    if (!formData.idEntreprise) return; // vérifier entreprise sélectionnée

    if (value.length > 0) {
      try {
        const { data } = await axios.get(
          `/check_name_employee/${formData.idEntreprise}?query=${value}`
        );
        setNameSuggestions(data);
        setShowNameDropdown(true);
      } catch (err) {
        setNameSuggestions([]);
      }
    } else {
      setNameSuggestions([]);
      setShowNameDropdown(false);
    }
  };

  const handleFirstNameChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      emp_firstname: value,
      isExist: false,
    }));

    if (!formData.idEntreprise || !formData.emp_name) return;

    try {
      const { data } = await axios.get(
        `/check_fullname_employee/${formData.idEntreprise}?name=${formData.emp_name}&firstName=${value}`
      );
      setFormData((prev) => ({ ...prev, isExist: data.isExist }));
    } catch (err) {}
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "idProjet") {
      const selectedProject = projects.find((p) => p.idProjet == value);
      if (selectedProject) {
        fetchEntreprises(
          selectedProject.idProjet,
          selectedProject.idTypeProjet
        );
      }
    }
  };

  const handleSelectName = (name) => {
    setFormData((prev) => ({ ...prev, emp_name: name }));
    setShowNameDropdown(false);
    setNameSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== "") formPayload.append(key, val);
    });

    try {
      console.log(formData);

      const response = await axios.post("/form/apprenants", formPayload);
      toastr.success(response.data.message);
      setTimeout(() => {
        closeModal();
        setFormData(INITIAL_FORM);
      }, 2000);
      console.log(response);
    } catch (err) {
      toastr.error(err.response?.data?.message || "Erreur lors de l’ajout.");

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || type !== "addApprenant") return null;

  return (
    <div className="backdrop-custom-blur backdrop-brightness-75 fixed inset-0 z-50 transition-opacity duration-300">
      <div className="absolute inset-0" onClick={closeModal} />
      <div
        className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "42%", minWidth: "500px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 !shadow-sm">
            <h1 className="text-lg font-medium text-gray-500">
              Ajouter nouveau apprenant
            </h1>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto relative">
            {error && (
              <div className="p-4 mb-4 text-white bg-red-500 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Projet */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="idProjet"
                  className="text-gray-600 text-base after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Liste de projet
                </label>
                <select
                  name="idProjet"
                  id="idProjet"
                  value={formData.idProjet}
                  onChange={handleChange}
                  className="w-full h-10 pl-2 text-gray-400 border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  required
                >
                  <option value="" disabled>
                    Selectionner vos projet
                  </option>
                  {projects.map((project) => (
                    <option key={project.idProjet} value={project.idProjet}>
                      {project.moduleName} ({project.dateDebut} -{" "}
                      {project.dateFin})
                    </option>
                  ))}
                </select>
              </div>

              {/* Entreprise */}
              <div className="flex flex-col gap-1 relative">
                <label
                  htmlFor="idEntreprise"
                  className="text-gray-600 text-base after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Entreprise de l'Apprenant
                </label>
                <select
                  name="idEntreprise"
                  id="idEntreprise"
                  value={formData.idEntreprise}
                  onChange={handleChange}
                  className="w-full h-10 pl-2 text-gray-400 border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  required
                >
                  <option value="" disabled>
                    {t("add_student_select_company")}
                  </option>
                  {entreprises.map((etp) => (
                    <option key={etp.idCustomer} value={etp.idCustomer}>
                      {etp.customerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nom */}
              <div className="relative">
                <label htmlFor="emp_name">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="emp_name"
                  name="emp_name"
                  ref={nameRef}
                  value={formData.emp_name}
                  onChange={handleNameChange}
                  className="w-full h-10 pl-2 border border-gray-200 rounded-md"
                  required
                  autoComplete="off"
                />
                {showNameDropdown && nameSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md z-50">
                    {nameSuggestions.map((s, idx) => (
                      <li
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectName(s.name)}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Prenom */}
              <div>
                <label htmlFor="emp_firstname">Prénom</label>
                <input
                  type="text"
                  id="emp_firstname"
                  name="emp_firstname"
                  value={formData.emp_firstname}
                  onChange={handleFirstNameChange}
                  className="w-full h-10 pl-2 border border-gray-200 rounded-md"
                />
              </div>

              {/* Matricule */}
              <div>
                <label htmlFor="matricule">N° Matricule</label>
                <input
                  id="matricule"
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  className="w-full h-10 pl-2 border border-gray-200 rounded-md"
                />
              </div>

              {/* Téléphone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emp_phone">Téléphone</label>
                  <input
                    type="text"
                    id="emp_phone"
                    name="emp_phone"
                    value={formData.emp_phone}
                    onChange={handleChange}
                    className="w-full h-10 pl-2 border border-gray-200 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="emp_email">Email</label>
                  <input
                    type="email"
                    id="emp_email"
                    name="emp_email"
                    value={formData.emp_email}
                    onChange={handleChange}
                    className="w-full h-10 pl-2 border border-gray-200 rounded-md"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-white bg-[#A462A4] rounded-md hover:bg-[#924b92]"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearnerFormateurModal;
