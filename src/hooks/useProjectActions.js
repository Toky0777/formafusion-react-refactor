import axios from "../config/axios";

export const useProjectActions = ({
  selectedidProjet,
  setSelectedidProjet,
  setNotification,
  setShowNotification,
  setShowConfirmSuprimer,
  setShowConfirmDupliquer,
  setShowConfirmArchiver,
  setShowConfirmReporter,
  setShowConfirmAnnuler,
  setShowConfirmCloturer,
  setShowConfirmProgramer,
  setShowConfirmRestoration,
  fetchProjetsByStatus,
  setLoading,
  setProjets,
  dateDebut,
  dateFin,
}) => {
  // Affichage de notification
  const showNotificationMessage = (message, type = "success") => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Fonction générique pour les actions avec refetch
  const performAction = async ({ url, successMessage, hideModal, data }) => {
    try {
      setLoading(true);
      await axios.patch(url, data || {});
      await fetchProjetsByStatus();
      hideModal?.();
      showNotificationMessage(successMessage);
    } catch (error) {
      console.error(`Erreur lors de l'action ${url}:`, error);
      showNotificationMessage(`Erreur : ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // CONFIRMATIONS
  const askConfirmation = (setter, idProjet) => {
    setSelectedidProjet(idProjet);
    setter(true);
  };

  const askSupressionConfirmation = (idProjet) => askConfirmation(setShowConfirmSuprimer, idProjet);
  const askDuplicationConfirmation = (idProjet) => askConfirmation(setShowConfirmDupliquer, idProjet);
  const askArchiverConfirmation = (idProjet) => askConfirmation(setShowConfirmArchiver, idProjet);
  const askAnnulerConfirmation = (idProjet) => askConfirmation(setShowConfirmAnnuler, idProjet);
  const askReporterConfirmation = (idProjet) => askConfirmation(setShowConfirmReporter, idProjet);
  const askCloturerConfirmation = (idProjet) => askConfirmation(setShowConfirmCloturer, idProjet);
  const askProgramationConfirmation = (idProjet) => askConfirmation(setShowConfirmProgramer, idProjet);
  const askRestorationConfirmation = (idProjet) => askConfirmation(setShowConfirmRestoration, idProjet);

  const confirmSupression = async () => {
    try {
      setShowConfirmSuprimer(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/trash`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmDuplication = async () => {
    try {
      setShowConfirmDupliquer(false);
      const response = await axios.post(`/cfp/projets/${selectedidProjet}/duplicate`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet dupliqué avec succès");
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmArchiver = async () => {
    try {
      setShowConfirmArchiver(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/archive`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet archivé avec succès");
    } catch (error) {
      console.error("Erreur lors de la archive:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmAnnuler = async () => {
    try {
      setShowConfirmAnnuler(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/cancel`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet annulé avec succès");
    } catch (error) {
      console.error("Erreur lors de la archive:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmReporter = async () => {
    try {
      setShowConfirmReporter(false);
      const response = await axios.patch(
                `/cfp/projets/${selectedidProjet}/repport`,
                {
                    project_status: "Repporté",   
                    dateDebut,
                    dateFin
                }
      );

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet repporté avec succès");
    } catch (error) {
      console.error("Erreur lors de la reporte:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmProgramation = async () => {
    try {
      setShowConfirmProgramer(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/confirm`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet validé avec succès");
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const confirmRestoration = async () => {
    try {
      setShowConfirmRestoration(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/restore`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet restoré avec succès");
    } catch (error) {
      console.error("Erreur lors de la restoration:", error);
      showNotificationMessage(`Erreur lors de la restorationion: ${error.message}`, "error");
    }
  };

  const confirmCloturer = async () => {
    try {
      setShowConfirmCloturer(false);
      const response = await axios.patch(`/cfp/projets/${selectedidProjet}/close`);

      if(response.status === 200){
        setProjets(prev => prev.filter(projet => projet.idProjet !== selectedidProjet));
      }

      showNotificationMessage("Projet cloturé avec succès");
    } catch (error) {
      console.error("Erreur lors de la cloturaion:", error);
      showNotificationMessage(`Erreur lors de la cloture: ${error.message}`, "error");
    }
  };

  return {
    askSupressionConfirmation,
    confirmSupression,
    askDuplicationConfirmation,
    confirmDuplication,
    askArchiverConfirmation,
    confirmArchiver,
    askReporterConfirmation,
    confirmReporter,
    askAnnulerConfirmation,
    confirmAnnuler,
    askCloturerConfirmation,
    askProgramationConfirmation,
    askRestorationConfirmation,
    confirmProgramation,
    confirmRestoration,
    confirmCloturer,
  };
};
