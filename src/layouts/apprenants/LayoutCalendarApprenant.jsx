import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import axios from 'axios';
import { API_URL } from "../../config/env";

function LayoutCalendarApprenant() {
const token = localStorage.getItem("token");
  const [eventsD, setEvents] = useState([]);
  const [loading, setloading] = useState(true); // ← nouvelle variable
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/employes/agenda/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const EventsD = response.data.seances || [];
      setEvents(EventsD);
    } catch (error) {
      console.error("Erreur lors du chargement des séances:", error);
    } finally {
      setloading(false); // ← signaler que c'est prêt
    }
  };

 
  useEffect(() => {
   
    fetchEvents();       
  
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 flex flex-col">
     
      <main className="flex-grow flex flex-col p-4">
          <Outlet context={{ eventsD, fetchEvents,loading }} />
      </main>
    
    </div>
  );
}

export default LayoutCalendarApprenant;
