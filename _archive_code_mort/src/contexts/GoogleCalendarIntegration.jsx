import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { gapi } from 'gapi-script';
import { useAuth } from './AuthContext';

let CLIENT_ID = '';
let API_KEY = '';
let DISCOVERY_DOC = '';
let SCOPES = '';
let TOKEN = null;

const GoogleCalendarIntegration = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const auth = useAuth();
  const [formationId, setFormationID] = useState(null);
  const [lastEventId, setLastEventId] = useState(null); // Nouveau state pour stocker l'ID du dernier événement créé

  // Détails de l'événement de test, déclarés une fois au niveau du composant
  const eventDetails = {
    summary: 'Rendez-vous de Test - Google Calendar Intégration',
    location: 'Bureau Central',
    description: 'Ceci est un événement de test créé via l\'intégration Google Calendar.',
    start: {
      dateTime: '2025-07-20T09:00:00-07:00', // Date et heure de début de l'événement (format ISO 8601)
      timeZone: 'Africa/Nairobi', // Fuseau horaire de l'événement
    },
    end: {
      dateTime: '2025-07-20T10:00:00-07:00', // Date et heure de fin de l'événement
      timeZone: 'Africa/Nairobi',
    },
    // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'], // Commenté pour un test plus simple
    attendees: [
      { email: 'utilisateur1@example.com' }, // Remplacez par de vraies adresses e-mail si nécessaire
      { email: 'utilisateur2@example.com' },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // Rappel par e-mail 24 heures avant
        { method: 'popup', minutes: 10 },    // Rappel pop-up 10 minutes avant
      ],
    },
  };

  // Chargement des credentials à partir du backend
  const loadCredentials = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/home/api/config`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      CLIENT_ID = data.googleConfig.CLIENT_ID;
      API_KEY = data.googleConfig.API_KEY;
      DISCOVERY_DOC = data.googleConfig.DISCOVERY_DOC;
      SCOPES = data.googleConfig.SCOPES.join(' ');
      await initializeGoogleAuth();
      await checkTokenStatus();
    } catch (error) {
      console.error('Erreur de chargement des credentials:', error);
      showAlert('Erreur de chargement des credentials', 'error');
    }
  };

  const initializeGoogleAuth = async () => {
    await Promise.all([
      loadScript('https://apis.google.com/js/api.js'),
      loadScript('https://accounts.google.com/gsi/client'),
    ]);

    await new Promise((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
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
    const storedToken = localStorage.getItem('token');
    const storedFormationId = localStorage.getItem('ID_AGENDA');
    const storedLastEventId = localStorage.getItem('LAST_EVENT_ID'); // Récupère l'ID du dernier événement

    if (!storedToken) {
      showAlert('Aucun token trouvé - Synchronisation requise', 'error');
      setIsTokenValid(false);
      setFormationID(null);
      setLastEventId(null); // Réinitialise l'ID de l'événement
      return;
    }

    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?token=${storedToken}`
      );

      if (data.error) {
        showAlert('Token expiré - Reconnectez-vous', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('ID_AGENDA');
        localStorage.removeItem('LAST_EVENT_ID'); // Supprime l'ID de l'événement
        TOKEN = null;
        setIsTokenValid(false);
        setFormationID(null);
        setLastEventId(null); // Réinitialise l'ID de l'événement
      } else {
        TOKEN = { token: storedToken };
        showAlert('Token valide - Synchronisation active', 'success');
        setIsTokenValid(true);
        if (storedFormationId) {
          setFormationID(storedFormationId);
        }
        if (storedLastEventId) {
          setLastEventId(storedLastEventId);
        }
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      showAlert('Erreur de vérification du token', 'error');
      setIsTokenValid(false);
      setFormationID(null);
      setLastEventId(null); // Réinitialise l'ID de l'événement
    }
  };

  const handleAuthClick = () => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (response) => {
        if (response.error) {
          showAlert("Échec de l'authentification", 'error');
          return;
        }

        TOKEN = response;
        localStorage.setItem('token', response.token);
        showAlert('Authentification réussie', 'success');
        setIsTokenValid(true);

        try {
          const formationsCalendar = await createOrGetCalendar('FF-Formations', '3');
          // const opportunitesCalendar = await createOrGetCalendar('FF-Opportunités', '4');

          console.log('Calendrier formations:', formationsCalendar);
          // console.log('Calendrier opportunités:', opportunitesCalendar);

          setFormationID(formationsCalendar.id);
          localStorage.setItem('ID_AGENDA', formationsCalendar.id);
          // localStorage.setItem('ID_OPPORTUNITY', opportunitesCalendar.id);

          showAlert('Calendriers Google synchronisés.', 'success');

        } catch (err) {
          console.error('Erreur calendrier:', err);
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
      localStorage.removeItem('ID_OPPORTUNITY');
      localStorage.removeItem('LAST_EVENT_ID'); // Supprime l'ID de l'événement
      TOKEN = null;
      setIsTokenValid(false);
      setFormationID(null);
      setLastEventId(null); // Réinitialise l'ID de l'événement
      showAlert('Déconnexion réussie', 'info');
    }
  };

  const createOrGetCalendar = async (calendarName, colorId) => {
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

  /**
   * Ajoute un événement au calendrier Google spécifié.
   * Stocke l'ID de l'événement créé dans le state `lastEventId`.
   * @param {string} calendarId L'ID du calendrier où ajouter l'événement.
   * @param {object} event Le corps de l'événement à ajouter.
   */
  const updateIdListCalendarSession = async (idSeance, idGoogle, token) => {
    try {
      // Ne pas appeler checkTokenStatus ici. Le token doit être valide avant d'appeler cette fonction.
      // C'est la responsabilité de la fonction appelante (e.g., onClick) de s'assurer de la validité du token.

      const data = {
        idSeance,
        idGoogle
      };
      console.log('update DATA =+>', data);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/cfp/seances/last-sessions/update-ids`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token, // Assurez-vous que ce token est bien votre token d'AUTH API, pas le token Google
            'Authorization': `Bearer ${auth.token}` // Utilisez le token d'authentification de votre application
          }
        }
      );
      console.log(response.data);
      // Si tu utilises react-toastify à la place :
      // toast.success("Session modifiée avec succès", { timeOut: 1500 });
      showAlert("Session modifiée avec succès", "success");


    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      showAlert("Erreur lors de la mise à jour de la session", "error");
    }
  };

  const executeAddListOnGoogle = async (seances, idAgenda, token) => {


    if (!gapi.client.calendar) {
      showAlert('API Google Calendar non chargée. Veuillez réessayer plus tard.', 'error');
      throw new Error('API Google Calendar non chargée'); // Jetez une erreur pour que le catch appelant la récupère
    }

    try {
      if (!Array.isArray(seances) || seances.length === 0) {
        console.error('Aucune séance valide reçue:', seances);
        return;
      }

      console.log('Séances reçues:', seances);

      const addEventPromises = seances.map(async (evnt) => {
        if (!evnt || !evnt.start || !evnt.end || !evnt.module_name) {
          console.error('Données invalides pour l\'événement:', evnt);
          return Promise.reject('Données invalides');
        }

        const entrepriseName = evnt.nameEtp
          ? evnt.nameEtp
          : (Array.isArray(evnt.nameEtps)
            ? evnt.nameEtps.map(etp => etp.name).join(' et ')
            : 'Non spécifié');

        const idSeance = evnt.idSeance;
        const startDateTime = evnt.start.includes('T') ? evnt.start : `${evnt.start}T09:00:00`;
        const endDateTime = evnt.end.includes('T') ? evnt.end : `${evnt.end}T10:00:00`;

        // Vérifiez également les emails des participants
        const attendeesList = Array.isArray(evnt.formateurs)
          ? evnt.formateurs.map(form => ({
            email: form.email || '', // Assurez-vous que c'est une adresse email valide
            displayName: form.prenom || ''
          })).filter(att => att.email) // Filtrez les participants sans email valide
          : [];

        const dataGoogle = {
          calendarId: idAgenda,
          resource: {
            start: {
              dateTime: startDateTime, // Utilisez la chaîne de date/heure complète
              timeZone: 'Africa/Nairobi'
            },
            end: {
              dateTime: endDateTime, // Utilisez la chaîne de date/heure complète
              timeZone: 'Africa/Nairobi'
            },
            summary: evnt.module_name,
            description: `
      <h2>Invitation à la Formation</h2>
      <strong><i>${entrepriseName}</i></strong> vous invite(nt) à participer à la formation en
      <strong>${evnt.module_name}</strong>, dispensée par <strong><i>${evnt.nameCfp || '----'}</i></strong>.<br/>
      <strong>Détails de la formation :</strong><br/>
      <strong>Lieu :</strong> ${evnt.ville || 'Non spécifié'}, <strong>salle :</strong> ${evnt.salle || 'Non spécifiée'}<br/>
      <strong>Type de projet :</strong> ${evnt.typeProjet || 'Non spécifié'}<br/>
      <strong>Nombre d'apprenants :</strong> ${evnt.nb_appr || 0}<br/>
      <strong>Formateur(s) :</strong> ${Array.isArray(evnt.formateurs) ? evnt.formateurs.map(f => f.prenom).join(', ') : 'Non spécifié'}
     `,
            colorId: "3",
            location: `${displayVille(evnt.ville)}, ${evnt.ville}`,
            htmlLink: true,
            attendees: attendeesList // Utilisez la liste filtrée
          }
        };

        try {
          console.log('Requête envoyée à Google:', JSON.stringify(dataGoogle, null, 2)); // Pour débogage
          const response = await gapi.client.calendar.events.insert(dataGoogle);
          console.log(`Événement ajouté: ${response.result.summary}, ID: ${response.result.id}`);
          showAlert('Événement ajouté aux google agenda', 'success');

          return {
            idGoogle: response.result.id,
            idSeance
          };
        } catch (error) {
          console.error("Erreur lors de l'ajout de l'événement:", error);
          throw error; // Re-jeter l'erreur pour qu'elle soit capturée plus haut
        }
      });

      const results = await Promise.all(addEventPromises);

      console.log('Tous les événements ont été ajoutés avec les associations suivantes:', results);
      for (const result of results) {
        if (result?.idGoogle && result?.idSeance) {
          await updateIdListCalendarSession(result.idSeance, result.idGoogle, token);
        }
      }

      return results;

    } catch (error) {
      console.error("Erreur globale lors de l'exécution :", error);
      // Ne pas appeler showAlert ici, car l'erreur est déjà gérée dans le catch du onClick
      throw error; // Re-jeter l'erreur pour le onClick
    }
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
          console.log(`Événement supprimé : ${evnt.idCalendar}`, response);
          return { success: true, id: evnt.idCalendar };

        } catch (error) {
          console.error(`Erreur lors de la suppression de l'événement ${evnt.idCalendar}:`, error);

          // ✨ GESTION SPÉCIFIQUE DE L'ERREUR 410 (GONE) ✨
          if (error.status === 410 || (error.result && error.result.error && error.result.error.code === 410)) {
            console.warn(`L'événement ${evnt.idCalendar} a déjà été supprimé ou n'existe plus.`);
            showAlert(`L'événement  est déjà supprimé de Google Calendar.`, 'info');
            // Appeler updateIdListCalendarSession pour effacer l'idCalendar localement
            try {
              await updateIdListCalendarSession(evnt.idSeance, null, localStorage.getItem('token')); // ou `auth.token` si accessible
              return { success: true, id: evnt.idCalendar, message: "Already deleted on Google, updated locally." };
            } catch (updateError) {
              console.error("Erreur lors de la mise à jour locale après 410:", updateError);
              showAlert("Erreur de mise à jour locale après suppression Google.", 'error');
              return { success: false, id: evnt.idCalendar, error: updateError }; // Indique une erreur locale
            }
          } else if (error.status === 401 || (error.result && error.result.error && error.result.error.code === 401)) {
            // Gérer l'erreur 401 (Unauthorized) ici si elle n'est pas déjà gérée globalement par un interceptor
            showAlert("Accès non autorisé à Google Calendar. Veuillez vous reconnecter.", 'error');

          } else {
            // Erreurs inattendues
            showAlert(`Erreur inconnue lors de la suppression de l'événement "${evnt.module_name || 'Inconnu'}".`, 'error');
          }
          return { success: false, id: evnt.idCalendar, error }; // Retourne l'état d'échec
        }
      });

      const results = await Promise.all(deletePromises);

      // Si vous voulez un message global après toutes les suppressions:
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
      console.error("Erreur globale lors de la suppression:", error);
      // Le `showAlert` sera déclenché par le `onClick` appelant si l'erreur n'est pas gérée ici.
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
    alertDiv.style.color = 'white';

    switch (type) {
      case 'success':
        alertDiv.style.backgroundColor = '#28a745';
        break;
      case 'error':
        alertDiv.style.backgroundColor = '#dc3545';
        break;
      case 'info':
        alertDiv.style.backgroundColor = '#007bff';
        break;
      default:
        alertDiv.style.backgroundColor = '#6c757d';
    }

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => (alertDiv.style.opacity = 1), 100);
    setTimeout(() => {
      alertDiv.style.opacity = 0;
      setTimeout(() => document.body.removeChild(alertDiv), 300);
    }, 3000);
  };

  useEffect(() => {
    loadCredentials();
    const interval = setInterval(checkTokenStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex items-start gap-4 p-4 bg-gray-100 rounded-lg shadow-md'>
      <button
        id="authorize_button"
        onClick={handleAuthClick}
        disabled={isTokenValid}
        className={`px-4 py-2 rounded-md font-semibold ${isTokenValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
      >
        {isTokenValid ? 'Synchronisé avec GOOGLE' : 'Synchroniser avec GOOGLE'}
      </button>

      {/* Bouton pour ajouter un événement */}
      <button
        onClick={() => { executeAddListOnGoogle(eventDetails, formationId) }}
        disabled={!isTokenValid || !formationId}
        className={`px-4 py-2 rounded-md font-semibold ${(!isTokenValid || !formationId) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
      >
        Ajouter cet seance aux google
      </button>

      {/* Bouton pour supprimer le dernier événement créé */}
      <button
        onClick={() => { executeDeleteListOnGoogle(formationId, lastEventId) }}
        disabled={!isTokenValid || !formationId || !lastEventId} // Désactivé si pas de token, pas de calendrier ou pas d'ID d'événement
        className={`px-4 py-2 rounded-md font-semibold ${(!isTokenValid || !formationId || !lastEventId) ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
      >
        Supprimer cet seances
      </button>

      <button
        id="signout_button"
        onClick={handleSignoutClick}
        style={{ visibility: isTokenValid ? 'visible' : 'hidden' }}
        className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default GoogleCalendarIntegration;