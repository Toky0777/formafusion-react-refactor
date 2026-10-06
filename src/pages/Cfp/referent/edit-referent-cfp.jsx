import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import InputForm from "../../../components/ui/Input-form";
import { Camera, Eye, EyeOff, Loader2, Save, User, X } from "lucide-react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../../config/env";

export default function ReferentEditModal({
  onClose,
  data,
  loading,
  onUpdatePhotoReferent,
  onUpdatePassword,
  onUpdateInfoReferent,
}) {
  const [formData, setFormData] = useState({
    emp_name: "",
    emp_firstname: "",
    emp_matricule: "",
    emp_email: "",
    emp_phone: "",
    idEmploye: "",
    password: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        emp_name: data.name || "",
        emp_firstname: data.firstName || "",
        emp_matricule: data.matricule || "",
        emp_email: data.email || "",
        emp_phone: data.phone || "",
        idEmploye: data.idEmploye,
      });
    }
  }, [data]);

  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const imgUrl = IMAGE_URL + "/img/referents/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, ref_photo: reader.result }));
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePhoto = async (idReferent) => {
    if (!formData.ref_photo) return;
    try {
      await onUpdatePhotoReferent(formData.ref_photo, idReferent);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdateInfo = async (idReferent) => {
    try {
      const res = await onUpdateInfoReferent(formData, idReferent);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleUpdatePassword = async (idReferent) => {
    if (!formData.password) return;
    try {
      const res = await onUpdatePassword(idReferent, formData.password);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formData.ref_photo) {
        await handleUpdatePhoto(formData.idEmploye);
      }

      if (formData.password) {
        await handleUpdatePassword(formData.idEmploye);
      }
      const res = await handleUpdateInfo(formData.idEmploye);
      toastr.success(res.message);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[700] overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              className="fixed inset-0 bg-black/20"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:p-6 max-w-2xl w-full mx-auto"
            >
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : data ? (
                <div>
                  <div className="flex justify-end">
                    <X
                      onClick={onClose}
                      className="hover:text-gray-300 cursor-pointer"
                    />
                  </div>
                  <form className="p-4 space-y-3" onSubmit={handleSubmit}>
                    {/* Photo */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative group">
                        {photo ? (
                          <img
                            src={photo}
                            alt="Preview"
                            className="w-28 h-28 rounded-full object-cover border"
                          />
                        ) : data?.photo ? (
                          <img
                            src={`${imgUrl}${data?.photo}`}
                            alt="Employé"
                            className="w-28 h-28 rounded-full object-cover border"
                          />
                        ) : (
                          <User className="w-28 h-28 rounded-full border p-6 text-gray-400" />
                        )}

                        <label
                          htmlFor="photo"
                          className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700"
                        >
                          <Camera size={18} />
                        </label>
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <InputForm
                          label="Nom"
                          type="text"
                          name="emp_name"
                          value={formData.emp_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <InputForm
                          label="Prénom"
                          type="text"
                          name="emp_firstname"
                          value={formData.emp_firstname}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <InputForm
                        label="Téléphone"
                        type="text"
                        name="emp_phone"
                        value={formData.emp_phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <InputForm
                        label="Adresse e-mail"
                        type="email"
                        name="emp_email"
                        value={formData.emp_email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative">
                      <InputForm
                        label="Mot de passe"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-200 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Save size={18} />
                        )}
                        <span className="ml-2">
                          {submitting ? "Enregistrement..." : "Enregistrer"}
                        </span>
                      </button>
                    </div>{" "}
                  </form>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p>Erreur lors du chargement des données</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
