import Search from "../../../components/search/search";
import ProjectTable from "../../../components/skills/ProjectTable";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";
import { getAllProjects } from "../../../services/skillService";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function ProjectListSkill() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const { searchTerm, handleChange } = useSearch();

  useEffect(() => {
    setLoading(true);
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();

        if (res.status === 200) {
          setProjects(res.projects);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="">
      <div className="flex justify-between  mb-10">
        <div></div>
        <div>
          <Search
            placeholder="Recherche entreprise"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : projects?.length === 0 ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-bold">Aucun projet</h1>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto  ">
            <ProjectTable
              searchTerm={searchTerm}
              projects={projects}
              pathSkills="/cfp/skill_matrix/projets"
            />
          </div>
        </div>
      )}
    </div>
  );
}
