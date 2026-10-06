// BatchUploadStep2Modal.js
import { useModal, MODAL_TYPES } from "../../../contexts/cfp/ModalContext";
import { useTranslation } from "react-i18next";

function BatchUploadStep2Modal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { modalData, openModal } = useModal();
  const entrepriseId = modalData?.entrepriseId;

  const handlePrevious = () => {
    onClose();
    openModal(MODAL_TYPES.BATCH_UPLOAD);
  };

  const handleNext = () => {
    if (!entrepriseId) {
      // Gérer le cas où l'ID de l'entreprise n'est pas disponible (devrait rarement arriver)
      console.error("L'ID de l'entreprise n'a pas été transmis à l'étape 2.");
      return;
    }
    openModal(MODAL_TYPES.BATCH_UPLOAD_STEP3, null, { entrepriseId: entrepriseId });
  };

  // useEffect(() => {
  //   if (isOpen && entrepriseId) {
  //     // Effectuer toute logique nécessaire avec l'ID de l'entreprise dans cette étape
  //     console.log('Entreprise ID dans Step 2:', entrepriseId);
  //   }
  // }, [isOpen, entrepriseId]);

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
            <h1 className="text-lg font-medium text-gray-500"> {t('instructions_title')} </h1>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-col w-full my-2">
              <h1 className="!mb-4 !text-1xl !font-semibold">{t('instructions_excel')}</h1>
              <ol className="!space-y-4 !list-decimal">
                <div className="!p-4 !bg-white !border !border-gray-300 !rounded !shadow-sm">
                  <li>
                    <strong className="text-gray-700">{t('excel_note_use_only')}</strong>
                    <br />
                    {t('excel_note_structure')}
                  </li>
                </div>
                <div className="!p-4 !bg-white !border !border-gray-300 !rounded !shadow-sm">
                  <li >
                    <strong className="text-gray-700">{t('required_columns')} :</strong>
                    <ul className="mt-2 ml-6 list-disc">
                      <li>
                        <strong className="text-gray-700">{t('name')}</strong> :{t('excel_note_fullname_required')}
                      </li>
                    </ul>
                    {t('columns')} <strong> Nom</strong> {t('excel_note_required_columns')}
                  </li>
                </div>
                <div className="!p-4 !bg-white !border !border-gray-300 !rounded !shadow-sm">
                  <li >
                    <strong className="text-gray-700">{t('email_or_serial')} :</strong>
                    <br />
                    {t('unique_email_or_serial_note')}
                  </li>
                </div>
              </ol>
            </div>


            {/* Zone d'upload (peut-être un aperçu des instructions) */}
          </div>

          <div className="flex justify-end !space-x-6 p-4 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              className="!px-3 !py-2 !ml-3 !text-base !text-gray-600 !transition !duration-200 !bg-gray-200 !rounded-md !cursor-pointer !focus:outline-none !hover:bg-gray-300/80"
              style={{ minWidth: "150px" }}
            >
              {t('previous')}
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

export default BatchUploadStep2Modal;