import { createContext, useState, useContext } from "react";

export const ModalContext = createContext();

export const MODAL_TYPES = {
  ADD_APPRENANT: "addApprenant",
  BATCH_UPLOAD: "batchUpload",
  BATCH_UPLOAD_STEP2: "batchUploadStep2",
  BATCH_UPLOAD_STEP3: "batchUploadStep3",
  EDIT_APPRENANT: "editApprenant",
  APPRENANT_DETAILS: "apprenantDetails",
  ENTREPRISE_DETAILS: "entrepriseDetails",
  AJOUT_EMPLOYE: "ajoutEmploye",
  EDIT_EMPLOYE: "editEmploye",
  AJOUT_APPR_BATCH: "ajoutapprbatch",
  SHOW_EMPL_MODAL: "showempl",
  ADD_APPRENANT_FORM: "addApprenantForm",
  EDIT_APPRENANT_FORM: "editApprenantForm",
};

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: null,
    type: null,
    modalData: null,
  });

  const openModal = (type, content = null, modalData = null) => {
    setModalState({
      isOpen: true,
      content,
      type,
      modalData,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      content: null,
      type: null,
      modalData: null,
    });
  };

  return (
    <ModalContext.Provider
      value={{ ...modalState, openModal, closeModal, MODAL_TYPES }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
