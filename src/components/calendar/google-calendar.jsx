import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { gapi } from "gapi-script";
import { useAuth } from "../../contexts/AuthContext";
import { GOOGLE_CONFIG } from "../../config/env";

const googleConfig = GOOGLE_CONFIG;

const GoogleCalendarManager = ({ seances, fetchAllSeances }) => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const auth = useAuth();
  const [formationId, setFormationID] = useState(null);

  const loadCredentials = async () => {
    try {
      //   await initializeGoogleAuth();
      await checkTokenStatus();
    } catch (error) {
      console.warn("Erreur de chargement des credentials:", error);
      showAlert("Erreur de chargement des credentials", "error");
    }
  };

  //   const initializeGoogleAuth = async () => {
  //     await Promise.all([
  //       loadScript("https://apis.google.com/js/api.js"),
  //       loadScript("https://accounts.google.com/gsi/client"),
  //     ]);

  //     await new Promise((resolve) => {
  //       gapi.load("client", async () => {
  //         await gapi.client.init({
  //           apiKey: googleConfig.API_KEY,
  //           discoveryDocs: [googleConfig.DISCOVERY_DOC],
  //         });
  //         resolve();
  //       });
  //     });
  //   };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const checkTokenStatus = async () => {
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    const storedFormationId = localStorage.getItem("ID_AGENDA");

    if (!storedToken) {
      //   showAlert("Aucun token trouvé - Synchronisation requise", "error");
      setIsTokenValid(false);
      setFormationID(null);

      return;
    }

    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${storedToken}`
      );

      let TOKEN;

      if (data.error) {
        showAlert("Token expiré - Reconnectez-vous", "error");
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("ID_AGENDA");
        localStorage.removeItem("LAST_EVENT_ID"); // Supprime l'ID de l'événement
        TOKEN = null;
        setIsTokenValid(false);
        setFormationID(null);
      } else {
        TOKEN = { access_token: storedToken };
        showAlert("Token valide - Synchronisation active", "success");
        setIsTokenValid(true);
        if (storedFormationId) {
          setFormationID(storedFormationId);
        }
      }
    } catch (error) {
      console.warn("Erreur de vérification du token:", error);
      showAlert("Erreur de vérification du token", "error");
      setIsTokenValid(false);
      setFormationID(null);
    }
  };

  const handleAuthClick = () => {
    let TOKEN;
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleConfig.CLIENT_ID,
      scope: googleConfig.SCOPES.join(" "),
      callback: async (response) => {
        if (response.error) {
          showAlert("Échec de l'authentification", "error");
          return;
        }

        TOKEN = response;
        localStorage.setItem("ACCESS_TOKEN", response.access_token);
        showAlert("Authentification réussie", "success");
        setIsTokenValid(true);

        try {
          const formationsCalendar = await createOrGetCalendar(
            "FF-Formations",
            "3"
          );
          // const opportunitesCalendar = await createOrGetCalendar('FF-Opportunités', '4');

          console.log("Calendrier formations:", formationsCalendar);
          // console.log('Calendrier opportunités:', opportunitesCalendar);

          setFormationID(formationsCalendar.id);
          localStorage.setItem("ID_AGENDA", formationsCalendar.id);
          // localStorage.setItem('ID_OPPORTUNITY', opportunitesCalendar.id);

          showAlert("Calendriers Google synchronisés.", "success");
        } catch (err) {
          console.warn("Erreur calendrier:", err);
          showAlert(
            "Erreur lors de la création ou récupération des calendriers",
            "error"
          );
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  };

  const handleSignoutClick = () => {
    let TOKEN;
    if (TOKEN?.access_token) {
      window.google.accounts.oauth2.revoke(TOKEN.access_token);
      gapi.client.setToken("");
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("ID_AGENDA");
      localStorage.removeItem("ID_OPPORTUNITY");
      localStorage.removeItem("LAST_EVENT_ID"); // Supprime l'ID de l'événement
      TOKEN = null;
      setIsTokenValid(false);
      setFormationID(null);

      showAlert("Déconnexion réussie", "info");
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
        location: "Africa/Nairobi",
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
  function displayVille(ville) {
    switch (ville) {
      case "Antananarivo":
        return "3GJ5+5P";
      case "Toamasina":
        return "5XC6+75";
      case "Mahajanga":
        return "56J6+F3";
      case "Antsirabe":
        return "47HP+9Q";
      case "Fianarantsoa":
        return "R2C7+V2";
      default:
        return "";
    }
  }

  const updateIdListCalendarSession = async (idSeance, idGoogle, token) => {
    try {
      const data = {
        idSeance,
        idGoogle,
      };
      // console.log('update DATA =+>', data);
      const response = await axios.patch(
        `/cfp/seances/last-sessions/update-ids`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": token,
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      // console.log(response.data);
      showAlert("Session modifiée avec succès", "success");
      fetchAllSeances();
    } catch (error) {
      console.warn("Erreur lors de la mise à jour :", error);
      showAlert("Erreur lors de la mise à jour de la session", "error");
    }
  };

  const checkIfEventExistsOnGoogle = async (calendarId, eventDetails) => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: calendarId,
        q: eventDetails.module, // Recherche par titre du module
        timeMin: eventDetails.start, // Date de début
        timeMax: eventDetails.end, // Date de fin
        singleEvents: true, // Pour gérer les événements récurrents comme des instances individuelles
        orderBy: "startTime",
      });

      const existingEvents = response.result.items;
      // Parcourez les événements trouvés pour voir si l'un correspond précisément
      for (const event of existingEvents) {
        // Vous devrez implémenter une logique de correspondance robuste ici.

        if (
          event.summary === eventDetails.module &&
          event.start.dateTime === eventDetails.start && // Ou d'autres comparaisons de dates
          event.end.dateTime === eventDetails.end
        ) {
          //console.log(`Événement déjà existant sur Google Calendar: ${event.id}`);
          return event.id; // Retourne l'ID Google de l'événement existant
        }
      }
      return null; // Pas d'événement correspondant trouvé
    } catch (error) {
      console.warn(
        "Erreur lors de la vérification de l'existence de l'événement sur Google:",
        error
      );
      return null;
    }
  };

  const executeAddListOnGoogle = async (seances, idAgenda, token) => {
    if (!gapi.client.calendar) {
      showAlert(
        "API Google Calendar non chargée. Veuillez réessayer plus tard.",
        "error"
      );
      throw new Error("API Google Calendar non chargée"); // Jetez une erreur pour que le catch appelant la récupère
    }

    try {
      if (!Array.isArray(seances) || seances.length === 0) {
        console.warn("Aucune séance valide reçue:", seances);
        return;
      }

      const addEventPromises = seances.map(async (evnt) => {
        if (!evnt || !evnt.start || !evnt.end || !evnt.module) {
          console.warn("Données invalides pour l'événement:", evnt);
          return Promise.reject("Données invalides");
        }

        const entrepriseName = evnt.nameEtp
          ? evnt.nameEtp
          : Array.isArray(evnt.nameEtps)
          ? evnt.nameEtps.map((etp) => etp.name).join(" et ")
          : "Non spécifié";

        const idSeance = evnt.idSeance;
        const startDateTime = evnt.start.includes("T")
          ? evnt.start
          : `${evnt.start}T09:00:00`;
        const endDateTime = evnt.end.includes("T")
          ? evnt.end
          : `${evnt.end}T10:00:00`;

        // Vérifiez également les emails des participants
        const attendeesList = Array.isArray(evnt.formateurs)
          ? evnt.formateurs
              .map((form) => ({
                email: form.email || "", // Assurez-vous que c'est une adresse email valide
                displayName: form.prenom || "",
              }))
              .filter((att) => att.email) // Filtrez les participants sans email valide
          : [];

        const dataGoogle = {
          calendarId: idAgenda,
          resource: {
            start: {
              dateTime: startDateTime, // Utilisez la chaîne de date/heure complète
              timeZone: "Africa/Nairobi",
            },
            end: {
              dateTime: endDateTime, // Utilisez la chaîne de date/heure complète
              timeZone: "Africa/Nairobi",
            },
            summary: evnt.module,
            description: `
              <h2>Invitation à la Formation</h2>
              <strong><i>${entrepriseName}</i></strong> vous invite(nt) à participer à la formation en
              <strong>${evnt.module}</strong>, dispensée par <strong><i>${
              evnt.nameCfp || "----"
            }</i></strong>.<br/>
              <strong>Détails de la formation :</strong><br/>
              <strong>Lieu :</strong> ${
                evnt.ville || "Non spécifié"
              }, <strong>salle :</strong> ${evnt.salle || "Non spécifiée"}<br/>
              <strong>Type de projet :</strong> ${
                evnt.typeProjet || "Non spécifié"
              }<br/>
            
              <strong>Formateur(s) :</strong> ${
                Array.isArray(evnt.formateurs)
                  ? evnt.formateurs.map((f) => f.prenom).join(", ")
                  : "Non spécifié"
              }
            `,
            colorId: "3",
            location: `${displayVille(evnt.ville)}, ${evnt.ville}`,
            htmlLink: true,
            attendees: attendeesList, // Utilisez la liste filtrée
          },
        };

        try {
          const existingGoogleId = await checkIfEventExistsOnGoogle(
            idAgenda,
            evnt
          );
          if (existingGoogleId) {
            showAlert(
              `L'événement "${evnt.module}" est déjà présent sur Google Calendar.`,
              "info"
            );
            // Optionnel: Mettre à jour votre backend avec cet ID existant s'il n'était pas connu
            await updateIdListCalendarSession(
              evnt.idSeance,
              existingGoogleId,
              token
            );
            fetchAllSeances();
            return {
              idGoogle: existingGoogleId,
              idSeance: evnt.idSeance,
              message: "Already exists",
            };
          }
          //console.log('Requête envoyée à Google:', JSON.stringify(dataGoogle, null, 2)); // Pour débogage
          const response = await gapi.client.calendar.events.insert(dataGoogle);
          // console.log(`Événement ajouté: ${response.result.summary}, ID: ${response.result.id}`);
          showAlert("Événement ajouté aux google agenda", "success");

          return {
            idGoogle: response.result.id,
            idSeance,
          };
        } catch (error) {
          console.warn("Erreur lors de l'ajout de l'événement:", error);
          throw error; // Re-jeter l'erreur pour qu'elle soit capturée plus haut
        }
      });

      const results = await Promise.all(addEventPromises);

      //console.log('Tous les événements ont été ajoutés avec les associations suivantes:', results);
      for (const result of results) {
        if (result?.idGoogle && result?.idSeance) {
          await updateIdListCalendarSession(
            result.idSeance,
            result.idGoogle,
            token
          );
        }
      }

      return results;
    } catch (error) {
      console.warn("Erreur globale lors de l'exécution :", error);

      throw error; // Re-jeter l'erreur pour le onClick
    }
  };

  const executeDeleteListOnGoogle = async (idAgenda, seances) => {
    if (!gapi.client.calendar) {
      showAlert(
        "API Google Calendar non chargée. Veuillez réessayer plus tard.",
        "error"
      );
      throw new Error("API Google Calendar non chargée");
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
          //console.log(`Événement supprimé : ${evnt.idCalendar}`, response);
          return { success: true, id: evnt.idCalendar };
        } catch (error) {
          console.warn(
            `Erreur lors de la suppression de l'événement ${evnt.idCalendar}:`,
            error
          );

          // ✨ GESTION SPÉCIFIQUE DE L'ERREUR 410 (GONE) ✨
          if (
            error.status === 410 ||
            (error.result &&
              error.result.error &&
              error.result.error.code === 410)
          ) {
            console.warn(
              `L'événement ${evnt.idCalendar} a déjà été supprimé ou n'existe plus.`
            );
            showAlert(
              `L'événement  est déjà supprimé de Google Calendar.`,
              "info"
            );
            // Appeler updateIdListCalendarSession pour effacer l'idCalendar localement
            try {
              await updateIdListCalendarSession(
                evnt.idSeance,
                null,
                localStorage.getItem("ACCESS_TOKEN")
              ); // ou `auth.token` si accessible
              return {
                success: true,
                id: evnt.idCalendar,
                message: "Already deleted on Google, updated locally.",
              };
            } catch (updateError) {
              console.warn(
                "Erreur lors de la mise à jour locale après 410:",
                updateError
              );
              showAlert(
                "Erreur de mise à jour locale après suppression Google.",
                "error"
              );
              return {
                success: false,
                id: evnt.idCalendar,
                error: updateError,
              }; // Indique une erreur locale
            }
          } else if (
            error.status === 401 ||
            (error.result &&
              error.result.error &&
              error.result.error.code === 401)
          ) {
            // Gérer l'erreur 401 (Unauthorized) ici si elle n'est pas déjà gérée globalement par un interceptor
            showAlert(
              "Accès non autorisé à Google Calendar. Veuillez vous reconnecter.",
              "error"
            );
          } else {
            // Erreurs inattendues
            showAlert(
              `Erreur inconnue lors de la suppression de l'événement "${
                evnt.module || "Inconnu"
              }".`,
              "error"
            );
          }
          return { success: false, id: evnt.idCalendar, error }; // Retourne l'état d'échec
        }
      });

      const results = await Promise.all(deletePromises);

      // Si vous voulez un message global après toutes les suppressions:
      const successfulDeletions = results.filter((r) => r && r.success).length;
      const failedDeletions = results.filter((r) => r && !r.success).length;

      if (successfulDeletions > 0 && failedDeletions === 0) {
        showAlert(
          "Tous les événements ont été supprimés avec succès de Google Calendar.",
          "success"
        );
      } else if (successfulDeletions > 0 && failedDeletions > 0) {
        showAlert(
          `Certains événements supprimés de Google, mais il y a eu ${failedDeletions} échecs.`,
          "warning"
        );
      } else if (failedDeletions > 0) {
        showAlert(
          "Aucun événement n'a pu être supprimé de Google Calendar.",
          "error"
        );
      }

      return results;
    } catch (error) {
      console.warn("Erreur globale lors de la suppression:", error);
      // Le `showAlert` sera déclenché par le `onClick` appelant si l'erreur n'est pas gérée ici.
      throw error;
    }
  };

  const showAlert = (message, type = "info") => {
    const alertDiv = document.createElement("div");
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.right = "20px";
    alertDiv.style.padding = "10px 20px";
    alertDiv.style.borderRadius = "5px";
    alertDiv.style.zIndex = "9999";
    alertDiv.style.transition = "opacity 0.3s ease-in-out";
    alertDiv.style.opacity = 0;
    alertDiv.style.color = "white";

    switch (type) {
      case "success":
        alertDiv.style.backgroundColor = "#28a745";
        break;
      case "error":
        alertDiv.style.backgroundColor = "#dc3545";
        break;
      case "info":
        alertDiv.style.backgroundColor = "#007bff";
        break;
      default:
        alertDiv.style.backgroundColor = "#6c757d";
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
    <div className="flex items-center justify-between gap-3 px-1  rounded-lg ">
      {/* <button
                id="authorize_button"
                onClick={handleAuthClick}
                disabled={isTokenValid}
                className={`p-1 rounded-md text-[10px] font-semibold ${isTokenValid ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600 text-white'
                    }`}
            >
                {isTokenValid ? 'Synchronisé avec GOOGLE' : 'Synchroniser avec GOOGLE'}
            </button>

            <button
                onClick={() => { executeAddListOnGoogle(seances, formationId) }}
                disabled={!isTokenValid || !formationId}
                className={`p-1 rounded-md text-[10px] font-bold ${(!isTokenValid || !formationId) ? 'bg-gray-200 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
            >
                Ajouter aux google
            </button>

            <button
                onClick={() => { executeDeleteListOnGoogle(formationId, seances) }}
                disabled={!isTokenValid || !formationId} 
                className={`p-1 text-[10px] rounded-md font-bold ${(!isTokenValid || !formationId) ? 'bg-gray-200 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
            >
                Supprimer aux google
            </button>

            <button
                id="signout_button"
                onClick={handleSignoutClick}
                style={{ visibility: isTokenValid ? 'visible' : 'hidden' }}
                className="px-0.5 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700"
            >
                Se déconnecter
            </button> */}
    </div>
  );
};

export default GoogleCalendarManager;
