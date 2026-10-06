import { User } from "lucide-react";
import CardParticulier from "../../../components/card/CardParticulier";
import HeaderParticulier from "../../../components/header/header-particulier";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { useParticulier } from "../../../hooks/cfp/useParticulier";
import { useEffect } from "react";

export default function ParticuliersList() {
  const {
    getAllParticulierInCfp,
    isLoading,
    parts,
    deleteParticulier,
    editParticulier,
    addParticulier,
    updateParticulier,
    updatePhotoParticulier,
    getProjectParticulier,
  } = useParticulier();

  useEffect(() => {
    getAllParticulierInCfp();
  }, []);

  return (
    <div>
      <HeaderParticulier onAdd={addParticulier} />
      {isLoading ? (
        <LoadingSpinner />
      ) : !parts || parts.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gray-100 rounded-full shadow-sm">
              <User size={40} />
            </div>
            <h1 className="text-xl font-medium">Aucun particulier trouvé</h1>
            <p className="text-sm text-gray-400">
              Veuillez cliquer sur{" "}
              <span className="font-semibold">Nouveau</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {parts.map((p) => (
            <CardParticulier
              key={p?.idParticulier}
              onDelete={deleteParticulier}
              parts={p}
              editParticulier={editParticulier}
              updateParticulier={updateParticulier}
              updatePhotoParticulier={updatePhotoParticulier}
              projets={getProjectParticulier}
            />
          ))}
        </div>
      )}
    </div>
  );
}
