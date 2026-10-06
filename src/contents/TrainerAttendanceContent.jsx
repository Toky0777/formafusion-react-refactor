import { Outlet } from "react-router-dom";
import { TrainerNavbarAttendance } from "../components/navbar/navbar-attendance-trainer";
import { usePresence } from "../hooks/formateur/usePresence";
import { useSearch } from "../hooks/cfp/skill/useSearch";
import { useMemo, useState } from "react";
export function TrainerAttendanceContent() {
  const { data, loading, getAllData, showEmg } = usePresence();
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
      <TrainerNavbarAttendance
        onChange={handleChange}
        searchTerm={searchTerm}
        onFilterChange={setFilterStatus}
        activeFilter={filterStatus}
        totalARemplir={totalARemplir}
        totalComplete={totalComplete}
      />
      <div className="flex flex-col flex-grow px-4 space-y-2 mb-10">
        <Outlet context={{ loading, getAllData, showEmg, filteredProjects }} />
      </div>
    </div>
  );
}
