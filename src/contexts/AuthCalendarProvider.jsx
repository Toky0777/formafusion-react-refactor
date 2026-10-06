import { useEffect, useState, createContext, useContext } from 'react';
import axios from '../config/axios';
import { gapi } from 'gapi-script';
import { useAuth } from './AuthContext';
import { Outlet } from 'react-router-dom';
import { GOOGLE_CONFIG } from '../config/env';

const GoogleCalendarContext = createContext(null);

export const useGoogleCalendar = () => {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error('useGoogleCalendar must be used within a AuthCalendarProvider');
  }
  return context;
};

// TOKEN can remain a `let` if you prefer, but often a useState is better
let TOKEN = null;



export const AuthCalendarProvider = ({ children }) => {

  const [isTokenValid, setIsTokenValid] = useState(false);
  const googleConfig = {
    ...GOOGLE_CONFIG,
    SCOPES: (GOOGLE_CONFIG.SCOPES || "").split(","),
  };

  const auth = useAuth();

  const loadCredentials = async () => {
    try {
      await initializeGoogleAuth(googleConfig);
      await checkTokenStatus();
    } catch (error) {
      // console.warn('Erreur de chargement des credentials:', error);
    }
  };

  const initializeGoogleAuth = async (config) => {
    await Promise.all([
      loadScript('https://apis.google.com/js/api.js'),
      loadScript('https://accounts.google.com/gsi/client'),
    ]);

    await new Promise((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: googleConfig.API_KEY,
          discoveryDocs: [googleConfig.DISCOVERY_DOC],
        });

        resolve();
      });
    });
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const checkTokenStatus = async () => {
    const storedToken = localStorage.getItem('token_google');
    if (!storedToken) {
      // showAlert('Aucun token trouvé - Synchronisation requise', 'error');
      setIsTokenValid(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?token=${storedToken}`
      );

      if (data.error) {
        showAlert('Token expiré - Reconnectez-vous', 'error');
        localStorage.removeItem('token');
        TOKEN = null;
        setIsTokenValid(false);
      } else {
        TOKEN = { token: storedToken };
        gapi.client.setToken(TOKEN);
        showAlert('Token valide - Synchronisation active', 'success');
        setIsTokenValid(true);
      }
    } catch (error) {
      
      showAlert('Erreur de vérification du token google calendar', 'error');
      setIsTokenValid(false);
    }
  };

  const handleAuthClick = () => {
    // console.log("appelé");
    if (!googleConfig || !googleConfig.CLIENT_ID) {
      console.warn("CLIENT_ID n'est pas encore chargé.");
      showAlert("Configuration Google non chargée. Veuillez réessayer.", 'error');
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleConfig.CLIENT_ID,
      scope: googleConfig.SCOPES.join(' '),
      callback: async (response) => {
        if (response.error) {
          showAlert("Échec de l'authentification", 'error');
          return;
        }

        TOKEN = response;
        localStorage.setItem('token_google', response.token);
        gapi.client.setToken(TOKEN);
        showAlert('Authentification réussie', 'success');
        setIsTokenValid(true);

        try {
          const formationsCalendar = await createOrGetCalendar('FF-Formations', '3');
          //  console.log('Calendrier formations:', formationsCalendar);
          localStorage.setItem('ID_AGENDA', formationsCalendar.id);
        } catch (err) {
          console.warn('Erreur calendrier:', err);
          showAlert('Erreur lors de la création ou récupération des calendriers', 'error');
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  };

  const handleSignoutClick = () => {
    if (TOKEN?.token) {
      window.google.accounts.oauth2.revoke(TOKEN.token);
      gapi.client.setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('ID_AGENDA');

      TOKEN = null;
      setIsTokenValid(false);
      showAlert('Déconnexion réussie', 'info');
    }
  };

  const createOrGetCalendar = async (calendarName, colorId) => {
    if (!gapi.client.calendar) {
      showAlert('API Google Calendar non chargée. Veuillez réessayer.', 'error');
      return;
    }
    const list = await gapi.client.calendar.calendarList.list();
    for (const item of list.result.items) {
      if (item.summary === calendarName) {
        return { id: item.id, isNew: false };
      }
    }

    const newCal = await gapi.client.calendar.calendars.insert({
      resource: {
        summary: calendarName,
        location: 'Africa/Nairobi',
        colorId,
      },
    });

    return { id: newCal.result.id, isNew: true };
  };

  function displayVille(ville) {
    switch (ville) {
      case 'Antananarivo':
        return '3GJ5+5P';
      case 'Toamasina':
        return '5XC6+75';
      case 'Mahajanga':
        return '56J6+F3';
      case 'Antsirabe':
        return '47HP+9Q';
      case 'Fianarantsoa':
        return 'R2C7+V2';
      default:
        return '';
    }
  }

  const updateIdListCalendarSession = async (idSeance, idGoogle, token) => {
    try {
      const data = {
        idSeance,
        idGoogle
      };
      //console.log('update DATA =+>', data);
      const response = await axios.patch(
        `/cfp/seances/last-sessions/update-ids`,
        data
      );
      //console.log(response.data);
      showAlert("Session modifiée avec succès", "success");
    } catch (error) {
      console.warn("Erreur lors de la mise à jour :", error);
      showAlert("Erreur lors de la mise à jour de la session", "error");
    }
  };

  const executeAddListOnGoogle = async (seances, idAgenda, token) => {
    if (!gapi.client.calendar) {
      showAlert('API Google Calendar non chargée. Veuillez réessayer plus tard.', 'error');
      throw new Error('API Google Calendar non chargée');
    }

    if (!Array.isArray(seances) || seances.length === 0) {
      console.warn('Aucune séance valide reçue:', seances);
      return;
    }

    //console.log('Séances reçues:', seances);

    const results = [];
    const MAX_RETRIES = 5; // Nombre maximum de tentatives
    let baseDelay = 1000; // Délai initial en ms (1 seconde)

    for (const evnt of seances) {
      if (!evnt || !evnt.start || !evnt.end || !evnt.module_name) {
        console.warn('Données invalides pour l\'événement:', evnt);
        results.push({ success: false, idSeance: evnt?.idSeance, error: 'Données invalides' });
        continue; // Passer à l'événement suivant
      }

      const entrepriseName = evnt.nameEtp
        ? evnt.nameEtp
        : (Array.isArray(evnt.nameEtps)
          ? evnt.nameEtps.map(etp => etp.name).join(' et ')
          : 'Non spécifié');

      const idSeance = evnt.idSeance;
      const startDateTime = evnt.start.includes('T') ? evnt.start : `${evnt.start}T09:00:00`;
      const endDateTime = evnt.end.includes('T') ? evnt.end : `${evnt.end}T10:00:00`;

      const attendeesList = Array.isArray(evnt.formateurs)
        ? evnt.formateurs.map(form => ({
          email: form.email || '',
          displayName: form.prenom || ''
        })).filter(att => att.email)
        : [];

      const dataGoogle = {
        calendarId: idAgenda,
        resource: {
          start: {
            dateTime: startDateTime,
            timeZone: 'Africa/Nairobi'
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'Africa/Nairobi'
          },
          summary: evnt.module_name,
          description: `
            <h2>Invitation à la Formation</h2>
            <strong><i>${entrepriseName}</i></strong> vous invite(nt) à participer à la formation en
            <strong>${evnt.module_name}</strong>, dispensée par <strong><i>${evnt.nameCfp || '----'}</i></strong>.<br/>
            <strong>Détails de la formation :</strong><br/>
            <strong>Lieu :</strong> ${evnt.ville || 'Non spécifié'}, <strong>salle :</strong> ${evnt.salle || 'Non spécifiée'}<br/>
          `,
          colorId: "3",
          location: `${displayVille(evnt.ville)}, ${evnt.ville}`,
          htmlLink: true,
          attendees: attendeesList
        }
      };

      let currentRetry = 0;
      let eventAddedSuccessfully = false;

      while (currentRetry < MAX_RETRIES && !eventAddedSuccessfully) {
        try {
          // console.log(`Tentative ${currentRetry + 1} d'ajout de l'événement: ${evnt.module_name}`);
          const response = await gapi.client.calendar.events.insert(dataGoogle);

          //console.log(`Événement ajouté: ${response.result.summary}, ID: ${response.result.id}`);
          showAlert('Événement ajouté aux google agenda', 'success');
          //console.log(response);

          results.push({
            idGoogle: response.result.id,
            idSeance,
            success: true
          });
          eventAddedSuccessfully = true;

          // Mettre à jour la session UNIQUEMENT si l'événement a été ajouté avec succès
          await updateIdListCalendarSession(idSeance, response.result.id, token);

        } catch (error) {
          console.warn(`Erreur lors de l'ajout de l'événement (${evnt.module_name}) - Tentative ${currentRetry + 1}:`, error);

          // Vérifier si c'est une erreur de limite de débit (Rate Limit Exceeded)
          if (error.status === 403 && error.result && error.result.error && error.result.error.message === "Rate Limit Exceeded") {
            console.warn(`Rate Limit Exceeded pour ${evnt.module_name}. Re-tentative dans ${baseDelay / 1000} secondes...`);
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            baseDelay *= 2; // Délai exponentiel
            currentRetry++;
          } else {
            // Pour toute autre erreur, ne pas réessayer et passer à l'événement suivant
            showAlert(`Échec de l'ajout de l'événement "${evnt.module_name}" : ${error.result?.error?.message || 'Erreur inconnue'}`, 'error');
            results.push({ success: false, idSeance, error: error.result?.error?.message || 'Erreur inconnue' });
            break; // Sortir de la boucle while pour passer à l'événement suivant
          }
        }
      }

      if (!eventAddedSuccessfully) {
        // Si après toutes les tentatives, l'événement n'a toujours pas été ajouté
        showAlert(`Échec persistant de l'ajout de l'événement "${evnt.module_name}" après ${MAX_RETRIES} tentatives.`, 'error');
        results.push({ success: false, idSeance, error: 'Échec après plusieurs tentatives (limite de débit)' });
      }

      // Ajoutez un délai entre chaque événement, même en cas de succès, pour éviter de frapper la limite trop vite
      if (seances.length > 1) { // Ne pas ajouter de délai si c'est un seul événement
        await new Promise(resolve => setTimeout(resolve, 500)); // Petit délai entre chaque ajout (ex: 500ms)
      }
    }

    //console.log('Toutes les opérations d\'ajout d\'événements terminées.', results);
    return results; // Retourne les résultats de toutes les opérations
  };

  const executeDeleteListOnGoogle = async (idAgenda, seances) => {
    if (!gapi.client.calendar) {
      showAlert('API Google Calendar non chargée. Veuillez réessayer plus tard.', 'error');
      throw new Error('API Google Calendar non chargée');
    }

    try {
      if (!Array.isArray(seances) || seances.length === 0) {
        console.warn("Aucune séance à supprimer.");
        return;
      }

      const deletePromises = seances.map(async (evnt) => {
        if (!evnt.idCalendar) {
          console.warn("ID de calendrier manquant pour:", evnt);
          return;
        }

        try {
          const response = await gapi.client.calendar.events.delete({
            calendarId: idAgenda,
            eventId: evnt.idCalendar,
          });
          // console.log(`Événement supprimé : ${evnt.idCalendar}`, response);
          return { success: true, id: evnt.idCalendar };

        } catch (error) {
          if (error.status === 410 || (error.result && error.result.error && error.result.error.code === 410)) {
            console.warn(`L'événement ${evnt.idCalendar} a déjà été supprimé ou n'existe plus.`);
            showAlert(`L'événement est déjà supprimé de Google Calendar.`, 'info');
            try {
              await updateIdListCalendarSession(evnt.idSeance, null, localStorage.getItem('token_google')); // ou `auth.token` si accessible
              return { success: true, id: evnt.idCalendar, message: "Already deleted on Google, updated locally." };
            } catch (updateError) {
              console.warn("Erreur lors de la mise à jour locale après 410:", updateError);
              showAlert("Erreur de mise à jour locale après suppression Google.", 'error');
              return { success: false, id: evnt.idCalendar, error: updateError };
            }
          } else if (error.status === 401 || (error.result && error.result.error && error.result.error.code === 401)) {
            showAlert("Accès non autorisé à Google Calendar. Veuillez vous reconnecter.", 'error');

          } else {
            showAlert(`Erreur inconnue lors de la suppression de l'événement "${evnt.module_name || 'Inconnu'}".`, 'error');
          }
          return { success: false, id: evnt.idCalendar, error };
        }
      });

      const results = await Promise.all(deletePromises);

      const successfulDeletions = results.filter(r => r && r.success).length;
      const failedDeletions = results.filter(r => r && !r.success).length;

      if (successfulDeletions > 0 && failedDeletions === 0) {
        showAlert("Tous les événements ont été supprimés avec succès de Google Calendar.", 'success');
      } else if (successfulDeletions > 0 && failedDeletions > 0) {
        showAlert(`Certains événements supprimés de Google, mais il y a eu ${failedDeletions} échecs.`, 'warning');
      } else if (failedDeletions > 0) {
        showAlert("Aucun événement n'a pu être supprimé de Google Calendar.", 'error');
      }

      return results;

    } catch (error) {
      console.warn("Erreur globale lors de la suppression:", error);
      throw error;
    }
  };


  const showAlert = (message, type = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.transition = 'opacity 0.3s ease-in-out';
    alertDiv.style.opacity = 0;

    switch (type) {
      case 'success':
        alertDiv.style.backgroundColor = '#d4edda';
        alertDiv.style.color = '#155724';
        break;
      case 'error':
        alertDiv.style.backgroundColor = '#f8d7da';
        alertDiv.style.color = '#721c24';
        break;
      default:
        alertDiv.style.backgroundColor = '#cce5ff';
        alertDiv.style.color = '#004085';
    }

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => (alertDiv.style.opacity = 1), 100);
    setTimeout(() => {
      alertDiv.style.opacity = 0;
      setTimeout(() => document.body.removeChild(alertDiv), 300);
    }, 5000);
  };

  useEffect(() => {
    loadCredentials();
    const interval = setInterval(checkTokenStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [auth.token]);

  const contextValue = {
    handleAuthClick,
    handleSignoutClick,
    executeAddListOnGoogle,
    executeDeleteListOnGoogle,
    updateIdListCalendarSession,
    isTokenValid,
    googleConfig,
  };

  return (
    <GoogleCalendarContext.Provider value={contextValue}>
      {children}
      <Outlet />
    </GoogleCalendarContext.Provider>
  );
};

const GoogleCalendarIntegration = () => {
  const { handleAuthClick, handleSignoutClick, isTokenValid } = useGoogleCalendar();

  return (
    <div className='bg-gray-100'>
      <button id="authorize_button" onClick={handleAuthClick} disabled={isTokenValid}>
        {isTokenValid ? 'Sync with GOOGLE' : 'Not sync with GOOGLE'}
      </button>
      <button
        id="signout_button"
        style={{ visibility: isTokenValid ? 'visible' : 'hidden' }}
        onClick={handleSignoutClick}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default GoogleCalendarIntegration;