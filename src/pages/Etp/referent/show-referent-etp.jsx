import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { X, Loader2, Mail, Phone, User } from "lucide-react";
import { IMAGE_URL } from "../../../config/env";

export function ShowReferentEtp({ idReferent, isOpen, onClose }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idReferent || !isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`etp/referents/${idReferent}/show`);
        if (res.data.status === 200) {
          setEmployee(res.data.emp);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idReferent, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Fiche Employé</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin text-blue-600" size={30} />
            </div>
          ) : employee ? (
            <>
              {/* Photo */}
              <div className="relative w-32 h-32">
                <img
                  src={
                    employee.photoEmp
                      ? `${IMAGE_URL}/img/referents/${employee.photoEmp}`
                      : "https://via.placeholder.com/120x120.png?text=Photo"
                  }
                  alt={employee.name}
                  className="w-full h-full rounded-full object-cover border-4 border-blue-100 shadow-md"
                />
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full shadow-md">
                  <User size={16} />
                </div>
              </div>

              {/* Nom et fonction */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {employee.name} {employee.firstName}
                </h3>
                <p className="text-sm text-gray-500">{employee.fonction}</p>
              </div>

              {/* Info contact */}
              <div className="w-full grid grid-cols-1 gap-2 text-gray-700 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg shadow-sm">
                  <Mail size={16} /> {employee.mailEmp || "-"}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg shadow-sm">
                  <Phone size={16} /> {employee.phoneEmp || "-"}
                </div>
              </div>

              {/* Autres infos */}
              <div className="flex gap-4 mt-2">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                  Sexe: {employee.sexe || "-"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.isActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune donnée disponible
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}
