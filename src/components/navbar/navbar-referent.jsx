import { Plus } from "lucide-react";
import { useReferent } from "../../hooks/cfp/useReferent";

export default function NavbarReferent({ setOpen }) {
  const { isAdmin } = useReferent();
  return (
    <div className="w-full flex items-center justify-between   p-4 rounded-lg">
      <h1 className="text-xl font-semibold text-gray-800">Utilisateurs</h1>

      {isAdmin && (
        <button
          onClick={() => setOpen(true)}
          className=" inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          <Plus size={18} className="mr-2" />
          Nouveau
        </button>
      )}
    </div>
  );
}
