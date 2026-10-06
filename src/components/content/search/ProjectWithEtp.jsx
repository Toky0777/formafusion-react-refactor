import { useEffect, useState, useRef, useCallback } from "react";
import { Users } from "lucide-react";
import { CardProject } from "../../card/CardProject";
import { EmptyState } from "../../ui/EmptyState";
import { searchService } from "../../../services/searchService";
import { ErrorDisplay } from "../../ui/error-display";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="w-full p-4 h-[450px] rounded-2xl border border-slate-200 shadow-md bg-white animate-pulse">
    {/* Header */}
    <div className="flex justify-between mb-4">
      <div className="space-y-2 w-3/4">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-slate-200 rounded-full" />
          ))}
        </div>
      </div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg" />
    </div>

    {/* Badges */}
    <div className="flex gap-2 mb-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-6 w-16 bg-slate-200 rounded-full" />
      ))}
    </div>

    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
      <div className="h-3 bg-slate-200 rounded w-full" />
    </div>

    <div className="flex justify-between items-center mb-4">
      <div className="flex -space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 bg-slate-200 rounded-full ring-2 ring-white"
          />
        ))}
      </div>
      <div className="h-8 w-20 bg-slate-200 rounded-lg" />
    </div>

    <div className="flex justify-between items-center mb-4">
      <div className="w-8 h-8 bg-slate-200 rounded-full" />
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-3 w-12 bg-slate-200 rounded" />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-4 divide-x divide-slate-100 text-sm text-slate-600">
      <div className="col-span-2 space-y-2 pl-3">
        <div className="h-3 w-2/3 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
      </div>
      <div className="pl-3 space-y-2">
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="h-3 w-2/3 bg-slate-200 rounded" />
      </div>
      <div className="pl-3 space-y-2">
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="h-5 w-16 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

const ProjectWithEtp = ({ idEtp }) => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const loaderRef = useRef(null);
  const observer = useRef(null);

  const fetchProjects = useCallback(
    async (pageToLoad = 1) => {
      setLoading(true);
      setError(null);

      try {
        const response = await searchService.getProjectWithEtp(
          idEtp,
          pageToLoad
        );

        const newProjects = response.data.data || [];
        const pagination = response.data.pagination || {};

        setProjects((prev) =>
          pageToLoad === 1 ? newProjects : [...prev, ...newProjects]
        );
        setHasMore(pagination.has_more ?? false);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Erreur lors du chargement des projets.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [idEtp]
  );

  useEffect(() => {
    setProjects([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchProjects(1);
  }, [idEtp, fetchProjects]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        observer.current.disconnect();
        setPage((prev) => prev + 1);
      }
    });

    const current = loaderRef.current;
    if (current) observer.current.observe(current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchProjects(page);
  }, [page, fetchProjects]);

  if (error) {
    return (
      <ErrorDisplay
        title="Erreur de chargement"
        message={error}
        onRetry={() => fetchProjects(1)}
      />
    );
  }

  if (initialLoading) {
    return (
      <div className="grid grid-cols-3 3xl:grid-cols-5 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!loading && projects.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12 text-gray-400" />}
        title="Aucun projet trouvé"
        description="Il n'y a actuellement aucun projet correspondant à votre recherche."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 3xl:grid-cols-5 gap-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
          >
            <CardProject projet={project} />
          </motion.div>
        ))}
      </div>

      <div ref={loaderRef} className="flex justify-center mt-6">
        {loading && (
          <div className="grid grid-cols-3 3xl:grid-cols-5 gap-3 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {!hasMore && !loading && ""}
      </div>
    </>
  );
};

export default ProjectWithEtp;
