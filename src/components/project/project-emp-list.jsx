import ProjectListBase from "./ProjectListBase";
import ProjectCard from "../card/projectEmp-card";

const ProjectList = (props) => (
  <ProjectListBase ProjectCard={ProjectCard} {...props} />
);

export default ProjectList;
