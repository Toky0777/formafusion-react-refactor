import React, { useContext } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { ExportPdf } from "../../services/export-pdf";
import { InvoiceContext } from "../../contexts/invoice";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/Api";
import { useAuth } from "../../contexts/AuthContext";
dayjs.locale("fr");
const DropdownItem = ({
  type = "",
  titre = "",
  action = "",
  nature = "",
  onClick = () => {},
  idInvoice,
  drawerClick,
  data,
  setData,
}) => {
  // const formatDate = (date) => dayjs(date).format("D MMMM YYYY");
  const { setIdInvoice } = useContext(InvoiceContext);
  const navigate = useNavigate();
  const { callApi } = useApi();
  const { token } = useAuth();
  const handleClick = async () => {
    if (titre === "Exporter en PDF") {
      ExportPdf(idInvoice, token);
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
    } else if (nature === "EditerInvoice") {
      setIdInvoice(idInvoice);
      navigate("/cfp/facture/edit-invoice");
    } else if (nature === "EditerProforma") {
      setIdInvoice(idInvoice);
      navigate("/cfp/facture/edit-proforma");
    } else {
      setIdInvoice(idInvoice);
      navigate("/cfp/facture/details");
    }
  };

  const renderByType = () => {
    switch (type) {
      case "lien":
        return (
          <li>
            <a
              onClick={handleClick}
              className="text-base text-gray-600 cursor-pointer dropdown-item hover:bg-gray-50"
            >
              {titre}
            </a>
          </li>
        );
      case "buttonDelete":
        return (
          <li className="z-50">
            <form action={action} method="post">
              <button
                type="submit"
                className="text-base text-gray-600 dropdown-item hover:bg-gray-50"
              >
                {titre}
              </button>
            </form>
          </li>
        );
      case "customBtn":
        return (
          <li>
            <button
              onClick={onClick}
              type="button"
              className="text-base text-gray-600 dropdown-item hover:bg-gray-50"
            >
              {titre}
            </button>
          </li>
        );
      case "drawer":
        return (
          <li>
            <a
              onClick={drawerClick}
              className="text-base text-gray-600 cursor-pointer dropdown-item hover:bg-gray-50"
            >
              {titre}
            </a>
          </li>
        );
      default:
        return null;
    }
  };

  return renderByType();
};

export default React.memo(DropdownItem);
