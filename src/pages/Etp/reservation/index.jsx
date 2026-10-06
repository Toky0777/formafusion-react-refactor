import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import ReservationCard from "../../../components/card/ReservationCard";

export default function ReservationEtp() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fechReservations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/entreprises/rsv");
        setReservations(res.data.reservations.reservation_item);
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fechReservations();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <div>Aucun</div>
      ) : (
        <div className="flex flex-col gap-10">
          {reservations.map((reservation, index) => (
            <div key={index}>
              <ReservationCard code="etp" reservation={reservation} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
