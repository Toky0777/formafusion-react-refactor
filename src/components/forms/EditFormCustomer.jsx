import { useState } from "react";
import InputForm from "../ui/Input-form";
import { Camera, User, X } from "lucide-react";
import Button from "../button/Button";
import ButtonSecondary from "../button/ButtonSecondary";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../config/env";

export default function EditFormCustomer({
  dataEdit,
  onClose,
  updateEtp,
  updateLogo,
}) {
  const imgUrl = IMAGE_URL + "/img/entreprises";
  const [photo, setPhoto] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    etp_nif: dataEdit?.etp_nif || "",
    etp_stat: dataEdit?.etp_stat || "",
    etp_rcs: dataEdit?.etp_rcs || "",
    etp_logo: dataEdit?.etp_logo || "",
    etp_name: dataEdit?.etp_name || "",
    etp_phone: dataEdit?.etp_phone || "",
    etp_email: dataEdit?.etp_email || "",
    etp_addr_lot: dataEdit?.etp_addr_lot || "",
    etp_addr_quartier: dataEdit?.etp_addr_quartier || "",
    etp_ville: dataEdit?.etp_ville || "",
    etp_referent_name: dataEdit?.etp_referent_name || "",
    etp_referent_firstname: dataEdit?.etp_referent_firstname || "",
  });

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, etp_logo_base64: reader.result }));
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLogo = async (id) => {
    if (!formData.etp_logo_base64) return;
    try {
      await updateLogo(formData.etp_logo_base64, id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleUpdateLogo(dataEdit.idEtp);
      const res = await updateEtp(dataEdit.idEtp, formData);

      if (res.status === 200) {
        toastr.success("Modifié avec succès");
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nifStatLabel = JSON.parse(sessionStorage.getItem("setting"));

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Modifier le client
          </h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          Modifiez les informations de l’entreprise :
          <span className="font-bold text-lg"> {dataEdit?.etp_name} </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center items-center">
          <div className="relative group">
            {photo ? (
              <img
                src={photo}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border"
              />
            ) : formData.etp_logo ? (
              <img
                src={`${imgUrl}/${formData.etp_logo}`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nom de l’entreprise"
            name="etp_name"
            placeholder="Nom de l’entreprise"
            value={formData.etp_name}
            onChange={handleInputChange("etp_name")}
            required
          />
          <InputForm
            label={nifStatLabel?.nif_name}
            name="etp_nif"
            placeholder="123456789"
            value={formData.etp_nif}
            onChange={handleInputChange("etp_nif")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label={nifStatLabel?.stat_name}
            name="etp_stat"
            placeholder="STAT"
            value={formData.etp_stat}
            onChange={handleInputChange("etp_stat")}
          />
          <InputForm
            label="RCS"
            name="etp_rcs"
            placeholder="RCS"
            value={formData.etp_rcs}
            onChange={handleInputChange("etp_rcs")}
          />
        </div>

        <div>
          <InputForm
            label="Email"
            name="etp_email"
            type="email"
            placeholder="email@entreprise.com"
            value={formData.etp_email}
            onChange={handleInputChange("etp_email")}
            required
          />
        </div>

        <div>
          <InputForm
            label="Téléphone"
            name="etp_phone"
            placeholder="0340123456"
            value={formData.etp_phone || ""}
            onChange={handleInputChange("etp_phone")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Adresse (Lot)"
            name="etp_addr_lot"
            placeholder="Lot 08S..."
            value={formData.etp_addr_lot}
            onChange={handleInputChange("etp_addr_lot")}
          />
          <InputForm
            label="Adresse (Quartier)"
            name="etp_addr_quartier"
            placeholder="Quartier"
            value={formData.etp_addr_quartier || ""}
            onChange={handleInputChange("etp_addr_quartier")}
          />
        </div>

        <div>
          <InputForm
            label="Ville"
            name="etp_ville"
            placeholder="Antananarivo"
            value={formData.etp_ville}
            onChange={handleInputChange("etp_ville")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nom du référent"
            name="etp_referent_name"
            placeholder="Rakoto"
            value={formData.etp_referent_name}
            onChange={handleInputChange("etp_referent_name")}
          />
          <InputForm
            label="Prénom du référent"
            name="etp_referent_firstname"
            placeholder="Jean"
            value={formData.etp_referent_firstname}
            onChange={handleInputChange("etp_referent_firstname")}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <ButtonSecondary type="button" onClick={onClose} disabled={loading}>
            Annuler
          </ButtonSecondary>
          <Button type="submit" disabled={loading}>
            {loading ? "Modification..." : "Modifier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
