// hooks/useProjectActions.js
import axios from "../config/axios";

export const useProjectActions = ({
  selectedidProjet,
  setSelectedidProjet,
  fetchProjets,
  setNotification,
  setShowNotification,
  setShowConfirmSuprimer,
  setShowConfirmDupliquer,
  setShowConfirmArchiver,
  setShowConfirmReporter,
  setShowConfirmAnnuler,
  setShowConfirmCloturer,
  setShowMenu,
  dateDebut,
  dateFin
}) => {
  const showNotificationMessage = (message, type = "success") => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const askSupressionConfirmation = (idProjet) => {
    setSelectedidProjet?.(idProjet); 
    setShowConfirmSuprimer?.(true);
  };

  const confirmSupression = async () => {
    try {
      await axios.post(`/cfp/projets/${selectedidProjet}/delete`);
      fetchProjets();
      setShowConfirmSuprimer(false);
      showNotificationMessage("Projet supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showNotificationMessage(`Erreur lors de la suppression: ${error.message}`, "error");
    }
  };

  const askDuplicationConfirmation = (idProjet) => {
        setSelectedidProjet?.(idProjet);
        setShowConfirmDupliquer?.(true);
  };

  const confirmDuplication = async () => {
        try {
            const response = await axios.post(`/cfp/projets/${selectedidProjet}/duplicate`);
  
            fetchProjets();
            setShowConfirmDupliquer(false);
            setNotification({ message: 'Projet dupliqué avec succès', type: 'success' });
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
  
        } catch (error) {
            console.error('Erreur lors de la duplication:', error);
            setNotification({ message: `Erreur lors de la duplication: ${error.message}`, type: 'error' });
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        }
  };

  const askArchiverConfirmation = (idProjet) => {
      setSelectedidProjet?.(idProjet);
      setShowConfirmArchiver?.(true);
  };

  const confirmArchiver = async () => {
      try {
          const response = await axios.patch(`/cfp/projets/${selectedidProjet}/archive`);

          fetchProjets();
          setShowConfirmArchiver(false);
          setNotification({ message: 'Projet archivé avec succès', type: 'success' });
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
          console.error('Erreur lors du archive:', error);
          alert(`Erreur lors du archive: ${error.message}`);
      }
  };

  const askAnnulerConfirmation = (idProjet) => {
      setSelectedidProjet?.(idProjet);
      setShowConfirmAnnuler?.(true);
  };

  const confirmAnnuler = async () => {
      try {
          const response = await axios.patch(`/cfp/projets/${selectedidProjet}/cancel`);

          fetchProjets();
          setShowConfirmAnnuler(false);
          setNotification({ message: 'Projet annulé avec succès', type: 'success' });
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
          console.error('Erreur lors du annuler:', error);
          alert(`Erreur lors du annuler: ${error.message}`);
      }
  };

  const askReporterConfirmation = (idProjet) => {
      setSelectedidProjet?.(idProjet);
      setShowConfirmReporter?.(true);
  };

  const confirmReporter = async () => {
      if (!dateDebut || !dateFin) {
          alert('Veuillez renseigner les dates de début et de fin.');
          return;
      }

      try {
          const response = await axios.patch(
              `/cfp/projets/${selectedidProjet}/repport`,
              {
                  project_status: "Repporté",   
                  dateDebut,
                  dateFin
              }
          );

          fetchProjets();
          setShowConfirmReporter(false);
          setNotification({ message: 'Projet reporté avec succès', type: 'success' });
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);

      } catch (error) {
          console.error('Erreur lors du report:', error);
          alert(`Erreur lors du report: ${error.message}`);
      }
  };

  const askCloturerConfirmation = (idProjet) => {
      setSelectedidProjet?.(idProjet);
      setShowConfirmCloturer?.(true);
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
  };
};