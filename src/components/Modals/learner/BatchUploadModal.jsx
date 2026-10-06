// BatchUploadModal.js
import { useState, useEffect, useContext } from "react";
import { ModalContext, MODAL_TYPES } from "../../../contexts/cfp/ModalContext";
import axios from "../../../config/axios";
import { useTranslation } from 'react-i18next';


function BatchUploadModal() {
  const { isOpen, type, closeModal, openModal } = useContext(ModalContext);
  const [isVisible, setIsVisible] = useState(false);
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");
  const [error, setError] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && type === MODAL_TYPES.BATCH_UPLOAD) {
      axios.get('/cfp/apprenants/entreprise')
        .then(response => {
          setEntreprises(response.data?.entreprises || []);
        })

        .catch(error => {
          if (error.response?.status === 404) {
            setEntreprises([]);
            setError(t('Aucune entreprise trouvée.'));
          } else {
            setError('Erreur lors du chargement des entreprises.');
          }
        });
    }
  }, [isOpen, type]);

  const handleNext = () => {
    if (!selectedEntreprise) {
      setError(t('instructionEtp'));
      return;
    }

    closeModal();
    openModal(MODAL_TYPES.BATCH_UPLOAD_STEP2, null, { entrepriseId: selectedEntreprise });
  };

  if (!isOpen || type !== MODAL_TYPES.BATCH_UPLOAD) return null;

  return (
    <div
      className={`backdrop-custom-blur backdrop-brightness-75 fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div onClick={closeModal} className="absolute inset-0" />

      <div
        className={`absolute right-0 top-0 h-full bg-white !shadow-xl transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ width: "42%", minWidth: "500px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 shadow-sm">
            <h1 className="text-lg font-medium text-gray-500">
              {t('add_learners')}
            </h1>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <label htmlFor="main_appr_idEntreprise" className="text-gray-600 text-base after:content-['*'] after:ml-0.5 after:text-red-500">
                {t('company')}
              </label>
              <select
                name="idEntreprise"
                id="main_appr_idEntreprise"
                className="form-control outline-none w-full text-gray-400
                  bg-transparent pl-2 h-10 border-[1px] border-[#A462A4] rounded-md hover:border-purple-500
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-100 duration-200"
                style={{
                  appearance: "auto",
                  borderWidth: "2px",
                  borderColor: "#8d4b8e",
                }}
                required
                value={selectedEntreprise}
                onChange={(e) => setSelectedEntreprise(e.target.value)}
              >
                <option value="" disabled>
                  {t('placeholder_select_company')}
                </option>
                {entreprises.map((etp) => (
                  <option key={etp.idEtp} value={etp.idEtp}>
                    {etp.etp_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full gap-1 mt-4">
              <p>{t('download_excel_instruction')}
              </p>

              <a href="https://apprenants.forma-fusion.com/addEmpExcel/Data.xlsx" download="" className="outline-none w-auto hover:text-[#A462A4] bg-transparent py-2 text-purple-500 duration-200">
                {t('click_here_download_excel')}
              </a>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end !space-x-4 p-4 border-t border-gray-100">
            <button
              onClick={closeModal}
              className="!px-3 !py-2 !ml-3 !text-base !text-gray-600 !transition !duration-200 !bg-gray-200 !rounded-md !cursor-pointer !focus:outline-none !hover:bg-gray-300/80"
              style={{ minWidth: "150px" }}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleNext}
              className="flex gap-2 inline-flex !items-center justify-center rounded bg-[#A462A4] px-3 !py-2 transition duration-200 ease-in-out !text-white"
              style={{ minWidth: "150px" }}
            >
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchUploadModal;