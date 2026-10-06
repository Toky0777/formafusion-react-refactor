import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function CatalogOnlineLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // const [moduleCount, setModuleCount] = useState({
  //   online: 0,
  //   offline: 0,
  //   trash: 0,
  // });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // 🔹 clé pour recharger l’Outlet
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // const getModuleCount = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await catalogService.getModulePublicCount();
  //     setModuleCount(response ?? { online: 0, offline: 0, trash: 0 });
  //   } catch (err) {
  //     console.error("Erreur lors de la récupération des données:", err);
  //     setError("Impossible de charger les données.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getModuleCount();
  // }, []);

  // Lorsqu’un module est ajouté
  // const handleModuleAdded = (newModule) => {
  //   getModuleCount();

  //   setReloadKey((prev) => prev + 1);

  //   setSearch(newModule.name);

  //   navigate("/cfp/cours_en_ligne/preparation");
  // };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-gray-50 rounded-2xl shadow-sm p-4 border-l-4 border-purple-500 ">
        <div className="w-full px-6 py-4">
          <nav className="flex flex-wrap items-center justify-between gap-y-4">
            <div >
              <div className="inline-flex items-center gap-3">
                {/* <BookOpen className="w-6 h-6 text-purple-500" /> */}
                <h1 className="text-2xl font-bold tracking-wide text-gray-800">
                  Consultez votre catalogue en ligne ici
                </h1>
              </div>
            </div>

            {/* Tabs */}
            {/*<ul className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
              {[
                {
                  label: "Formations disponibles",
                  to: "/cfp/cours_en_ligne",
                  key: "online",
                },
                {
                  label: "En préparation",
                  to: "/cfp/cours_en_ligne/preparation",
                  key: "offline",
                },
                {
                  label: "En corbeille",
                  to: "/cfp/cours_en_ligne/corbeille",
                  key: "trash",
                },
              ].map(({ label, to, key }) => (
                <li key={key}>
                  <NavLink
                    to={to}
                    end={key === "online"}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1 rounded-xl border min-w-[120px] justify-center transition-colors duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`
                    }
                  >
                    <span className="font-semibold text-[12px] whitespace-nowrap">
                      {label}
                    </span>
                    <div
                      className={`flex items-center justify-center w-6 h-5 text-[12px] font-semibold border rounded-full
                        ${
                          to.includes("cours_en_ligne") && key === "online"
                            ? "bg-white text-blue-600 border-white"
                            : "bg-gray-200 text-gray-700 border-gray-300"
                        }`}
                    >
                      {loading ? "…" : moduleCount[key]}
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Search */}
            <div className="w-full sm:w-[25em]">
              <div className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 shadow-sm rounded-xl">
                <input
                  placeholder="Que cherchez-vous ?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                  type="text"
                />
              </div>
            </div>

            {/* Add button */}
            {/* <div className="z-50">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 px-5 py-3 font-medium text-white bg-gray-300 shadow-md rounded-2xl"
              >
                <FaPlus className="text-lg text-black" />
                <span className="hidden text-black sm:inline">
                  Ajouter un cours
                </span>
              </button>
            </div>

            {/* Modal */}
            {/* <ModalAddOnline
              show={isFormOpen}
              handleClose={() => setIsFormOpen(false)}
              onModuleAdded={handleModuleAdded}
            /> */}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow">
        <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8">
          {error && <p className="text-red-500">{error}</p>}
          <Outlet
            context={{
              search,
              // refreshModuleCount: getModuleCount,
              reloadKey,
            }}
          />
        </div>
      </main>
    </div>
  );
}
