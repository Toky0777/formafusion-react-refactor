import { useState, useEffect } from "react";
import InputForm from "../ui/Input-form";
import ButtonSecondary from "../button/ButtonSecondary";
import Button from "../button/Button";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { Camera, User, X } from "lucide-react";
import { IMAGE_URL } from "../../config/env";

export default function EditFormParticulier({
  dataEdit,
  onClose,
  updateParticulier,
  updatePhoto,
}) {
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    cin: "",
    phone: "",
  });

  const [image, setImage] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const imgUrl = IMAGE_URL + "/img/particuliers";

  useEffect(() => {
    if (dataEdit && Object.keys(dataEdit).length > 0) {
      setFormData({
        name: dataEdit.name || "",
        firstname: dataEdit.firstName || "",
        email: dataEdit.email || "",
        cin: dataEdit.cin || "",
        phone: dataEdit.phone || "",
      });
    }
  }, [dataEdit]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleUpdateInfo = async (e) => {
    try {
      const response = await updateParticulier(
        dataEdit.idParticulier,
        formData
      );
      return response;
    } catch (error) {
      console.error(error);
      toastr.error("Erreur lors de la mise à jour");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setImage(reader.result);
    };
  };

  const handleSubmitPhoto = async () => {
    if (!image) return;
    try {
      await updatePhoto(image, dataEdit.idParticulier);
    } catch (error) {
      console.log(error);
      toastr.error("Erreur lors de la mise à jour de la photo");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      if (image) {
        await handleSubmitPhoto();
      }
      const res = await handleUpdateInfo();
      if (res && res.data && res.data.message) {
        toastr.success(res.data.message);
        onClose();
      }
    } catch (error) {
      console.log(error);
      toastr.error("Erreur lors de la mise à jour");
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Modifier le particulier
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          Modifiez les informations du particulier{" "}
          <span className="font-bold text-lg"> {dataEdit?.name} </span>
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="flex justify-center items-center">
          <div className="relative group">
            {dataEdit.photo || image ? (
              <img
                src={image || `${imgUrl}/${dataEdit.photo}`}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border"
              />
            ) : image ? (
              <img
                src={`${imgUrl}/${dataEdit.photo || image}`}
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
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nom"
            name="name"
            placeholder="Rakoto"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
          <InputForm
            label="Prénom"
            name="firstname"
            placeholder="Mendrika"
            value={formData.firstname}
            onChange={handleInputChange("firstname")}
          />
        </div>

        <div>
          <InputForm
            label="Email"
            name="email"
            type="email"
            placeholder="rakoto@gmail.com"
            value={formData.email}
            onChange={handleInputChange("email")}
            required
          />
        </div>

        <div>
          <InputForm
            label="Téléphone"
            name="phone"
            placeholder="0340123456"
            value={formData.phone}
            onChange={handleInputChange("phone")}
          />
        </div>

        <div>
          <InputForm
            label="CIN"
            name="cin"
            placeholder="101245687325"
            value={formData.cin}
            onChange={handleInputChange("cin")}
            maxLength="12"
            required
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <ButtonSecondary
            type="button"
            onClick={onClose}
            disabled={loadingForm}
          >
            Annuler
          </ButtonSecondary>
          <Button type="submit" disabled={loadingForm}>
            {loadingForm ? "Modification..." : "Modifier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
