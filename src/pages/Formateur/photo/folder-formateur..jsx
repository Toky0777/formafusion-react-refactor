import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/ui/spinner";
import axios from "../../../config/axios";

export function FolderFormateurs() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const date = 2025
  useEffect(() => {

    const fetchByDate = async () => {
      try {
        setIsLoading(true);
        setError(""); // reset erreur
        const res = await axios.get(`/form/gallery/folder/${date}`);
        setData(res.data || []); // ✅ garantir tableau
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
  }, []);


  if (isLoading) return <Spinner />;
  if (error) {
    return (
      <div className="py-8 text-center text-gray-600">
        <p className="text-xl font-semibold">{error}</p>
      </div>
    );
  }

  const results = data

  if (results.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600">
        <p className="text-xl font-semibold">Aucun résultat</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(220px,1fr))] pt-8 px-4">
      {results.map((folder) => (
        <div
          key={folder.idDossier}
          onClick={() =>
            navigate("/formateur/photos/projets", {
              state: {
                idFolder: folder.idDossier,
                folder_name: folder.nomDossier,
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
                  alt={folder.nomDossier}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-300 h-14 w-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              )}
            </div>
          </div>

          {/* Texte */}
          <div className="p-3 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {folder.nomDossier}
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400 transition group-hover:text-gray-600"
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
      <div
        onClick={() =>
          navigate("/formateur/photos/projets", {
            state: {
              idFolder: 1,
              nomDossier: "Tous les projets",
            },
          })
        }
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-300 h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </div>
        </div>

        {/* Texte */}
        <div className="p-3 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              Tous les projets
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 transition group-hover:text-gray-600"
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
    </div>
  );
}
