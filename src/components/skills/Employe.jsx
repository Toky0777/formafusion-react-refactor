import { User } from "lucide-react";
import { IMAGE_URL } from "../../config/env";

export default function Employe({ emp }) {
  const imgUrl = IMAGE_URL + "/img/employes";

  return (
    <div className="flex items-center gap-4 p-2 max-w-full">
      {emp.emp_photo ? (
        <img
          className="w-16 h-16 rounded-full object-cover shadow"
          src={`${imgUrl}/${emp.emp_photo}`}
          alt={emp.emp_name}
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 text-lg truncate">
          {emp.emp_name}
        </p>
        <p className="text-sm text-gray-700 truncate">{emp.emp_firstname}</p>
        <p className="text-xs text-gray-500 font-medium truncate">
          {emp.etp_name}
        </p>
      </div>
    </div>
  );
}
