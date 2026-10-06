import { useEffect, useState } from "react";
import ProjectTable from "../../../components/skills/ProjectTable";
import { getAllProjectForApprenant } from "../../../services/skillService";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function ApprProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchProjects = async () => {
      try {
        const res = await getAllProjectForApprenant();
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
        <h1 className="text-2xl font-bold">Vos projets</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-bold">Aucun projet</h1>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <ProjectTable
            projects={projects}
            pathSkills="/particulier/skill_matrix/projets"
          />
        </div>
      )}
    </div>
  );
}
