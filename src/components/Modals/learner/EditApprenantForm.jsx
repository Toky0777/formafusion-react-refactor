import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import axios from "../../../config/axios";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import toast, { Toaster } from "react-hot-toast";
import { IMAGE_URL } from "../../../config/env";

const EditApprenantForm = ({ closeModal, isOpen, idEmploye, apprenant, fetchApprenants }) => {
  const { t } = useTranslation();
  const endpoint = IMAGE_URL;

  // -- State Declarations --
  const [selectedImage, setSelectedImage] = useState(null);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [loading, setLoading] = useState(false);
  const [mail, setMail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [lot, setLot] = useState("");
  const [quartier, setQuartier] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");

  // State for photo and cropper
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);

  // State for API data
  const [villes, setVilles] = useState([]);
  const [etps, setEtps] = useState("");


  // State for company form management
  const [selectedEtp, setSelectedEtp] = useState(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const containerRef = useRef(null);

  // State for error and success messages
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setSelectedEtp(apprenant.id_etp || "")
    setMatricule(apprenant.emp_matricule || "")
    setNom(apprenant.emp_name || "");
    setPrenom(apprenant.emp_firstname || "");
    setMatricule(apprenant.emp_matricule || "");
    setMail(apprenant.emp_email || "");
    setTelephone(apprenant.emp_phone || "");
    setEtps(apprenant.etp_name || "")
  }, [apprenant]);
  const handleImageInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current && typeof cropperRef.current.cropper !== 'undefined') {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        setCroppedImage(croppedCanvas.toDataURL('image/jpeg'));
        setIsCropping(false);
      }
    }
  };

  const handleUploadImage = async () => {
    if (!croppedImage) {
      setError("Veuillez d'abord recadrer une image.");
      return;
    }

    if (!apprenant?.idEmploye) {
      setError("Impossible d'identifier l'apprenant pour la mise à jour de la photo.");
      return;
    }

    try {
      const response = await axios.post(
        `/form/apprenants/${apprenant.idEmploye}/updatePhoto`,
        { image: croppedImage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("Image mises à jour  avec succès!");
      fetchApprenants();
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      setError(error.response?.data?.error || t('network_error'));
    }
  };

  const handleSave = async () => {
    if (!idEmploye) {
      setError("L'ID de l'apprenant est manquant.");
      return;
    }

    const updatedData = {
      emp_name: nom,
      emp_firstname: prenom,
      emp_matricule: matricule,
      emp_email: mail,
      emp_phone: telephone,
      idEntreprise: Number(selectedEtp)
    };

    try {
      const response = await axios.patch(`/form/apprenants/${idEmploye}`, updatedData);


      if (response.status === 200) {
        toast.success("Informations mises à jour  avec succès!");
        setError("");
        fetchApprenants();
      } else {
        setError(response.data.message || t('update_failed'));
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      console.error("Réponse d'erreur:", error.response);

      if (error.response?.data?.error) {
        const errors = Object.values(error.response.data.error).flat();
        setError(errors.join(', '));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t('error_occurred'));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm z-40 bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <Toaster position='top-right' reverseOrder={false} toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        removeDelay: 1000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}></Toaster>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 1 }}
        className="fixed right-0 top-0 h-full bg-white w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[45%] z-50 shadow-lg p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 shadow-sm">
            <h1 className="text-lg font-medium text-gray-500">
              {t('edit_student')}
            </h1>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {error && <div className="p-2 text-sm text-gray-700 bg-red-100 border border-red-400 rounded-md">{error}</div>}
            {loading && <div className=" flex items-center justify-center backdrop-blur-sm z-40 bg-black bg-opacity-50">
              <span className="text-white text-xl">Chargement...</span>
            </div>}
            {successMessage && <div className="text-green-500">{successMessage}</div>}

            <div className="grid w-full grid-cols-9">
              <div className="grid items-center justify-center w-full col-span-3">
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="flex items-center justify-center w-24 h-24 overflow-hidden text-3xl font-medium text-gray-500 uppercase bg-gray-100 border border-gray-300 rounded-full emp_photo_detail">
                    {apprenant?.emp_photo ? (
                      <img
                        src={`${endpoint}/img/employes/${apprenant.emp_photo}`}
                        alt="photo"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full">
                        {apprenant?.emp_firstname?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    id="logofile-1457"
                    className="relative hidden sr-only peer"
                    onChange={handleImageInputChange}
                    accept="image/*"
                  />
                  <label
                    htmlFor="logofile-1457"
                    className="!rounded-md !flex !items-center !gap-1 !bg-white !border !justify-center !px-2 !py-1 !hover:!bg-gray-100 !duration-200 !cursor-pointer"
                  >
                    <i className="text-sm fa-solid fa-pen"></i>
                    {t('changeProfile')}
                  </label>

                  {selectedImage && isCropping && (
                    <div className="mt-2">
                      <Cropper
                        ref={cropperRef}
                        src={selectedImage}
                        style={{ height: 200, width: '100%' }}
                        aspectRatio={1}
                        viewMode={1}
                        guides={true}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        autoCropArea={1}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleCrop} className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-green-500 shadow-md btn btn-sm rounded-xl hover:bg-green-600 hover:shadow-lg">
                          {t('cropImage')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setIsCropping(false);
                          }}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-gray-400 shadow-md btn btn-sm rounded-xl hover:bg-gray-500 hover:shadow-lg"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {croppedImage && !isCropping && (
                    <div className="mt-2">
                      <img
                        src={croppedImage}
                        alt="Recadrée"
                        className="object-cover w-24 h-24 rounded-full"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleUploadImage} className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-green-500 shadow-md btn btn-sm rounded-xl hover:bg-green-600 hover:shadow-lg">
                          {t('upload')}
                        </button>
                        <button
                          onClick={() => {
                            setCroppedImage(null);
                            setSelectedImage(null);
                          }}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-gray-400 shadow-md btn btn-sm rounded-xl hover:bg-gray-500 hover:shadow-lg"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid col-span-6 grid-cols-subgrid">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label htmlFor="emp_name_edit" className="text-sm font-medium text-slate-700">
                        Nom
                      </label>
                    </span>
                    <div className="relative inline-flex w-full">
                      <input
                        type="text"
                        id="emp_name_edit"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full text-sm outline-none input input-bordered"
                        style={{
                          minWidth: '420px',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '0.375rem',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem',
                          height: '2.5rem',
                          boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label htmlFor="emp_firstname_edit" className="text-sm font-medium text-slate-700">
                        Prenom
                      </label>
                    </span>
                    <div className="relative inline-flex w-full">
                      <input
                        type="text"
                        id="emp_firstname_edit"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        className="w-full text-sm outline-none input input-bordered"
                        style={{
                          minWidth: '420px',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '0.375rem',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem',
                          height: '2.5rem',
                          boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label htmlFor="emp_email_edit" className="text-sm font-medium text-slate-700">
                    {t('email')}
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="email"
                    id="emp_email_edit"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '0.375rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      height: '2.5rem',
                      boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
                      width: '100%',
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label htmlFor="emp_phone_edit" className="text-sm font-medium text-slate-700">
                    Phone
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="tel"
                    id="emp_phone_edit"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '0.375rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      height: '2.5rem',
                      boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
                      width: '100%',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mb-4" ref={containerRef}>
              <label className="block mb-2 text-sm text-gray-700" htmlFor="entreprise_search">
                Entreprise
              </label>
              <input
                id="entreprise_search"
                type="text"
                placeholder={t('select_company')}
                value={etps}
                onChange={(e) => setEtps(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

          </div>
          <div className="flex items-center justify-end p-4 bg-gray-50 border-t">
            <button
              onClick={handleSave}
              disabled={loading || fetchError}
              className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-purple-500 shadow-md btn btn-sm rounded-xl hover:bg-purple-600 hover:shadow-lg"
            >
              {t('save_changes')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditApprenantForm;