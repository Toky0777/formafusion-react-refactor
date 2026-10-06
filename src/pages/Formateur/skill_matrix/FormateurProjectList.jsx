import { useEffect, useState } from "react";
import Search from "../../../components/search/search";
import ProjectTable from "../../../components/skills/ProjectTable";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";
import { getAllProjectsFormateur } from "../../../services/skillService";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { File } from "lucide-react";
export default function FormateurProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, handleChange } = useSearch();

  useEffect(() => {
    setLoading(true);
    const fetchProjects = async () => {
      try {
        const res = await getAllProjectsFormateur();
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
    <div>
      <div className="flex justify-between  mb-10">
        <div></div>
        <div>
          <Search
            placeholder="Recherche entreprises"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-gray-100 rounded-full shadow-sm">
              <File size={40} />
            </div>
            <h1 className="text-xl font-medium">Aucun projet trouvé</h1>
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <ProjectTable
              searchTerm={searchTerm}
              projects={projects}
              pathSkills="/formateur/skill_matrix/projets"
            />
          </div>
        </div>
      )}
    </div>
  );
}
