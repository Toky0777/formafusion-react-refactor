import ProjectListBase from "./ProjectListBase";
import ProjectCard from "../card/projectForm-card";

const ProjectList = (props) => (
  <ProjectListBase ProjectCard={ProjectCard} {...props} />
);

export default ProjectList;
