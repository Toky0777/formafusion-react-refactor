import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X, Upload, User, Save } from "lucide-react";
import ImportExcelApprenant from "../learners/import-excel";
import axios from "../../../config/axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import InputForm from "../../ui/Input-form";
import SelectForm from "../../ui/SelectForm";
import T from "../../translate/AutoTranslator";
import toast from "react-hot-toast";
import { projectService } from "../../../services/projectService";

export default function AddLearnerDrawer({
  onClose,
  addExcel,
  projectId,
  manageLearner,
}) {
  const [loading, setLoading] = useState(false);
  const [showImportExcel, setShowImportExcel] = useState(false);
  const [formData, setFormData] = useState({
    emp_name: "",
    emp_firstname: "",
    emp_email: "",
    emp_phone: "",
    idEntreprise: "",
    emp_photo: null,
    matricule: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [entreprises, setEntreprises] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emp_name) {
      newErrors.emp_name = "Le nom est réquis";
    }
    if (!formData.idEntreprise) {
      newErrors.idEntreprise = "L'entreprise est réquis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const data = await projectService.getEntrepriseByProject(projectId);
        setEntreprises(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEntreprises();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setFieldErrors({ ...fieldErrors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return null;
    setLoading(true);
    try {
      const res = await axios.post("cfp/apprenants", formData);
      if (res.status === 200) {
        toast.success("Apprenant crée avec succès !");
        manageLearner("post", res.data.employee_id);
        onClose();
      } else {
        toastr.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[700]"
      >
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[700px] bg-gradient-to-br from-white to-gray-50 shadow-2xl overflow-y-auto z-[800] flex flex-col"
        >
          <div className="bg-gray-200 px-6 py-2 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-bold  flex items-center gap-3">
              {showImportExcel ? (
                <>
                  <Upload size={28} />
                  <T>Importer depuis Excel</T>
                </>
              ) : (
                <>
                  <User size={28} />
                  <T>Ajouter un apprenant</T>
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2  rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-6">
            {!showImportExcel && (
              <div className=" mb-6">
                <button
                  onClick={() => setShowImportExcel(true)}
                  className="flex gap-2 py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500 flex items-center"
                >
                  <Upload size={18} />
                  <T>Ajouter en masse</T>
                </button>
              </div>
            )}

            {showImportExcel ? (
              <ImportExcelApprenant
                entreprises={entreprises}
                onPrevious={() => setShowImportExcel(false)}
                closeModal={onClose}
                addExcel={addExcel}
              />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl  p-6 space-y-5">
                  <div className="space-y-2">
                    <SelectForm
                      label="Entreprise"
                      name="idEntreprise"
                      data={entreprises}
                      value={formData.idEntreprise}
                      onChange={handleChange}
                      optionLabel="name"
                      optionValue="idEtp"
                      error={errors.idEntreprise}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <InputForm
                        label="Nom(s)"
                        type="text"
                        name="emp_name"
                        value={formData.emp_name}
                        onChange={handleChange}
                        error={errors.emp_name}
                      />
                    </div>

                    <div className="space-y-2">
                      <InputForm
                        label="Prénom(s)"
                        type="text"
                        name="emp_firstname"
                        value={formData.emp_firstname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <InputForm
                        label="Téléphone"
                        type="text"
                        name="emp_phone"
                        value={formData.emp_phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <InputForm
                        label="Adresse e-mail"
                        type="text"
                        name="emp_email"
                        value={formData.emp_email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <T>Annuler</T>
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    <span className="ml-2">
                      {loading ? <T> Ajout...</T> : <T>Ajouter</T>}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
