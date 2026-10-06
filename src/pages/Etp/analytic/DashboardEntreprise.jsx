import { useEffect, useState } from "react";
import DashboardCard from "../../../components/card/DashboardCard";
import EtpLineChart from "../../../components/chart/etp-linechart";
import axios from "../../../config/axios";
import { formatMonetaire } from "../../../utils/global";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function DashboardEntreprise() {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardEntreprise = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/entreprises/analytic/home-etp");

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardEntreprise();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="my-5 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
            <DashboardCard
              title="Total formés"
              icon="fa-user-graduate"
              number={data?.total_trained}
              lastNumber={data?.last_total_trained}
              text="l'année précendente"
            />
            <DashboardCard
              title="Total formés unique"
              icon="fa-hand-holding-heart"
              number={data?.unique_traine}
              text="l'année précédente"
              lastNumber={data?.last_unique_trained}
              percentage=" "
            />
            <DashboardCard
              title="Dépenses du mois courant"
              icon=" fa-sack-dollar"
              number={data?.total_cost}
              lastNumber={formatMonetaire(data?.last_total_cost)}
              text="le mois précédent"
            />
            <DashboardCard
              title="Dépense cumulative"
              unity="YTD"
              number={data?.total_YTD}
              text="l'année précédente"
              lastNumber={formatMonetaire(data?.last_year_YTD)}
            />
            <DashboardCard
              title="Dépense par formé"
              unity="CA/F"
              number={data?.cost_by_employee}
              text="l'année précédente"
              lastNumber={formatMonetaire(data?.last_cost_by_employee)}
            />
          </div>
          <div>
            <EtpLineChart />
          </div>
        </div>
      )}
    </div>
  );
}
