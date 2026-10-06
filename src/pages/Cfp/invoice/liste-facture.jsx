import React, { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { SearchBar } from "./Formulaire/search-bar";
import { ResultCherche } from "./result-recherche";
import axios from "../../../config/axios";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
dayjs.extend(localizedFormat);
dayjs.locale("fr");

export function ListeFacture({ idInvoice }) {
  const [filters, setFilters] = useState({
    idEntreprise: 0,
    invoice_status: 0,
    idTypeFacture: 0,
    invoice_number: "",
    invoice_date_debut: "",
    invoice_date_fin: "",
  });
  const [perPage, setPerPage] = useState(10);

  const valideCherche = (
    idEntreprise,
    invoice_status,
    idTypeFacture,
    invoice_number,
    invoice_date_debut,
    invoice_date_fin
  ) => {
    setFilters((pervData) => ({
      ...pervData,
      idEntreprise: idEntreprise,
      invoice_status: invoice_status,
      idTypeFacture: idTypeFacture,
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
      idTypeFacture: 0,
      invoice_number: "",
      invoice_date_debut: "",
      invoice_date_fin: "",
    }));
  };

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="sm:w-[1024px] lg:w-full h-full bg-white">
        <div className="flex flex-col w-full gap-4">
          <SearchBar
            setPerPage={setPerPage}
            resetFiltre={resetFiltre}
            valideCherche={valideCherche}
          />
          <ResultCherche
            perPage={perPage}
            filters={filters}
            idInvoice={idInvoice}
          />
        </div>
      </div>
    </div>
  );
}

export const EntreprisePopoverCell = React.memo(({ invoice }) => {
  const entreprise =
    invoice.entreprise_from_vcollaboration ?? invoice.particulier;
  const [showDrawer, setShowDrawer] = useState(false);
  const [dataEtp, setDataEtp] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleClickEtp = async (idEtp) => {
    setIsLoading(true);
    setShowDrawer(true);
    try {
      const res = await axios.get(`/cfp/etp-drawer/${idEtp}`);
      setDataEtp(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <td className="cursor-pointer hover:underline">
        <HoverPopover
          button={
            <div data-serialtip="etp">
              <label
                onClick={() => handleClickEtp(invoice.idEntreprise)}
                className="max-w-xs overflow-hidden text-base text-gray-500 uppercase truncate cursor-pointer hover:underline underline-offset-2 whitespace-nowrap text-ellipsis"
              >
                {entreprise?.etp_name ?? entreprise?.part_name}
              </label>
            </div>
          }
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 text-xl font-medium text-purple-500 uppercase rounded-full bg-purple-50">
                {entreprise?.etp_initial_name ?? entreprise?.part_initial_name}
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-700 uppercase">
                  {entreprise?.etp_name ?? entreprise?.part_name}
                </p>
                <p className="text-base text-gray-500">
                  {entreprise?.etp_email ?? entreprise?.part_email}
                </p>
              </div>
            </div>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col w-full gap-2">
            <p className="font-semibold text-center text-gray-500 uppercase">
              Personne à contacter
            </p>
            <div className="inline-flex items-center gap-4">
              <div className="flex justify-end w-[40%]">
                <p className="text-gray-400">Nom :</p>
              </div>
              <div className="flex justify-start w-1/2">
                <p className="text-gray-500 uppercase">
                  {invoice?.contact_name ?? "Aucun contact"}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-4">
              <div className="flex justify-end w-[40%]">
                <p className="text-gray-400">Téléphone :</p>
              </div>
              <div className="flex justify-start w-1/2">
                <p className="text-gray-500">
                  {invoice?.contact_phone ?? "Aucun numero"}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-4">
              <div className="flex justify-end w-[40%]">
                <p className="text-gray-400">email :</p>
              </div>
              <div className="flex justify-start w-1/2">
                <p className="text-gray-500">
                  {invoice?.contact_mail ?? "Aucun email"}
                </p>
              </div>
            </div>
          </div>
        </HoverPopover>
      </td>

      {showDrawer && (
        <ProjectDrawer
          isLoading={isLoading}
          data={dataEtp}
          isShow={showDrawer}
          onClose={() => setShowDrawer(false)}
          account="cfp"
        />
      )}
    </>
  );
});

const HoverPopover = React.memo(({ button, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div>{button}</div>
      {open && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow-md p-4 w-[26em]">
          {children}
        </div>
      )}
    </div>
  );
});
