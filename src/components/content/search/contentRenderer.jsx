import Project from "./Project";
import Trainer from "./Trainer";
import Referent from "./Referent";
import Learner from "./Learner";
import ProjectByReference from "./ProjectByReference";
import ProjectByNeighborhood from "./ProjectByNeighborhood";
import ProjectByPlace from "./ProjectByPlace";
import ProjectByCity from "./ProjectByCity";
import ProjectWithEtp from "./ProjectWithEtp";
import Entreprise from "./Entreprise";
import ReferentCustomer from "./ReferentCustomer";
import Course from "./Course";
import Folder from "./Folder";
import { Invoice } from "./Invoice";
import { Quote } from "./Proforma";
import { PurchaseOrder } from "./PurchaseOrder";
import Particular from "./Particular";

export const ContentRenderer = ({
  activeTab,
  items = [],
  searchQuery,
  idEtp,
}) => {
  if (!activeTab) return null;
  const baseTabName = activeTab.split("-")[0];

  switch (baseTabName) {
    case "learner":
      return <Learner key={searchQuery} searchQuery={searchQuery} />;
    case "folder":
      return <Folder key={searchQuery} searchQuery={searchQuery} />;
    case "entreprise":
      return <Entreprise key={searchQuery} searchQuery={searchQuery} />;
    case "course":
      return <Course key={searchQuery} searchQuery={searchQuery} />;
    case "trainer":
      return <Trainer key={searchQuery} searchQuery={searchQuery} />;
    case "invoice":
      return <Invoice key={searchQuery} searchQuery={searchQuery} />;
    case "quote":
      return <Quote key={searchQuery} searchQuery={searchQuery} />;
    case "project":
      return <Project key={searchQuery} searchQuery={searchQuery} />;
    case "projectCity":
      return <ProjectByCity key={searchQuery} searchQuery={searchQuery} />;
    case "projectPlace":
      return <ProjectByPlace key={searchQuery} searchQuery={searchQuery} />;
    case "projectNeighborhood":
      return (
        <ProjectByNeighborhood key={searchQuery} searchQuery={searchQuery} />
      );
    case "project_with_client":
      return <ProjectWithEtp key={searchQuery} idEtp={idEtp} />;
    case "project_reference":
      return <ProjectByReference key={searchQuery} searchQuery={searchQuery} />;
    case "referent":
      return <Referent key={searchQuery} searchQuery={searchQuery} />;
    case "purchase_order":
      return <PurchaseOrder key={searchQuery} searchQuery={searchQuery} />;
    case "particulars":
      return <Particular key={searchQuery} searchQuery={searchQuery} />;
    case "referent_customer":
      return <ReferentCustomer key={searchQuery} searchQuery={searchQuery} />;
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
