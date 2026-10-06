import { useEffect, useState } from "react";
import { useAnalytic } from "../../../hooks/cfp/useAnalytic";
import DashboardCard from "../../../components/card/DashboardCard";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import LineChart from "../../../components/chart/LineChart";
import DoughnutChart from "../../../components/chart/DoughnutChart";
import BarChart from "../../../components/chart/BarChart";
import BcChart from "../../../components/chart/BcChart";
import EvaluationChart from "../../../components/chart/EvaluationChart";

export default function DashboardCfp() {
  const {
    data,
    fetchData,
    getYearRange,
    isLoading,
    isLoadingBc,
    fetchProjectByMonth,
    fetchLeanerByMonth,
    fetchBonCommande,
    isLoadingProject,
  } = useAnalytic();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const allYears = getYearRange();
  const { symbol } = useAuth();

  useEffect(() => {
    fetchData(currentYear);
  }, [currentYear]);

  const formatMonetaire = (valeur) => {
    let entier = Math.floor(valeur);

    return (
      entier.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + symbol
    );
  };

  return (
    <div>
      <div className="flex justify-between my-6 mx-4">
        <div>
          <h1 className="font-semibold text-md">Année {currentYear} </h1>
        </div>
        <div>
          <select
            name="year"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="p-2 rounded-lg border border-gray-300 cursor-pointer"
          >
            {allYears.map((y, index) => (
              <option value={y} key={index}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-4 ">
            <DashboardCard
              name="Projet annuel"
              last={data.last_year_project_count}
              current={data.current_year_project_count}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Projets du mois courant"
              last={data.last_month_project}
              current={data.current_month_project}
              lastText="Mois précédent"
            />
            <DashboardCard
              name="Nombre de personnes formés"
              last={data.last_year_leaners}
              current={data.current_year_leaners}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Moyenne projet/client"
              last={data.last_projectsCustomer}
              current={data.current_projectsCustomer}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Moyenne formé/projet"
              last={data.last_year_leaners_average}
              current={data.current_year_leaners_average}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Heure moyenne par projet"
              current={data.formatted_average_project}
            />
            <DashboardCard
              name="Chiffre d'affaires moyenne/projet"
              last={formatMonetaire(data.last_year_ca_project)}
              current={formatMonetaire(data.current_year_ca_project)}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Chiffre d'affaires par formé"
              last={formatMonetaire(data.last_cost_by_employee)}
              current={formatMonetaire(data.cost_by_employee)}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Chiffre d'affaires du mois courant"
              last={formatMonetaire(data.last_total_month_cost)}
              current={formatMonetaire(data.total_month_cost)}
              lastText="Mois précédent"
            />
            <DashboardCard
              name="Total chiffre d'affaires"
              last={formatMonetaire(data.last_year_total_cost)}
              current={formatMonetaire(data.current_year_total_cost)}
              lastText="Année précédente"
            />
            <DashboardCard name="Nombre de clients" current={data.customers} />
            <DashboardCard
              name="Bon de commande"
              last={data.last_year_bc}
              current={data.current_year_bc}
              lastText="Année précédente"
            />
            <DashboardCard
              name="Facture impayées"
              last={formatMonetaire(data.restantDuLastYear)}
              current={formatMonetaire(data.restantDuCurrentYear)}
              lastText="Année précédente"
            />
          </div>

          <div className="p-5">
            <LineChart
              year={currentYear}
              lineData={data}
              fetchProjectByMonth={fetchProjectByMonth}
              isLoading={isLoadingProject}
            />
          </div>
          <div className="p-5">
            <BcChart
              isLoading={isLoadingBc}
              lineData={data}
              year={currentYear}
              fetchBonCommande={fetchBonCommande}
            />
          </div>
          <div className="grid grid-cols-2 mb-10 p-10  gap-5">
            <div>
              <DoughnutChart year={currentYear} dataDoughnut={data} />
            </div>
            <div>
              <BarChart
                year={currentYear}
                dataBarChart={data}
                fetchLeanerByMonth={fetchLeanerByMonth}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 mb-10 p-10  gap-5">
            <div>
              <EvaluationChart year={currentYear} dataEval={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
