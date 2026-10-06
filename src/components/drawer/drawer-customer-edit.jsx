import { useState, useEffect, useRef } from "react";
import { X, Pen } from "lucide-react";
import { Input } from "../ui/input-with-label";
import { Button } from "../ui/button-customized";
import { profilService } from "../../services/profilService";
import { IMAGE_URL } from "../../config/env";

export const EditCustomerDrawer = ({ isDrawerOpen, onClose }) => {
  const [referent, setReferent] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchReferent = async () => {
      try {
        const data = await profilService.getUserEtp();
        setReferent(data);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Erreur de récupération"
        );
      }
    };
    fetchReferent();
  }, []);

  const handleInputChange = (field, value) => {
    setReferent((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setModalOpen(true);
  };

  const handleSave = async () => {
    const errors = {};
    if (!referent.name?.trim()) errors.name = "The name field is required.";
    if (!referent.email?.trim()) errors.email = "The email field is required.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      emp_name: referent.name,
      emp_firstname: referent.firstName,
      emp_email: referent.email,
      emp_phone: referent.phone,
      emp_matricule: referent.matricule,
      emp_lot: referent.user_addr_lot,
      emp_quartier: referent.user_addr_quartier,
      emp_code_postal: referent.user_addr_code_postal,
      ville: referent.ville,
      photo: referent.photo,
    };

    try {
      const response = await profilService.updateUserEtp(payload);

      // Gestion des erreurs backend
      if (response.error) {
        const backendErrors = {};
        Object.keys(response.error).forEach((key) => {
          backendErrors[key] = response.error[key][0];
        });
        setFormErrors(backendErrors);
        return;
      }

      onClose();
      console.log("User updated successfully");
    } catch (err) {
      // console.error(
      //   err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      // );
      console.log(err);

      alert("Update failed, check console for details");
    }
  };

  if (!isDrawerOpen) return null;

  const urlPath = IMAGE_URL + "/img/entreprises/";

  return (
    <>
      <div className="fixed top-0 right-0 z-50 flex w-full h-full max-w-2xl">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="relative w-[45em] bg-white h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-100">
            <p className="text-lg font-medium text-gray-500">
              Modifier un référent
            </p>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
            >
              <X className="text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col w-full gap-4 p-4">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-200 rounded-lg">
                {referent.photo ? (
                  <img
                    src={urlPath + referent.photo}
                    alt="Logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-500">
                    {referent.name?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <label
                htmlFor="logoFileRef"
                className="flex items-center gap-1 px-2 py-1 bg-white border rounded-md cursor-pointer hover:bg-gray-100"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logoFileRef"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Pen size={16} /> Changer de profil
              </label>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Nom"
                  value={referent.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              <Input
                label="Prénom"
                value={referent.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>

            <Input
              label="Matricule"
              value={referent.matricule || ""}
              onChange={(e) => handleInputChange("matricule", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="email"
                  label="Mail"
                  value={referent.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <Input
                type="tel"
                label="Téléphone"
                value={referent.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600">Ville</label>
                <select
                  value={referent.idVille || ""}
                  onChange={(e) => handleInputChange("ville", e.target.value)}
                  className="w-full h-12 px-2 border rounded-md focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                >
                  <option value="">Sélectionnez une ville</option>
                  <option value="1">Antananarivo</option>
                  <option value="5">Toamasina</option>
                  <option value="4">Mahajanga</option>
                  <option value="2">Antsiranana</option>
                  <option value="3">Fianarantsoa</option>
                  <option value="6">Toliara</option>
                </select>
              </div>
              <Input
                type="number"
                label="Code postal"
                value={referent.user_addr_code_postal || ""}
                onChange={(e) =>
                  handleInputChange("user_addr_code_postal", e.target.value)
                }
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Sauvegarder les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crop Image */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md p-4 max-w-4xl w-full h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2>Sélectionnez l'image à découper...</h2>
              <button onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="grid h-full grid-cols-4 gap-2">
              <div className="col-span-3">
                <img
                  id="imageref"
                  src=""
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="col-span-1">
                <div className="w-full h-40 border rounded-md previewRef"></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => console.log("Recadrer l'image")}>
                Recadrer l'image
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
