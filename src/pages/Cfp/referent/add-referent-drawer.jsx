import { useState } from "react";
import { X, Save, Loader2, Camera, User } from "lucide-react";
import axios from "../../../config/axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export default function ReferentAddModal({ isOpen, onClose, getReferent }) {
  const [employee, setEmployee] = useState({
    emp_matricule: "",
    emp_name: "",
    emp_firstname: "",
    emp_email: "",
    emp_phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      let dataToSend = { ...employee };

      if (employee.photo) {
        const base64 = await toBase64(employee.photo);
        dataToSend.image = base64;
      }

      const res = await axios.post("/cfp/referents", dataToSend);
      console.log(res);

      if (res.data.status === 200) {
        toastr.success(res.data.message);
        getReferent();
        onClose();
      } else {
        setErrors(res.data.error || {});
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ global: "Erreur lors de l’enregistrement" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee((prev) => ({ ...prev, photo: file })); // fichier brut
      setPreview(URL.createObjectURL(file)); // pour affichage preview
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-1/2 left-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg transform transition-transform ${
          isOpen
            ? "translate-x-[-50%] translate-y-[-50%] scale-100"
            : "translate-x-[-50%] translate-y-[-50%] scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Ajouter un Référent</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-4 space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-3 bg-white p-6  mx-auto">
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Employé"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300 shadow-inner">
                  <User className="text-gray-400" size={48} />
                </div>
              )}

              <label
                htmlFor="photo"
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow hover:bg-blue-700 transition-all duration-200"
                title="Changer la photo"
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
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                name="emp_name"
                value={employee.emp_name}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
              {errors.emp_name && (
                <p className="text-red-500 text-sm">{errors.emp_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Prénom</label>
              <input
                type="text"
                name="emp_firstname"
                value={employee.emp_firstname}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
              {errors.emp_firstname && (
                <p className="text-red-500 text-sm">{errors.emp_firstname}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            <input
              type="text"
              name="emp_phone"
              value={employee.emp_phone}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.emp_phone && (
              <p className="text-red-500 text-sm">{errors.emp_phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="emp_email"
              value={employee.emp_email}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.emp_email && (
              <p className="text-red-500 text-sm">{errors.emp_email}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />{" "}
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} /> Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
