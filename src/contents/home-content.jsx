import { Outlet } from "react-router-dom";
import { HomeNavBar } from "../components/navbar/navbar-attendace";
import { useCfpPresence } from "../hooks/cfp/useCfpPresence";
import { useState, useMemo } from "react";
import { useSearch } from "../hooks/cfp/skill/useSearch";

export function HomeContentAttendance() {
  const { getAllData, data, loading, showEmg } = useCfpPresence();
  const { searchTerm, handleChange } = useSearch();

  const [filterStatus, setFilterStatus] = useState("complete");

  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];

    let filtered = data.projects;

    if (filterStatus === "complete") {
      filtered = filtered.filter((p) => p.isCompleted === true);
    } else if (filterStatus === "a-remplir") {
      filtered = filtered.filter((p) => p.isCompleted === false);
    }

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();

      filtered = filtered.filter((project) => {
        const matchModule =
          project.module_name?.toLowerCase().includes(lowerSearch) || false;

        const matchEntreprise = Array.isArray(project.entreprises)
          ? project.entreprises.some((etp) =>
              etp.etp_name?.toLowerCase().includes(lowerSearch)
            )
          : false;

        return matchModule || matchEntreprise;
      });
    }

    return filtered;
  }, [data, filterStatus, searchTerm]);

  const totalComplete =
    data?.projects?.filter((p) => p.isCompleted)?.length || 0;
  const totalARemplir =
    data?.projects?.filter((p) => !p.isCompleted)?.length || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mb-10">
        <HomeNavBar
          onChange={handleChange}
          searchTerm={searchTerm}
          onFilterChange={setFilterStatus}
          activeFilter={filterStatus}
          totalARemplir={totalARemplir}
          totalComplete={totalComplete}
        />
      </div>

      <div className="flex flex-col flex-grow px-4 space-y-2">
        <Outlet
          context={{ getAllData, showEmg, data, filteredProjects, loading }}
        />
      </div>
    </div>
  );
}
