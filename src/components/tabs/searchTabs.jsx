import { TabButton } from "./tabButton";
import { getTabIcon, getTabLabel } from "../../utils/searchUtils";

export const SearchTabs = ({ searchData, activeTab, onTabChange }) => {
  const renderTabs = () => {
    const tabs = [];

    Object.entries(searchData).forEach(([key, value]) => {
      if (key === "project_with_client") {
        value.forEach((project, index) => {
          const tabId = `${key}-${index}`;
          tabs.push(
            <TabButton
              key={tabId}
              id={tabId}
              label={project.label}
              icon={getTabIcon("project")}
              count={project.count}
              isActive={activeTab === tabId}
              onClick={() => onTabChange(tabId, project.idEtp)}
            />
          );
        });
      } else if (value.count > 0) {
        tabs.push(
          <TabButton
            key={key}
            id={key}
            label={getTabLabel(value.label)}
            icon={getTabIcon(value.label)}
            count={value.count}
            isActive={activeTab === key}
            onClick={() => onTabChange(key, value.label)}
          />
        );
      }
    });

    return tabs;
  };

  const tabs = renderTabs();

  return (
    <div className="sticky top-0 z-30 mb-8 bg-white border-b border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <div className="flex gap-2 px-4 py-4 min-w-max">
          {tabs.length > 0 ? (
            tabs
          ) : (
            <div className="text-gray-500 italic">Aucun résultat trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
};
