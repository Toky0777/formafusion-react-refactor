import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { toast } from "react-toastify";
import { searchService } from "../../../services/searchService";
import { TousProforma } from "../../../pages/Cfp/invoice/Proforma/Liste/proforma-all";

dayjs.locale("fr");
dayjs.extend(localizedFormat);

export function Quote({ searchQuery }) {
  const [quotes, setQuotes] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [reload, setReload] = useState(0);

  const fetchQuotes = useCallback(
    async (page = 1) => {
      try {
        const res = await searchService.getProforma(searchQuery, page);
        const { data, current_page, last_page, total } = res?.quotes ?? {};

        console.log(res);

        if (!data) {
          setQuotes([]);
          return;
        }

        setQuotes({
          invoices: data,
        });
        setPagination({
          current_page: current_page,
          last_page: last_page,
          total: total,
        });
        console.log(pagination);
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des factures");
      } finally {
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    fetchQuotes(1);
  }, [fetchQuotes]);

  return (
    <TousProforma
      data={quotes}
      pagination={pagination}
      setPagination={setPagination}
      setData={setQuotes}
      setReload={setReload}
    />
  );
}
