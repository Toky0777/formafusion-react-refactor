import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

// import Footer from '../Footer';
import axios from "axios";
import { API_URL } from "../../config/env";

function LayoutCalendarCfp() {
  const token = localStorage.getItem("token");
  const [event_groups, setEventGroups] = useState([]);
  const [eventsD, setEvents] = useState([]);
  const [formateursD, setFormateurs] = useState([]);
  const [eventSem, setEventsSemaine] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchEventsGroups = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cfp/agenda/event-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const Events = response.data.seances || [];
      setEventGroups(Events);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cfp/agenda/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const EventsD = response.data.seances || [];
      setEvents(EventsD);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    }
  };

  const fetchEventsSemaine = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cfp/agenda/event-semaine`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const EventsSem = response.data.seances || [];
      setEventsSemaine(EventsSem);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    }
  };

  const fetchFormateurs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/cfp/agenda/events-resources`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ressource_table_formateurs = [
        {
          name: "Formateurs",
          id: "FM",
          expanded: true,
          children: response.data.formateurs,
        },
      ];
      setFormateurs(ressource_table_formateurs || []);
    } catch (error) {
      console.error("Erreur lors du chargement des formateurs:", error);
    }
  };

  useEffect(() => {
    fetchEventsGroups(); // ← affichage dépend de celui-ci
    fetchEventsSemaine();
    fetchEvents(); // ← continue en fond
    fetchFormateurs(); // ← continue en fond
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
      <main className="flex flex-col flex-grow p-2">
        <Outlet
          context={{
            event_groups,
            eventsD,
            eventSem,
            formateursD,
            fetchEventsGroups,
            fetchEvents,
            fetchEventsSemaine,
            fetchFormateurs,
            loading,
          }}
        />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default LayoutCalendarCfp;
