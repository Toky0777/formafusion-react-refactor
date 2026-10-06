import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export function ActionButton({ id, idApprenant, idSession }) {
  return (
    <Link
      to={`/cfp/prequal/qcm/${id}/apprenant/${idApprenant}/session/${idSession}/rapport`}
      className="inline-flex items-center px-3 py-2 space-x-2 text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
    >
      <FileText className="w-4 h-4" />
      <span className="text-sm font-medium">Rapport</span>
    </Link>
  );
}
