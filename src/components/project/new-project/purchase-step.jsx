import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { projectService } from "../../../services/projectService";
import AddPurchaseOrder from "../../drawer/project/AddPurchaseOrder";

export function PurchaseStep({ value, onChange, etpIds }) {
  const [query, setQuery] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [showDrawerAdd, setShowDrawerAdd] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const data = await projectService.getPurchaseOrders(etpIds);

      setPurchaseOrders(data);
    } catch (err) {
    } finally {
    }
  };

  const filtered = purchaseOrders.filter((po) =>
    po.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item) => {
    onChange(item.id === value ? null : item.id);
  };

  const handleAdd = (id) => {
    fetchAllData();
    onChange(id === value ? null : id);
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Bon de commande
      </label>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search purchase order..."
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
      />

      <div className="w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[40vh] overflow-y-auto">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`px-4 py-2 cursor-pointer rounded-md transition-all duration-150
                ${
                  value === item.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }
              `}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </div>
          ))
        ) : (
          <>
            <button
              onClick={() => setShowDrawerAdd(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-b-lg"
            >
              <Plus className="w-4 h-4" />

              {query
                ? `Ajouter ce bon de commande "${query}"`
                : "Voulez-vous créer un nouveau bon de commande"}
            </button>

            <div className="p-3 text-gray-500 text-sm text-center">
              Aucun résultat
            </div>
          </>
        )}
      </div>
      {showDrawerAdd && (
        <AddPurchaseOrder
          open={showDrawerAdd}
          close={() => setShowDrawerAdd(false)}
          selectedEtpId={etpIds}
          managePurchaseOrder={handleAdd}
        />
      )}
    </div>
  );
}
