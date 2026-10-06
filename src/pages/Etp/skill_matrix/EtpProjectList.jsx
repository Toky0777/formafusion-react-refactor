import { useEffect, useState } from "react";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";
import { getAllProjectEntreprise } from "../../../services/skillService";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import ProjectTable from "../../../components/skills/ProjectTable";

export default function EtpProjectList() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const { searchTerm, handleChange } = useSearch();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await getAllProjectEntreprise();

        setProjects(res.projects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-center items-center mb-20">
        <h1 className="text-2xl font-semibold">Vos projets</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-bold">Aucun projet</h1>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <ProjectTable
            searchTerm={searchTerm}
            projects={projects}
            pathSkills="/etp/skill_matrix/projets"
          />
        </div>
      )}
    </div>
  );
}
