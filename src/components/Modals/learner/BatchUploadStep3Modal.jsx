// BatchUploadStep3Modal.js
import { useState, useRef } from "react";
import { useModal } from "../../../contexts/cfp/ModalContext";
import axios from "../../../config/axios"; // Assurez-vous que votre client axios est correctement configuré
import { useTranslation } from "react-i18next";
import { MODAL_TYPES } from "../../../contexts/cfp/ModalContext";
import toastr from 'toastr';

function BatchUploadStep3Modal({ isOpen, onClose }) {


  const { t, i18n } = useTranslation();
  const { modalData } = useModal();
  const entrepriseId = modalData?.entrepriseId;
  const { openModal } = useModal();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrevious = () => {
    onClose();
    openModal(MODAL_TYPES.BATCH_UPLOAD_STEP2);
  };
  toastr.options = {
    positionClass: "toast-top-center", // ou "toast-bottom-left"
    timeOut: 6000,
    progressBar: true,
  };

  // useEffect(() => {
  //   if (entrepriseId) {
  //     console.log('ID de l\'entreprise dans Step 3:', entrepriseId);
  //   }
  // }, [entrepriseId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadError("Veuillez sélectionner un fichier");
      return;
    }

    setIsLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('data', file);
    formData.append('idEntrepriseExcel', entrepriseId); // Utilisation de l'ID transmis

    try {
      const response = await axios.post('/cfp/apprenants/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        const errorMessage = response.data.error;
        setUploadError(errorMessage);
        toastr.error(errorMessage);
        return;
      }

      setUploadSuccess(true);
      setFile(null);
      setUploadError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toastr.success(response.data.success || t('success_added'));
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 900);


    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);

      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        setUploadError(errorMessage);
        toastr.error(errorMessage);
      } else {
        const defaultMessage = t('upload_error');
        setUploadError(defaultMessage);
        toastr.error(defaultMessage);
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 transition-opacity duration-300 opacity-100 backdrop-custom-blur backdrop-brightness-75">
      <div onClick={onClose} className="absolute inset-0" />

      <div
        className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 translate-x-0`}
        style={{ width: "42%", minWidth: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 !shadow-sm">
            <h1 className="text-lg font-medium text-gray-500">
              {t('add_learners')}
            </h1>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div id="addStepThree">
              <div className="main_loading_part">
                {isLoading &&

                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <p className="text-blue-600">{t('upload_in_progress')}</p>

                  </div>
                }
                {uploadSuccess && <p className="text-green-500">{t('success_added')}</p>}
                {uploadError && <p className="text-red-500">{uploadError}</p>}
              </div>
              <div
                id="dropzone"
                className="relative flex flex-col justify-center w-full gap-3 py-4 text-center border border-gray-300 rounded-md cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="text-2xl text-gray-400 fa-solid fa-upload"></i>
                <p id="dropzone-text" className="text-gray-500">
                  {t('drag_and_drop_files_here_or_click')}
                </p>
                <label
                  htmlFor="dataExcel"
                  className="py-2 bg-gray-100 cursor-pointer"
                >
                  {t('upload_your_file')}
                  <input
                    id="dataExcel"
                    ref={fileInputRef}
                    type="file"
                    hidden
                    name="data"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {file && (
                <div id="file-details" className="mt-4">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                    <div>
                      <p id="file-name" className="font-medium">{file.name}</p>
                      <p id="file-size" className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <i
                      id="remove-file"
                      className="p-2 text-gray-500 cursor-pointer fa-solid fa-xmark hover:bg-gray-200"
                      onClick={handleRemoveFile}
                    ></i>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end !space-x-4 p-4 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              className="!px-3 !py-2 !ml-3 !text-base !text-gray-600 !transition !duration-200 !bg-gray-200 !rounded-md !cursor-pointer !focus:outline-none !hover:bg-gray-300/80"
              style={{ minWidth: "150px" }}
            >
              {t('previous')}
            </button>
            <button
              onClick={handleSubmit}
              className="!focus:outline-none !px-3 !bg-[#A462A4] !py-2 !ml-3 !rounded-md !text-white !hover:bg-[#A462A4]/90 !transition !duration-200 !text-base !cursor-pointer"
              style={{ minWidth: "150px" }}
              disabled={isLoading || !file}
            >
              {isLoading ? t('downloading') : t('add_students')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchUploadStep3Modal;