import { useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
// import { TousProforma } from "./proforma-all";
// import { Converti } from "./Converti";
import useApi from "../../../../../hooks/Api";
import { Spinner } from "../../../../../components/ui/spinner";
import { Converti } from "./Converti";
import { ProformaFilter } from "../formulaire/search-bar-proforma";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

export function ConvertiAll() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="sm:w-[1024px] lg:w-full h-full bg-white">
        <div className="flex flex-col w-full gap-6">
          <FilterNavBar />
        </div>
      </div>
    </div>
  );
}

function FilterNavBar() {
  const [nav, setNav] = useState("proforma-tous");
  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState({});
  const valideCherche = (
    idEntreprise,
    invoice_status,
    invoice_number,
    invoice_date_debut,
    invoice_date_fin
  ) => {
    setFilters((pervData) => ({
      ...pervData,
      idEntreprise: idEntreprise,
      invoice_status: invoice_status,
      invoice_number: invoice_number,
      invoice_date_debut: invoice_date_debut,
      invoice_date_fin: invoice_date_fin,
    }));
  };
  const resetFiltre = () => {
    setFilters((pervData) => ({
      ...pervData,
      idEntreprise: 0,
      invoice_status: 0,
      invoice_number: "",
      invoice_date_debut: "",
      invoice_date_fin: "",
    }));
  };

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 0,
    total: 0,
  });
  const [resultat, setResultat] = useState(null);
  const { loading, callApi } = useApi();

  const [perPage, setPerPage] = useState(10);
  useEffect(() => {
    const fetchData = async () => {
      let isMounted = true;
      const res = await callApi("/cfp/factureProfo", {
        params: {
          ...filters,
          page: pagination.current_page,
          perPage: perPage,
        },
      });
      if (isMounted && res?.invoices) {
        const updatedInvoices = res.invoices.data.map((invoice) => {
          const total = Number(invoice.invoice_total_amount) || 0;
          const paid = Array.isArray(invoice.payments)
            ? invoice.payments.reduce(
                (acc, p) => acc + (Number(p.amount) || 0),
                0
              )
            : 0;
          const remaining = total - paid;
          return { ...invoice, remaining };
        });
        setResultat({
          ...res,
          invoices: updatedInvoices,
        });
        setPagination({
          current_page: res.invoices.current_page,
          last_page: res.invoices.last_page,
          total: res.invoices.total,
        });
      }
    };
    fetchData();
  }, [filters, pagination.current_page, callApi, reload, perPage]);

  if (loading || resultat === null) return <Spinner />;
  //console.log(resultat);
  return (
    <>
      <ProformaFilter
        data={resultat}
        valideCherche={valideCherche}
        resetFiltre={resetFiltre}
        perPage={perPage}
        setPerPage={setPerPage}
      />
      <ProformaResult
        data={resultat}
        nav={nav}
        setData={setResultat}
        pagination={pagination}
        setPagination={setPagination}
        setReload={setReload}
      />
    </>
  );
}

function ProformaResult({ data, setData, setReload }) {
  const renderPage = () => {
    return <Converti data={data} setData={setData} setReload={setReload} />;
  };

  return <main>{renderPage()}</main>;
}
