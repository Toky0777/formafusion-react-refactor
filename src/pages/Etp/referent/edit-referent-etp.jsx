import { useState, useEffect } from "react";
import { X, Save, Camera, Loader2 } from "lucide-react";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";

export default function ReferentEditEtp({
  isOpen,
  onClose,
  idReferent,
  setReferent,
  index,
}) {
  console.log(idReferent);
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/etp/referents/${idReferent}/edit`);
        setEmployee(res.data.emp);
        setPreview(
          res.data.emp.photo
            ? `${IMAGE_URL}/img/referents/${res.data.emp.photo}`
            : null
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (idReferent) fetchData();
  }, [idReferent]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployee((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSave = async (employee) => {
    try {
      let photoName = employee.ref_photo || employee.photo;
      if (employee.photo && employee.photo instanceof File) {
        const base64Image = await toBase64(employee.photo);

        const photoRes = await axios.post(
          `/etp/referents/${employee.idEmploye}/updatePhoto`,
          { image: base64Image }
        );
        photoName = photoRes.data.imageName;
      }

      // 2️⃣ Mise à jour des autres champs
      const dataToSend = {
        emp_name: employee.emp_name || employee.name,
        emp_firstname: employee.emp_firstname || employee.firstName,
        emp_matricule: employee.emp_matricule || employee.matricule,
        emp_phone: employee.emp_phone || employee.phone,
        emp_email: employee.emp_email || employee.email,
        // emp_lot: employee.emp_lot || employee.user_addr_lot,
        // emp_quartier: employee.emp_quartier || employee.user_addr_quartier,
        // emp_code_postal:
        //   employee.emp_code_postal || employee.user_addr_code_postal,
        // fonction: employee.fonction || "",
      };

      if (dataToSend.photo instanceof File) delete dataToSend.photo;

      const updateRes = await axios.put(
        `/etp/referents/${employee.idEmploye}`,
        dataToSend
      );

      if (updateRes.status === 200) {
        // 3️⃣ Mettre à jour l'état seulement après succès
        setReferent((prev) => ({
          ...prev,
          referentAll: {
            ...prev.referentAll,
            data: prev.referentAll.data.map((ref, i) =>
              i === index
                ? {
                    ...ref,
                    ref_matricule: employee.emp_matricule || employee.matricule,
                    ref_name: employee.emp_name || employee.name,
                    ref_firstname: employee.emp_firstname || employee.firstName,
                    ref_phone: employee.emp_phone || employee.phone,
                    ref_email: employee.emp_email || employee.email,
                    ref_photo: photoName,
                    ref_adresse: employee.emp_adresse || ref.ref_adresse,
                  }
                : ref
            ),
          },
        }));
      }
      console.log("Employé mis à jour avec succès !");
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // erreurs de validation Laravel
        setErrors(err.response.data.errors);
      } else {
        setErrors({ global: "Erreur lors de l’enregistrement" });
      }
    }
  };

  // ✅ Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(employee);
    } catch (error) {
      // ici tu peux afficher un toast ou message d'erreur
    } finally {
      setSubmitting(false);
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

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg transform transition-transform ${
          isOpen
            ? "translate-x-[-50%] translate-y-[-50%] scale-100"
            : "translate-x-[-50%] translate-y-[-50%] scale-95 opacity-0"
        }`}
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Modifier Employé</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form className="p-4 space-y-3" onSubmit={handleSubmit}>
          {/* Photo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={
                  preview ||
                  "https://via.placeholder.com/120x120.png?text=Photo"
                }
                alt="Employé"
                className="w-28 h-28 rounded-full object-cover border"
              />
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
            <label
              htmlFor="photo"
              className="text-sm text-blue-600 cursor-pointer hover:underline"
            >
              Changer la photo
            </label>
          </div>

          {/* Champs */}
          <div>
            <label className="block text-sm font-medium">Matricule</label>
            <input
              type="text"
              name="emp_matricule"
              value={employee.emp_matricule || employee.matricule || ""}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.emp_matricule && (
              <p className="text-red-500 text-sm">{errors.emp_matricule}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                name="emp_name"
                value={employee.emp_name || employee.name || ""}
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
                value={employee.emp_firstname || employee.firstName || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium">Fonction</label>
            <input
              type="text"
              name="fonction"
              value={employee.fonction || ""}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            <input
              type="text"
              name="emp_phone"
              value={employee.emp_phone || employee.phone || ""}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="emp_email"
              value={employee.emp_email || employee.email || ""}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
            {errors.emp_email && (
              <p className="text-red-500 text-sm">{errors.emp_email}</p>
            )}
          </div>
          {/* <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={employee.password || ""} // ✅ garde la valeur dans l'état
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 pr-10"
                aria-label="Mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center p-1 text-gray-500 hover:text-gray-700"
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div> */}

          {/* <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Lot</label>
              <input
                type="text"
                name="emp_lot"
                value={employee.emp_lot || employee.user_addr_lot || ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div> */}
          {/* <div>
              <label className="block text-sm font-medium">Quartier</label>
              <input
                type="text"
                name="emp_quartier"
                value={
                  employee.emp_quartier || employee.user_addr_quartier || ""
                }
                onChange={handleChange}
                className="mt-1 w-full border rounded px-2 py-1"
              />
            </div>
          </div> */}
          {/* 
          <div>
            <label className="block text-sm font-medium">Code Postal</label>
            <input
              type="text"
              name="emp_code_postal"
              value={
                employee.emp_code_postal || employee.user_addr_code_postal || ""
              }
              onChange={handleChange}
              className="mt-1 w-full border rounded px-2 py-1"
            />
          </div> */}

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
