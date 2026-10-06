import React from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";

import { ExportPdf } from "../../services/export-pdf";

const DropdownItem = ({
  type = "",
  titre = "",
  action = "",
  nature = "",
  onClick = () => { },
  idInvoice,
  drawerClick,
  data,
  setData,
}) => {
  const navigate = useNavigate();
  const { callApi } = useApi();

  const handleClick = async () => {
    if (titre === "Exporter en PDF") {
      ExportPdf(idInvoice);
    } else if (titre === "Supprimer") {
      try {
        const res = await callApi(`/cfp/factures/${idInvoice}/destroy`, {
          method: "GET",
        });
        if (res.status === 200) {
          const filtrer = data.invoices.filter(
            (invoice) => invoice.idInvoice !== idInvoice
          );
          setData((prevData) => ({
            ...prevData,
            invoices: filtrer,
          }));
        }
      } catch (error) {
        alert(error);
      }
    } else if (nature === "EditerProforma") {
      navigate(`/cfp/proforma/modifie-proforma/${idInvoice}`);
    } else if (nature === "EditerAcompte") {
      navigate(`/cfp/facture/modifie-acompte/${idInvoice}`);
    } else if (nature === "EditerSolde") {
      navigate(`/cfp/facture/modifie-solde/${idInvoice}`);
    } else if (nature === "showAcompte") {
      navigate(`/cfp/facture/details/${idInvoice}`);
    } else {
      navigate(`/cfp/proforma/details/${idInvoice}`);
    }
  };

  const baseStyle =
    "block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150";

  const renderByType = () => {
    switch (type) {
      case "lien":
        return (
          <button onClick={handleClick} className={baseStyle}>
            {titre}
          </button>
        );
      case "buttonDelete":
        return (
          <form action={action} method="post">
            <button type="submit" className={baseStyle}>
              {titre}
            </button>
          </form>
        );
      case "customBtn":
        return (
          <button onClick={onClick} type="button" className={baseStyle}>
            {titre}
          </button>
        );
      case "drawer":
        return (
          <button onClick={drawerClick} className={baseStyle}>
            {titre}
          </button>
        );
      default:
        return null;
    }
  };

  return <li className="w-full">{renderByType()}</li>;
};

export default React.memo(DropdownItem);
