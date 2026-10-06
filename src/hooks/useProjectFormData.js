import { useProjectStatusData } from "./useProjectStatusData";

export const useProjectData = (status) =>
  useProjectStatusData("/projetsForm/list", status);
