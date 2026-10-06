import { useEffect, useMemo, useState } from "react";
import CustomerCard from "../../../components/card/CustomerCard";
import { useCustomer } from "../../../hooks/useCustomer";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import Search from "../../../components/search/search";
import { Building2, Plus, Users } from "lucide-react";
import ButtonPrimary from "../../../components/button/ButtonPrimary";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";
import AddCustomer from "../../../components/drawer/customer/AddCustomer";

export default function CustomerList() {
  const {
    etps,
    getAllEtps,
    editEtp,
    loading,
    updateEtp,
    deleteEtp,
    updateLogoEtp,
  } = useCustomer();
  const { searchTerm, handleChange } = useSearch();
  const [showDrawerAdd, setShowDrawerAdd] = useState(false);

  useEffect(() => {
    getAllEtps();
  }, []);

  const filteredEtps = useMemo(() => {
    if (!searchTerm.trim()) return etps;

    const term = searchTerm.toLowerCase();
    return etps.filter((etp) => etp.etp_name?.toLowerCase().includes(term));
  }, [etps, searchTerm]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col gap-2">
            <LoadingSpinner />
            <span> Chargement... </span>
          </div>
        </div>
      ) : (
        <div>
          <div className="sticky top-0 z-30 px-4 py-3 mb-8  shadow-sm bg-white/90 backdrop-blur-sm rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-600">Clients</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {etps.length != 0 && (
                  <Search
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Recherche client"
                  />
                )}

                <ButtonPrimary onClick={() => setShowDrawerAdd(true)}>
                  <Plus size={18} className="mr-1" />
                  Nouveau
                </ButtonPrimary>
              </div>
            </div>
          </div>

          {filteredEtps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Users className="w-16 h-16 mb-4 text-gray-400" />
              <p className="text-lg font-medium">Aucun client</p>
              <p className="text-sm text-gray-400">
                Cliquez sur "Nouveau" pour ajouter un client
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5 px-5">
              {filteredEtps.map((etp, index) => (
                <div key={index}>
                  <CustomerCard
                    data={etp}
                    account="cfp"
                    handleEdit={editEtp}
                    handleUpdate={updateEtp}
                    handleDelete={deleteEtp}
                    updateLogo={updateLogoEtp}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Drawer ajout */}
          {showDrawerAdd && (
            <AddCustomer
              show={showDrawerAdd}
              close={() => setShowDrawerAdd(false)}
              getAllEtps={getAllEtps}
              name=""
            />
          )}
        </div>
      )}
    </div>
  );
}
