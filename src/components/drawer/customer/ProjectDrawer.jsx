import { useState } from "react";
import { Building2, Mail, Phone } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { renderProjectsByStatus } from "../../table/customer/project-table-customer";
import CustomerInvoiceTable from "../../table/customer/invoice-table-customer";
import CustomerBcTable from "../../table/customer/bc-table-customer";
import DrawerParent from "../drawer-parent";

export default function ProjectDrawer({
  isLoading,
  isShow,
  onClose,
  data,
  account,
}) {
  const [activeMenu, setActiveMenu] = useState(1);

  const menu = [
    { id: 1, name: "Projets" },
    { id: 2, name: "Factures" },
    { id: 3, name: "Devis" },
    { id: 4, name: "Bon de commandes" },
  ];

  const renderCustomerInfo = () => {
    const customer = data?.customer || data?.cfp;
    return (
      <div className="flex justify-center items-center rounded-lg p-4 mb-6">
        {isLoading ? (
          <div className="space-y-3 animate-pulse w-56">
            <div className="h-4 bg-gray-300 rounded w-40"></div>
            <div className="h-4 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center text-gray-700">
              <Building2 className="w-4 h-4 mr-3 text-gray-500" />
              <span className="font-medium">
                {customer.customerName || customer.cfp_name}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-3 text-gray-500" />
              <span>{customer.customerEmail || customer.cfp_email}</span>
            </div>

            <div className="flex items-center text-gray-700">
              <Phone className="w-4 h-4 mr-3 text-gray-500" />
              <span>
                {customer.customerPhone || customer.cfp_phone || "Aucun numéro"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;

    switch (activeMenu) {
      case 1:
        return account === "cfp" && renderProjectsByStatus(data);

      case 2:
        return <CustomerInvoiceTable data={data?.invoices} />;

      case 3:
        return <CustomerInvoiceTable data={data?.quotations} />;

      case 4:
        return <CustomerBcTable data={data?.bon_commandes} />;

      default:
        return null;
    }
  };

  return (
    <DrawerParent
      isOpen={isShow}
      title="Details de l'entreprise"
      onClose={onClose}
    >
      <div className="flex flex-col h-full overflow-auto">
        {renderCustomerInfo()}

        <div className="flex justify-around  mb-4">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`py-2 px-4 font-medium ${
                activeMenu === item.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-500"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">{renderContent()}</div>
      </div>
    </DrawerParent>
  );
}
