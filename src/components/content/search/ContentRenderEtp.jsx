import Referent from "./Referent";
import ProjectWithEtp from "./ProjectWithEtp";
import ProjectEtp from "./ProjectEtp";
import Cfp from "./Cfp";
import Employee from "./Employee";

export const ContentRendererEtp = ({
  activeTab,
  items = [],
  searchQuery,
  idCfp,
}) => {
  if (!activeTab) return null;
  const baseTabName = activeTab.split("-")[0];

  switch (baseTabName) {
    case "employee":
      return <Employee key={searchQuery} searchQuery={searchQuery} />;
    case "cfp":
      return <Cfp key={searchQuery} searchQuery={searchQuery} />;
    case "project":
      return <ProjectEtp key={searchQuery} searchQuery={searchQuery} />;
    case "project_with_client":
      return <ProjectWithEtp key={searchQuery} idEtp={idCfp} />;
    case "referent":
      return <Referent key={searchQuery} searchQuery={searchQuery} />;
    default:
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800">
                {item.title || item.name || `Item ${index + 1}`}
              </h3>
              {item.description && (
                <p className="mt-2 text-gray-600">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      );
  }
};
