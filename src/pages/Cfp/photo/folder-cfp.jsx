import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/ui/spinner";
import { PhotoContext } from "../../../contexts/Apprenants/PhotoProvider";
import axios from "../../../config/axios";

export function FolderCfp() {
  const navigate = useNavigate();
  const { searchTerm, date } = useContext(PhotoContext);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/cfp/gallery/folder/${date}`);
        console.log("API response:", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (error)
    return (
      <div className="text-center text-gray-600 py-4">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );

  if (loading) return <Spinner />;

  const results = Array.isArray(data?.data)
    ? data.data.filter((item) =>
        item.nomDossier?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Liste des dossiers */}
      <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(220px,1fr))] pt-8 px-4">
        {results.map((folder, index) => (
          <div
            key={index}
            onClick={() =>
              navigate("/cfp/photos/projets", {
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
                    alt="img"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300"
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
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800 truncate">
                  {folder.nomDossier}
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
