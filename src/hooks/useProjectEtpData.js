import { useProjectStatusData } from "./useProjectStatusData";

export const useProjectData = (status) =>
  useProjectStatusData("/etp/projets/getProjetBystatus/status", status);
