import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import ReservationCard from "../../../components/card/ReservationCard";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function CfpReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReservations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/cfp/rsv");
        setReservations(res.data.reservations.reservation_item);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReservations();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <div className="flex justify-center items-center h-[30vh]">
          <h1 className="text-xl"> Aucun réservation disponible </h1>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {reservations.map((reservation, index) => (
            <div key={index}>
              <ReservationCard code="cfp" reservation={reservation} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
