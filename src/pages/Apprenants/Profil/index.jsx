import { useRef, useState, useEffect } from "react";
import Cropper from "react-cropper";
import { toast } from "react-toastify";
import { profilService } from "../../../services/profilService";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";

export const EditProfile = () => {
  const [user, setUser] = useState(null); // user récupéré de l'API
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    phone: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const cropperRef = useRef(null);

  // Charger le profil au montage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await profilService.getProfilLearner();
        setUser(data);
        setFormData({
          name: data?.name || "",
          firstName: data?.firstName || "",
          phone: data?.phone || "",
          email: data?.email || "",
          photo: data?.photo,
        });
        console.log(data);
      } catch (err) {
        toast.error("Impossible de charger le profil");
      }
    };
    fetchUser();
  }, []);

  const urlPath = IMAGE_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCropData = () => {
    if (cropperRef.current?.cropper) {
      setCropData(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    }
  };

  const saveCroppedImage = async () => {
    if (!cropperRef.current) {
      toast.info("Veuillez recadrer l’image avant de l’enregistrer.");
      return;
    }
    cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob) => {
      const form = new FormData();
      form.append("photo", blob);

      try {
        const res = await axios.post(`/update/image`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) {
          toast.success("Photo de profil mise à jour !");
          setCropData(null);
          setImage(null);
        } else {
          toast.error("Erreur lors de l’enregistrement.");
        }
      } catch (err) {
        toast.error("Erreur serveur.");
      }
    }, "image/jpeg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/update/profil`, formData);

      toast.success("Profil mis à jour !");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  if (!user) {
    return <p className="text-center py-10">Chargement du profil...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center px-4">
      <div className="bg-white w-full lg:w-1/2 mx-auto rounded shadow-md p-6">
        <h1 className="text-2xl font-semibold text-purple-600 mb-4">
          Modifier votre profil
        </h1>

        {/* Photo actuelle */}
        <div className="flex flex-col items-center mb-4">
          {!cropData && (
            <img
              src={
                user?.photo
                  ? urlPath + "/img/employes/" + user.photo
                  : "/image/default-avatar.png"
              }
              alt="Profil"
              className="w-40 h-40 rounded-full shadow object-cover"
            />
          )}

          {/* Aperçu crop */}
          {cropData && (
            <img
              src={cropData}
              alt="Cropped"
              className="w-40 h-40 rounded-full shadow object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="mt-2"
          />
        </div>

        {/* Cropper */}
        {image && (
          <div className="mb-4">
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomable={true}
              aspectRatio={1}
              src={image}
              viewMode={1}
              autoCropArea={1}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={getCropData}
                className="bg-purple-500 text-white px-4 py-1 rounded"
              >
                Prévisualiser
              </button>
              <button
                onClick={saveCroppedImage}
                className="bg-purple-700 text-white px-4 py-1 rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {/* Form infos user */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <label className="text-sm">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <label className="text-sm">Téléphone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <label className="text-sm">E-mail</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-1 border rounded text-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-purple-600 text-white rounded"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
