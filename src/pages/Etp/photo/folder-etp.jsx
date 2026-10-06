import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoContext } from "../../../contexts/Apprenants/PhotoProvider";
import { Spinner } from "../../../components/ui/spinner";
import axios from "../../../config/axios";
export function FolderEtp() {
  const navigate = useNavigate();
  const { searchTerm, date } = useContext(PhotoContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!date) return; // ✅ éviter appel API si pas d'année sélectionnée

    const fetchByDate = async () => {
      try {
        setIsLoading(true);
        setError(""); // reset erreur
        const res = await axios.get(`/etp/folders/by/${date}`);
        setData(res.data?.folders || []); // ✅ garantir tableau
      } catch (e) {
        console.error("Erreur lors du chargement par date:", e);
        if (e.response?.status === 404) {
          setError(e.response?.data?.message || "Aucun résultat !");
        } else {
          setError("Erreur inconnue");
        }
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchByDate();
  }, [date]);

  // ✅ États de rendu
  if (!date) return <Spinner />;
  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  const results =
    data.filter((item) =>
      item.folder_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <p className="text-xl font-semibold">Aucun résultat</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(220px,1fr))] pt-8 px-4">
        {results.map((folder, index) => (
          <div
            key={index}
            onClick={() =>
              navigate("/etp/photos/projets", {
                state: {
                  idFolder: folder.idDossier,
                  folder_name: folder.folder_name,
                },
              })
            }
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden rounded-t-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                {folder.image ? (
                  <img
                    src={folder.image}
                    alt="img"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="3"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                )}
              </div>
            </div>

            {/* Texte */}
            <div className="p-3 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {folder.folder_name}
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
