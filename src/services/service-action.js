import axios from "../config/axios";
export const handleApprouve = async (
  idInvoice,
  setData,
  index,
  setLoading
) => {
  try {
    // console.log(sessionStorage.getItem('token'));
    setLoading(true);
    const response = await axios.post(`/cfp/factures/${idInvoice}/approve`, {});
    if (response.data) {
      setData((prevData) => ({
        ...prevData,
        invoices: prevData.invoices.map((invoice, i) => {
          if (i === index) {
            return {
              ...invoice,
              invoice_status: 2,
              status_color: "rose-500",
              status: {
                ...invoice.status,
                idInvoiceStatus: 2,
                invoice_status_name: "Non envoyé",
              },
            };
          } else {
            return invoice;
          }
        }),
      }));
    }
  } catch (error) {
    console.error("Erreur lors de l’approbation :", error);
  } finally {
    setLoading(false);
  }
};
export const handleApprouveDraft = async (idInvoice) => {
  try {
    const response = await axios.post(`/cfp/factures/${idInvoice}/approve`, {});
    if (response.data.message === "OK") {
      window.location.reload();
    }

    //  setData(prevData => ({
    //   ...prevData,
    //   invoicesDraft: {
    //     ...prevData.invoicesDraft,
    //     invoicesDraft: prevData.invoicesDraft.map((invoice, i) => {
    //       if (i === index) {
    //         return {
    //           ...invoice,
    //           invoice_status: 2,
    //           status : {...invoice.status ,
    //             idInvoiceStatus: 2,
    //             invoice_status_name : "Non envoyé"
    //             }
    //         };
    //       } else {
    //         return invoice;
    //       }
    //     })
    //   }
    // }));
    // console.log(data);
  } catch (error) {
    console.error("Erreur lors de l’approbation :", error);
  }
};
export const handleCancel = async (idInvoice, setData, index) => {
  try {
    const response = await axios.post(`/cfp/factures/${idInvoice}/cancel`, {});
    if (response.data.message === "OK") {
      setData((prevData) => ({
        ...prevData,
        invoices: prevData.invoices.map((invoice, i) => {
          if (i === index) {
            return {
              ...invoice,
              invoice_status: 9,
              status_color: "rose-500",
              status: {
                ...invoice.status,
                idInvoiceStatus: 9,
                invoice_status_name: "Annulé",
              },
            };
          } else {
            return invoice;
          }
        }),
      }));
    }
  } catch (error) {
    console.error("Erreur lors de l'annulation :", error);
  }
};
export const handleSendEmail = async (
  idInvoice,
  setData,
  index,
  setLoading
) => {
  try {
    setLoading(true);
    // Effectuer un appel POST avec des données dans le body
    const response = await axios.post(
      `/cfp/factures/send-invoice-email/${idInvoice}`,
      {}
    );

    if (response.data.status === 400) {
      console.log(response.data.message);
    }
    if (response.data.status === 200) {
      setData((prevData) => ({
        ...prevData,
        invoices: prevData.invoices.map((invoice, i) => {
          if (i === index) {
            return {
              ...invoice,
              invoice_status: 3,
              status_color: "[#37718e]",
              status: {
                ...invoice.status,
                idInvoiceStatus: 3,
                invoice_status_name: "Envoyé",
              },
            };
          } else {
            return invoice;
          }
        }),
      }));
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi des données:", err);
  } finally {
    setLoading(false);
  }
};
export const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "#9CA3AF"; // Brouillon
    case 2:
      return "#F43F5E"; // Non envoyé
    case 3:
      return "#37718e"; // Envoyé
    case 4:
      return "#0D9488"; // Payé
    case 5:
      return "#CA8A04"; // Partiel
    case 6:
      return "#F87171"; // Impayé
    case 7:
      return "#16A34A"; // Convertis
    case 8:
      return "#DC2626"; // Expiré
    case 9:
      return "#F43F5E"; // Annulé
    case 10:
      return "#F97316"; // En relance active
    case 11:
      return "#92400E"; // Douteuse
    case 12:
      return "#7C3AED"; // En litige
    case 13:
      return "#374151"; // Irrecouvrable
    case 14:
      return "#1E3A8A"; // Transmis à huissier
    case 15:
      return "#991B1B"; // En poursuite judiciaire
    default:
      return "#3B82F6"; // blue-500 (par défaut)
  }
};

export const VoirProforma = (idProforma, navigate) => {
  navigate(`/cfp/proforma/details/${idProforma}`);
};
