import { useState, useEffect, useRef } from "react";
import { useModal, MODAL_TYPES } from "../../../contexts/etp/ModalContext";
import { useTranslation } from "react-i18next";
import axios from "../../../config/axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../../config/env";

function EditLearner() {
  const endpoint =
    IMAGE_URL;
  const { t } = useTranslation();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [matricule, setMatricule] = useState("");
  const [mail, setMail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [lot, setLot] = useState("");
  const [quartier, setQuartier] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const { closeModal, isOpen, type, modalData } = useModal();

  const [apprenant, setApprenant] = useState(null);
  const [etps, setEtps] = useState([]);
  const [villes, setVilles] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedEtp, setSelectedEtp] = useState("");

  const [search, setSearch] = useState("");
  const [filteredEtps, setFilteredEtps] = useState(etps);
  const [showList, setShowList] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const results = etps.filter((etp) =>
      etp.etp_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEtps(results);
  }, [search, etps]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChange = (event) => {
    setSelectedEtp(event.target.value);
  };

  useEffect(() => {
    setIsVisible(isOpen && type === MODAL_TYPES.EDIT_EMPLOYE);
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen && type === MODAL_TYPES.EDIT_EMPLOYE && modalData?.idEmploye) {
      axios
        .get(`/etp/employes/${modalData.idEmploye}/edit`)
        .then((res) => {
          if (res.data.status === 200) {
            setApprenant(res.data.apprenant);
            setNom(res.data.apprenant.emp_name || "");
            setPrenom(res.data.apprenant.emp_firstname || "");
            setMatricule(res.data.apprenant.emp_matricule || "");
            setMail(res.data.apprenant.emp_email || "");
            setTelephone(res.data.apprenant.emp_phone || "");
            setLot(res.data.apprenant.user_addr_lot || "");
            setQuartier(res.data.apprenant.user_addr_quartier || "");
            setVille(
              res.data.apprenant.idVille
                ? res.data.apprenant.idVille.toString()
                : ""
            );
            setCodePostal(res.data.apprenant.user_addr_code_postal || "");
            setEtps(res.data.etps);
            setVilles(res.data.villes);
            setError("");
            setSuccessMessage("");

            const defaultEtp = res.data.etps.find(
              (etp) =>
                etp.etp_name?.toLowerCase() ===
                res.data.apprenant.etp_name?.toLowerCase()
            );

            if (defaultEtp) {
              setSelectedEtp(defaultEtp.idEtp.toString());
              setSearch(defaultEtp.etp_name);
            } else {
              setSelectedEtp("");
              setSearch(res.data.apprenant.etp_name || "");
            }
          } else {
            setError(res.data.message || t("error_fetching_data"));
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
          setError(t("error_fetching_data"));
          toastr.error(
            error.response?.data?.message || t("error_fetching_data")
          );
        });
    }
  }, [isOpen, type, modalData, t]);

  const handleSave = async () => {
    if (!apprenant?.idEmploye) {
      setError("L'ID de l'employé est manquant.");
      return;
    }

    if (!selectedEtp || selectedEtp === "0") {
      setError(t("instructionEtp"));
      return;
    }

    const updatedData = {
      emp_name: nom,
      emp_firstname: prenom,
      emp_matricule: matricule,
      emp_email: mail,
      emp_phone: telephone,
      emp_lot: lot,
      emp_qrt: quartier,
      emp_cp: codePostal,
      idVille: Number(ville),
      idEntreprise: Number(selectedEtp),
    };

    try {
      const response = await axios.patch(
        `/etp/employes/${apprenant.idEmploye}`,
        updatedData
      );

      if (response.data.success) {
        toastr.success(response.data.success);
        setError("");
        setTimeout(closeModal, 1500);
        setTimeout(() => {
          window.location.reload();
        }, 700);
      } else {
        setError(response.data.message || t("update_failed"));
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      if (error.response?.data?.error) {
        setError(Object.values(error.response.data.error).flat().join(", "));
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(t("error_occurred"));
      }
    }
  };

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
    if (
      cropperRef.current &&
      typeof cropperRef.current.cropper !== "undefined"
    ) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        setCroppedImage(croppedCanvas.toDataURL("image/jpeg"));
        setIsCropping(false);
      }
    }
  };

  const handleUploadImage = async () => {
    if (!croppedImage) {
      console.error("Aucune image recadrée.");
      setError("Veuillez d'abord recadrer une image.");
      return;
    }

    if (!apprenant?.idEmploye) {
      console.error("ID de l'apprenant manquant.");
      setError(
        "Impossible d'identifier l'apprenant pour la mise à jour de la photo."
      );
      return;
    }

    try {
      const response = await axios.post(
        `/cfp/apprenants/${apprenant.idEmploye}/updatePhoto`,
        { image: croppedImage },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status === 200 && data.imageName) {
        setApprenant({ ...apprenant, emp_photo: data.imageName });
        toastr.success(data.success);
        setError("");
        setShowPhotoModal(false);
        setIsCropping(false);
        setCroppedImage(null);
        setSelectedImage(null);
      } else {
        console.error("Réponse inattendue du serveur:", data);
        setError(data.error || data.message || t("upload_failed"));
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      setError(error.response?.data?.error || t("network_error"));
    }
  };

  if (!isOpen || type !== MODAL_TYPES.EDIT_EMPLOYE || !apprenant) return null;

  return (
    <div
      className={`backdrop-custom-blur backdrop-brightness-75 fixed inset-0 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div onClick={closeModal} className="absolute inset-0" />

      <div
        className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "42%", minWidth: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 shadow-sm">
            <h1 className="text-lg font-medium text-gray-500">
              {t("edit_student")}
            </h1>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {error && <div className="text-red-500">{error}</div>}
            {successMessage && (
              <div className="text-green-500">{successMessage}</div>
            )}

            <div className="grid w-full grid-cols-9">
              <div className="grid items-center justify-center w-full col-span-3">
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="flex items-center justify-center w-24 h-24 overflow-hidden text-3xl font-medium text-gray-500 uppercase bg-gray-100 border border-gray-300 rounded-full emp_photo_detail">
                    {apprenant.emp_photo ? (
                      <img
                        src={`${endpoint}/img/employes/${apprenant.emp_photo}`}
                        alt="photo"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full">
                        {apprenant.emp_firstname?.charAt(0) || "?"}
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
                    {t("changeProfile")}
                  </label>

                  {selectedImage && isCropping && (
                    <div className="mt-2">
                      <Cropper
                        ref={cropperRef}
                        src={selectedImage}
                        style={{ height: 200, width: "100%" }}
                        aspectRatio={1}
                        viewMode={1}
                        guides={true}
                        cropBoxMovable={true}
                        cropBoxResizable={true}
                        autoCropArea={1}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleCrop}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-green-500 shadow-md btn btn-sm rounded-xl hover:bg-green-600 hover:shadow-lg"
                        >
                          {t("cropImage")}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setIsCropping(false);
                          }}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-gray-400 shadow-md btn btn-sm rounded-xl hover:bg-gray-500 hover:shadow-lg"
                        >
                          {t("cancel")}
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
                        <button
                          onClick={handleUploadImage}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-green-500 shadow-md btn btn-sm rounded-xl hover:bg-green-600 hover:shadow-lg"
                        >
                          {t("upload")}
                        </button>
                        <button
                          onClick={() => {
                            setCroppedImage(null);
                            setSelectedImage(null);
                          }}
                          className="px-4 py-2 font-semibold text-white transition duration-300 ease-in-out bg-gray-400 shadow-md btn btn-sm rounded-xl hover:bg-gray-500 hover:shadow-lg"
                        >
                          {t("cancel")}
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
                      <label
                        htmlFor="emp_name_edit"
                        className="text-sm font-medium text-slate-700"
                      >
                        {t("name")}
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
                          minWidth: "420px",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "0.375rem",
                          paddingLeft: "0.5rem",
                          paddingRight: "0.5rem",
                          height: "2.5rem",
                          boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label
                        htmlFor="emp_firstname_edit"
                        className="text-sm font-medium text-slate-700"
                      >
                        {t("firstname")}
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
                          minWidth: "420px",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "0.375rem",
                          paddingLeft: "0.5rem",
                          paddingRight: "0.5rem",
                          height: "2.5rem",
                          boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <input
                type="hidden"
                id="id_apprenant_hidden"
                value={apprenant.idEmploye || ""}
              />
              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_matricule_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("serial_number")}
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="text"
                    id="emp_matricule_edit"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_email_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("email")}
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
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_phone_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("phone_number")}
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
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative mb-4" ref={containerRef}>
              <label
                className="block mb-2 text-sm text-gray-700"
                htmlFor="entreprise_search"
              >
                {t("companies_list")}
              </label>

              <input
                id="entreprise_search"
                type="text"
                placeholder={t("select_company")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={() => setShowList(true)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />

              {showList && (
                <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md max-h-40">
                  {filteredEtps.length === 0 && (
                    <li className="p-2 text-gray-400">{t("no_results")}</li>
                  )}
                  {filteredEtps.map((etp) => (
                    <li
                      key={etp.idEtp}
                      onClick={() => {
                        setSelectedEtp(etp.idEtp);
                        setSearch(etp.etp_name);
                        setShowList(false);
                      }}
                      className={`p-2 text-sm cursor-pointer hover:bg-purple-100 ${
                        selectedEtp === etp.idEtp ? "bg-purple-200" : ""
                      }`}
                    >
                      {etp.etp_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_lot_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("lot")}
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="text"
                    id="emp_lot_edit"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_qrt_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("neighbourhood")}
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="text"
                    id="emp_qrt_edit"
                    value={quartier}
                    onChange={(e) => setQuartier(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col w-full gap-1">
                <label
                  htmlFor="ville"
                  className="text-sm font-medium text-gray-600"
                >
                  {t("city")}
                </label>
                <select
                  name="ville"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border rounded"
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "0.375rem",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    height: "2.5rem",
                    boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                    width: "100%",
                  }}
                >
                  <option value="">{t("select_city")}</option>
                  {villes.map((v) => (
                    <option key={v.idVille} value={v.idVille}>
                      {v.ville}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col w-full gap-1">
                <span className="inline-flex items-center w-full gap-2">
                  <label
                    htmlFor="emp_cp_edit"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t("zip_code")}
                  </label>
                </span>
                <div className="relative inline-flex w-full">
                  <input
                    type="number"
                    id="emp_cp_edit"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    className="w-full text-sm outline-none input input-bordered"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                      height: "2.5rem",
                      boxShadow: "inset 0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4 space-x-6 border-t border-gray-300">
            <button
              onClick={closeModal}
              className="px-1 py-2 text-sm text-gray-700 bg-white border border-black rounded-lg hover:bg-gray-200 hover:border-gray-700"
              style={{ minWidth: "150px", minHeight: "50px" }}
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-1 py-2 text-sm btn btn-primary bg-[#A462A4] text-white rounded-lg hover:bg-[#9c27b0]"
              style={{ minWidth: "200px" }}
            >
              {t("save_changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditLearner;
