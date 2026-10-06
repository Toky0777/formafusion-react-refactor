import { useState, useEffect, useCallback, useRef } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import axios from "../../../config/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import locale française
import { ProjectListItem } from "./list";

export function HotEvaluation() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    module: "",
    entreprise: "",
    lieu: "",
    status: "",
  });

  const [options, setOptions] = useState({
    modules: [],
    entreprises: [],
    lieux: [],
  });

  const [search, setSearch] = useState("");
  const loadMoreRef = useRef(null);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data } = await axios.get("/cfp/evaluation/filters");
      setOptions({
        modules: data.modules || [],
        entreprises: data.entreprises || [],
        lieux: data.lieux || [],
      });
    } catch (err) {
      console.error("Erreur lors du chargement des options :", err);
    }
  }, []);

  const fetchProjects = useCallback(
    async (pageNumber = 1, reset = false) => {
      try {
        if (pageNumber === 1 && !reset) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        const params = new URLSearchParams({
          per_page: 15,
          page: pageNumber,
          status: filters.status || "",
          module: filters.module || "",
          entreprise: filters.entreprise || "",
          lieu: filters.lieu || "",
          search: search || "",
        });

        const { data } = await axios.get(`/cfp/evaluation/projets?${params}`);

        setProjects((prev) =>
          reset || pageNumber === 1 ? data.data : [...prev, ...data.data]
        );
        setPage(data.current_page);
        setLastPage(data.last_page);
      } catch (err) {
        console.error("Erreur lors du chargement des projets :", err);
        setError("Impossible de charger les projets pour le moment.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, search]
  );

  useEffect(() => {
    fetchProjects(1, true);
    fetchFilterOptions();
  }, [fetchProjects, fetchFilterOptions]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProjects(1, true);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters, search, fetchProjects]);

  /** Infinite scroll */
  useEffect(() => {
    if (!loadMoreRef.current || page >= lastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchProjects(page + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchProjects, loadingMore, page, lastPage]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // 🔹 Grouper les projets par mois et année (en français)
  const groupedProjects = projects.reduce((acc, project) => {
    const date = new Date(project.begin_date);
    const monthYear = format(date, "MMMM yyyy", { locale: fr }); // Ex: "Octobre 2025"

    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(project);

    return acc;
  }, {});

  return (
    <div className="space-y-2">
      <div className="sticky top-0 z-10 shadow-sm bg-white p-2 flex flex-wrap justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Évaluation à chaud
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-52 focus:outline-none "
          />

          {/* Bouton Filtrer */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Filter className="w-4 h-4" />
              Filtrer
            </button>

            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg p-4 z-20 space-y-3"
              >
                <div>
                  <label className="text-sm text-gray-600">Module</label>
                  <select
                    value={filters.module}
                    onChange={(e) =>
                      handleFilterChange("module", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Tous</option>
                    {options.modules.map((m) => (
                      <option key={m.id} value={m.nom}>
                        {m.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Entreprise</label>
                  <select
                    value={filters.entreprise}
                    onChange={(e) =>
                      handleFilterChange("entreprise", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Toutes</option>
                    {options.entreprises.map((e) => (
                      <option key={e.id} value={e.nom}>
                        {e.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Lieu</label>
                  <select
                    value={filters.lieu}
                    onChange={(e) => handleFilterChange("lieu", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Tous</option>
                    {options.lieux.map((l) => (
                      <option key={l.id} value={l.nom}>
                        {l.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Tous</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En cours">Non terminé</option>
                  </select>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="">
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
            <button
              onClick={() => fetchProjects(1, true)}
              className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl h-40 w-full shadow-sm"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            Aucun projet trouvé pour ces critères.
          </p>
        ) : (
          <>
            {Object.keys(groupedProjects).map((monthYear) => (
              <div key={monthYear} className="mb-6">
                <h3 className="w-full flex items-center gap-3 p-4 mb-3 text-2xl font-semibold bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
                  {monthYear}
                </h3>
                <AnimatePresence>
                  <div className=" border-y px-6 py-3">
                    {groupedProjects[monthYear].map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        layout
                        transition={{ duration: 0.3 }}
                      >
                        <ProjectListItem project={project} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            ))}

            <div
              ref={loadMoreRef}
              className="h-10 flex justify-center items-center"
            >
              {loadingMore && <LoadingSpinner />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HotEvaluation;
