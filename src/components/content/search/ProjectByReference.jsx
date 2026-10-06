import ProjectSearchResults from "./ProjectSearchResults";

const ProjectByReference = (props) => (
  <ProjectSearchResults searchMethod="getProjectByReference" {...props} />
);

export default ProjectByReference;
