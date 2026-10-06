import React, { useEffect, useState } from "react";
import useApi from "../../../../hooks/Api";
import { ArrowDown01, Building, FileText, Funnel, RotateCw, Route } from "lucide-react";
export const SearchBar = React.memo(
  ({ valideCherche, resetFiltre, perPage, setPerPage }) => {
    const { callApi, loading } = useApi();
    const [result, setResult] = useState(null);
    const [filtre, setFiltre] = useState({
      idEntreprise: 0,
      invoice_status: 0,
      idTypeFacture: 0,
      invoice_number: "",
      invoice_date_debut: "",
      invoice_date_fin: "",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      valideCherche(
        filtre.idEntreprise,
        filtre.invoice_status,
        filtre.idTypeFacture,
        filtre.invoice_number,
        filtre.invoice_date_debut,
        filtre.invoice_date_fin
      );
    };

    const handleReset = () => {
      setFiltre({
        idEntreprise: 0,
        invoice_status: 0,
        idTypeFacture: 0,
        invoice_number: "",
        invoice_date_debut: "",
        invoice_date_fin: "",
      });
      resetFiltre();
    };

    useEffect(() => {
      const fetchresult = async () => {
        try {
          const res = await callApi(`/cfp/factures/filtre`, {
            method: "GET",
          });
          setResult(res);
        } catch (error) {
          console.log(error);
        }
      };

      fetchresult();
    }, [callApi]);
    if (loading || result === null)
      return <div className="flex items-center justify-center h-10"></div>;
    return (
      <>
        <div className="w-full pt-4">
          <div className="">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-between gap-2 flex-nowrap"
            >
              {/* Filtres */}
              <div className="flex items-center flex-1 gap-2 overflow-x-auto flex-nowrap">
                {/* ENTREPRISE */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-48 min-w-[190px]">
                  <Building className="w-5 text-gray-600" />
                  <select
                    value={filtre?.idEntreprise}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        idEntreprise: Number(e.target.value),
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  >
                    <option value={0}>Entreprise</option>
                    {result?.entreprises &&
                      Object.values(result.entreprises)
                        .sort((a, b) => {
                          const nameA = (
                            a.etp_name ??
                            a.part_name ??
                            ""
                          ).toLowerCase();
                          const nameB = (
                            b.etp_name ??
                            b.part_name ??
                            ""
                          ).toLowerCase();
                          return nameA.localeCompare(nameB);
                        })
                        .map((entreprise, index) => (
                          <option
                            key={index}
                            value={entreprise.idEtp ?? entreprise.idParticulier}
                          >
                            {entreprise.etp_name ?? entreprise.part_name}
                          </option>
                        ))}
                  </select>
                </div>

                {/* STATUT */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-36 min-w-[140px]">
                  <Route className="w-5 text-gray-600" />
                  <select
                    value={filtre?.invoice_status}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        invoice_status: Number(e.target.value),
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  >
                    <option value={0}>Statut</option>
                    {result?.statuses?.map((status, index) => (
                      <option key={index} value={status.idInvoiceStatus}>
                        {status.invoice_status_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Type facture */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-40 min-w-[150px]">
                  <FileText className="w-5 text-gray-600" />
                  <select
                    value={filtre?.idTypeFacture || 0}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        idTypeFacture: Number(e.target.value),
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  >
                    <option value={0}>Type facture</option>
                    <option value={1}>Standard</option>
                    <option value={3}>Acompte</option>
                    <option value={4}>Solde</option>
                  </select>
                </div>

                {/* NUMÉRO */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-32 min-w-[120px]">
                  <ArrowDown01 className="w-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Numéro"
                    value={filtre?.invoice_number}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        invoice_number: e.target.value,
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  />
                </div>

                {/* DATE DEBUT */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-md border w-44 min-w-[140px]">
                  <label className="text-xs text-gray-500 whitespace-nowrap">
                    Début :
                  </label>
                  <input
                    type="date"
                    value={filtre?.invoice_date_debut}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        invoice_date_debut: e.target.value,
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  />
                </div>

                {/* DATE FIN */}
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-md border w-44 min-w-[140px]">
                  <label className="text-xs text-gray-500 whitespace-nowrap">
                    Fin :
                  </label>
                  <input
                    type="date"
                    value={filtre?.invoice_date_fin}
                    onChange={(e) =>
                      setFiltre((prev) => ({
                        ...prev,
                        invoice_date_fin: e.target.value,
                      }))
                    }
                    className="w-full text-xs bg-transparent outline-none"
                  />
                </div>

                {/* PAR PAGE */}
              </div>

              {/* Boutons */}
              <div className="flex items-center flex-shrink-0 gap-2 ml-4">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 text-sm text-gray-600 rounded-md bg-gray-100 hover:bg-purple-500 hover:text-white transition-all"
                >
                  <Funnel className="w-4" />
                  Filtrer
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-purple-100 hover:text-purple-600 hover:border-gray-100 transition-all"
                >
                  <RotateCw className="w-4" />
                  Réinitialiser
                </button>
                <div className="flex justify-end">
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-24 min-w-[90px]">
                    <label
                      htmlFor="perPage"
                      className="text-sm text-gray-500 whitespace-nowrap"
                    >
                      Page
                    </label>
                    <select
                      id="perPage"
                      value={perPage}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                      className="w-full text-xs bg-transparent outline-none"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
);
