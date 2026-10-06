import { createContext, useState, useContext } from "react";

// Crée et exporte le contexte
export const ModalContext = createContext();

// Définit les types de modales pour éviter les erreurs de frappe
export const MODAL_TYPES = {
  BATCH_UPLOAD: "batchUpload",
  BATCH_UPLOAD_STEP2: "batchUploadStep2",
  BATCH_UPLOAD_STEP3: "batchUploadStep3",
  EDIT_APPRENANT: "editApprenant",
  APPRENANT_DETAILS: "apprenantDetails",
  ENTREPRISE_DETAILS: "entrepriseDetails",
  AJOUT_EMPLOYE: "ajoutEmploye",
  EDIT_EMPLOYE: "editEmploye",
  AJOUT_APPR_BATCH: "ajoutapprbatch",
  SHOW_EMPL: "showEmpl",
  ADD_APPRENANT_FORM: "addApprenantForm",
  EDIT_APPRENANT_FORM: "editApprenantForm",
};

// Le fournisseur de contexte (Provider)
export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: null,
    type: null,
    modalData: null,
  });

  // Fonction pour ouvrir une modale (accepte objet OU params séparés)
  const openModal = (type, modalData = null, content = null) => {
    if (typeof type === "object" && type.type) {
      // Cas: openModal({ type: ..., content: ..., modalData: ... })
      setModalState({
        isOpen: true,
        content: type.content || null,
        type: type.type,
        modalData: type.modalData || null,
      });
    } else {
      // Cas: openModal(MODAL_TYPES.EDIT_EMPLOYE, { idEmploye: id })
      setModalState({
        isOpen: true,
        content,
        type,
        modalData,
      });
    }
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setModalState({
      isOpen: false,
      content: null,
      type: null,
      modalData: null,
    });
  };

  // Les valeurs fournies par le contexte
  const value = { ...modalState, openModal, closeModal, MODAL_TYPES };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

// Hook personnalisé pour une utilisation simple
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error(
      "useModal doit être utilisé à l'intérieur d'un ModalProvider"
    );
  }
  return context;
};