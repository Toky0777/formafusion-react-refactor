import { Eye, FileUp, HandCoins } from "lucide-react";
import { Link } from "react-router-dom";
import { dateFormat } from "../../../utils/global";
import { useAuth } from "../../../contexts/AuthContext";
import { getStatusColor } from "../../../services/service-action";

export default function CustomerInvoiceTable({ data }) {
  const { symbol } = useAuth();
  console.log(data);

  return (
    <div>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center py-8 text-gray-500 ">
                      Aucune facture trouvée
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition-all duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">
                    {item.idInvoice || "Projet sans nom"}
                  </td>
                  <td className="p-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      {item.idTypeFacture == 3 && (
                        <div className="relative group">
                          <span className="w-5 h-5 text-orange-700 bg-orange-100 rounded-full flex items-center justify-center">
                            <HandCoins />
                          </span>
                        </div>
                      )}

                      {item.idTypeFacture == 4 && (
                        <div className="relative group">
                          <span className="w-5 h-5 text-orange-700 bg-orange-100 rounded-full flex items-center justify-center">
                            <FileUp />
                          </span>
                        </div>
                      )}

                      {item.invoice_number}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {dateFormat(item.invoice_date) || "Non défini"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {symbol}{" "}
                    {Number(item.invoice_total_amount || 0).toLocaleString(
                      "fr-FR"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <span
                      className="text-white rounded-full p-1"
                      style={{
                        backgroundColor: getStatusColor(item.invoice_status),
                      }}
                    >
                      {item.invoice_status_name}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Link
                      to={`/cfp/facture/details/${item.idInvoice}`}
                      className="text-gray-600  transition-colors"
                      title="Voir le détail"
                    >
                      <Eye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
