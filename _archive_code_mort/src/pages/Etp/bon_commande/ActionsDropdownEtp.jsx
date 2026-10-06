import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const ActionsDropdownETP = ({ onEdit, onDelete, item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        setIsOpen(false);
        onEdit(item);
    };

    const handleDelete = () => {
        setIsOpen(false);
        onDelete(item.idBC);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton du menu */}
            <button
                className="flex items-center justify-center w-8 h-8 text-gray-400 transition-all rounded-lg hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setIsOpen(!isOpen)}
                title="Actions"
            >
                <EllipsisVertical className="w-5 h-5" />
            </button>

            {/* Menu dropdown */}
            {isOpen && (
                <div className="absolute z-20 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg right-10 top-full">
                    <Link
                        to={`/cfp/bon-commande/view/${item.idBC}`}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                        <Eye className="w-4 h-4 mr-3" />
                        Voir
                    </Link>
                    <div className="my-1 border-t border-gray-100"></div>
                </div>
            )}
        </div>
    );
};

export default ActionsDropdownETP;