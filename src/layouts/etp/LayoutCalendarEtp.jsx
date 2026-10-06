import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from "../../config/env";


function LayoutCalendarEtp() {
 const token = localStorage.getItem("token");
  
  const [event_groups, setEventGroups] = useState([]);
  const [eventsD, setEvents] = useState([]);
  const [formateursD, setFormateurs] = useState([]);

  const [loading, setloading] = useState(true); // ← nouvelle variable

  const fetchEventsGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/etp/agenda/event-groups`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const Events = response.data.seances || [];
      setEventGroups(Events);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setloading(false); // ← signaler que c'est prêt
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/etp/agenda/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const EventsD = response.data.seances || [];
      setEvents(EventsD);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    }
  };

  const fetchFormateurs = async () => {
    try {
      const response = await axios.get(`${API_URL}/etp/agenda/events-resources`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const ressource_table_formateurs = [
        {
          name: "Formateurs", id: "FM", expanded: true, children: response.data.formateurs
        },
      ];
      setFormateurs(ressource_table_formateurs || []);
    } catch (error) {
      console.error("Erreur lors du chargement des formateurs:", error);
    }
  };

  useEffect(() => {
    fetchEventsGroups();  // ← affichage dépend de celui-ci
    fetchEvents();        // ← continue en fond
    fetchFormateurs();    // ← continue en fond
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 flex flex-col">

      <main className="flex-grow flex flex-col p-4">
          <Outlet context={{ event_groups, eventsD, formateursD, fetchEventsGroups, fetchEvents, fetchFormateurs,loading }} />
      </main>
    
    </div>
  );
}

export default LayoutCalendarEtp;
