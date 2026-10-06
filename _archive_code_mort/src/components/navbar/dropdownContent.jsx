import { Link } from "react-router-dom";

// Le composant reçoit la position pour se placer correctement
const DropdownContent = ({ chiffreDAffaireLinks, isNavLinkActive, position, closeDropdown, dropdownRef }) => {
    return (
        <div
            ref={dropdownRef}
            className="absolute z-50 w-48 py-2 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{ 
                top: position.top, 
                left: position.left,
                minWidth: '200px'
            }}
        >
            <div className="py-1">
                {chiffreDAffaireLinks.map((item) => (
                    <Link
                        key={item.name}
                        to={item.to}
                        className={`block px-4 py-2 text-sm ${isNavLinkActive(item.to)
                                ? "bg-[#87388C] text-white"
                                : "text-slate-700 hover:bg-gray-100"
                            }`}
                        onClick={closeDropdown}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DropdownContent;