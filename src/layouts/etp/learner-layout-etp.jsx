import { Outlet } from "react-router-dom";
import AddLearnerModalEtp from "../../components/Modals/learner/add-modal-etp";
import BatchUploadModal from "../../components/Modals/learner/BatchUploadModal";
import BatchUploadStep2Modal from "../../components/Modals/learner/BatchUploadStep2Modal";
import BatchUploadStep3Modal from "../../components/Modals/learner/BatchUploadStep3Modal";
import EditLearner from "../../components/Modals/learner/EditApprenant";
import EntrepriseModal from "../../components/Modals/learner/entreprise-modal";
import LearnerEntrepriseModal from "../../components/Modals/learner/learner-entreprise-modal";

import { ModalProvider, useModal, MODAL_TYPES } from "../../contexts/cfp/ModalContext";
import { SearchLearnerProvider } from "../../contexts/cfp/SearchLearnerContext";
import { ViewProvider } from "../../contexts/cfp/ViewContext";
import { LearnerProvider } from "../../contexts/cfp/LearnerContext"; // 👈 ajoute ton provider
import LayoutEtp from "./layout-etp";
import { ProjectLearnerProvider } from "../../contexts/cfp/ProjectLearnerContext";
import { EntrepriseProvider } from "../../contexts/etp/TypeEntrepriseContext";
import { EntreprisesProvider } from "../../contexts/etp/EntreprisesContexte";

function ModalRenderer() {
    const { isOpen, type, content, closeModal } = useModal();
    return (
        <>
            {type === MODAL_TYPES.ADD_APPRENANT && <AddLearnerModalEtp isOpen={isOpen} onClose={closeModal} />}
            {type === MODAL_TYPES.BATCH_UPLOAD && <BatchUploadModal isOpen={isOpen} onClose={closeModal} />}
            {type === MODAL_TYPES.BATCH_UPLOAD_STEP2 && <BatchUploadStep2Modal isOpen={isOpen} onClose={closeModal} />}
            {type === MODAL_TYPES.BATCH_UPLOAD_STEP3 && <BatchUploadStep3Modal isOpen={isOpen} onClose={closeModal} />}
            {type === MODAL_TYPES.EDIT_APPRENANT && <EditLearner isOpen={isOpen} onClose={closeModal} apprenant={content} />}
            {type === MODAL_TYPES.APPRENANT_DETAILS && <EntrepriseModal isOpen={isOpen} onClose={closeModal} apprenant={content} />}
            {type === MODAL_TYPES.ENTREPRISE_DETAILS && <LearnerEntrepriseModal isOpen={isOpen} onClose={closeModal} entrepriseData={content} />}
        </>
    );
}

export default function LearnerLayoutEtp() {
    return (
        <ViewProvider>
            <ModalProvider>
                <SearchLearnerProvider>
                    <LearnerProvider>   {/* 👈 ICI */}
                        <ProjectLearnerProvider >
                            <EntreprisesProvider>
                            <EntrepriseProvider>
                            <LayoutEtp>
                                <div id="defaultLayout">
                                    <div className="context">
                                        <Outlet />
                                        {/* <Footer /> */}
                                        <ModalRenderer />
                                    </div>
                                </div>
                            </LayoutEtp>
                            </EntrepriseProvider>
                            </EntreprisesProvider>
                        </ProjectLearnerProvider>
                    </LearnerProvider>
                </SearchLearnerProvider>
            </ModalProvider>
        </ViewProvider>
    );
}
