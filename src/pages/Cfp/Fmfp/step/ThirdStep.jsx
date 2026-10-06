import { useState } from "react";
import ButtonSecondary from "../../../../components/button/ButtonSecondary";
import { Loader2, Plus, Search, Building2, Building } from "lucide-react";
import AddCustomer from "../../../../components/drawer/project/AddCustomer";
import { IMAGE_URL } from "../../../../config/env";

export default function ThirdStep({
  formData,
  errors,
  onChange,
  onBack,
  etps,
  isSubmitting,
  onEtpAdded,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  const filteredEtps = etps.filter((etp) =>
    etp.etp_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEtp = etps.find((etp) => etp.idEtp === formData.idEtp);

  const handleNewEtpAdded = (newEtpId) => {
    if (onEtpAdded) {
      onEtpAdded(newEtpId);
    }
    onChange("idEtp", newEtpId);
    setShowDrawer(false);
    setSearchTerm("");
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
        <div className="space-y-4">
          <div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredEtps.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredEtps.map((etp) => (
                    <button
                      key={etp.idEtp}
                      type="button"
                      onClick={() => onChange("idEtp", etp.idEtp)}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left   transition-all duration-200${
                        formData.idEtp === etp.idEtp
                          ? "bg-blue-100 border-blue-600 bg-blue-50"
                          : "bg-white hover:bg-blue-50"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border ${
                          etp.etp_logo
                            ? "border-gray-200"
                            : "border-gray-300 bg-gray-50"
                        } flex items-center justify-center`}
                      >
                        {etp.etp_logo ? (
                          <img
                            src={`${IMAGE_URL}/img/entreprises/${etp.etp_logo}`}
                            alt={etp.etp_name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Building className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      <span
                        className={`text-base font-medium truncate ${
                          formData.idEtp === etp.idEtp
                            ? "text-blue-900"
                            : "text-gray-800"
                        }`}
                      >
                        {etp.etp_name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  Aucune entreprise trouvée
                </div>
              )}
            </div>
          </div>

          {searchTerm && filteredEtps.length === 0 && (
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Plus size={18} />
              <span>Ajouter une nouvelle entreprise</span>
            </button>
          )}

          {errors.entreprise && (
            <p className="text-sm text-red-600">{errors.entreprise}</p>
          )}
        </div>

        <div>
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[200px] flex items-center justify-center">
            {selectedEtp ? (
              <div className="text-center space-y-3 p-6  ">
                <div
                  className={`mx-auto h-16 w-16 rounded-full overflow-hidden border flex items-center justify-center ${
                    selectedEtp.etp_logo
                      ? "border-gray-200 bg-white"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  {selectedEtp.etp_logo ? (
                    <img
                      src={`${IMAGE_URL}/img/entreprises/${selectedEtp.etp_logo}`}
                      alt={selectedEtp.etp_name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEtp.etp_name || "Nom de l’entreprise"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedEtp.etp_email || "Email non disponible"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Building2 size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune entreprise sélectionnée</p>
                <p className="text-xs mt-1">
                  Sélectionnez une entreprise dans la liste
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <ButtonSecondary onClick={onBack}>Retour</ButtonSecondary>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="animate-spin" size={18} />}
          <span className="ml-2">{isSubmitting ? "Création..." : "Créer"}</span>
        </button>
      </div>

      {showDrawer && (
        <AddCustomer
          show={showDrawer}
          close={() => setShowDrawer(false)}
          name={searchTerm}
          manageEtp={handleNewEtpAdded}
        />
      )}
    </div>
  );
}
