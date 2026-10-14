import axios from "../config/axios";

export async function downloadEtpInvoicePdf(invoiceId) {
  const response = await axios.get(`/etp/factures/${invoiceId}/pdf`, {
    responseType: "blob",
  });
  const contentType = response.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("application/pdf")) {
    throw new Error("Le fichier retourné n'est pas un PDF.");
  }

  const pdfUrl = URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = `Facture-${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
}
