import { Users, GraduationCap, CalendarCheck, Image, Folder } from "lucide-react";

const Sidebar = ({ active, setActive }) => {
  const menuItems = [
    { name: "Employés", icon: <Users className="w-5 h-5" /> },
    { name: "Centre de formation", icon: <GraduationCap className="w-5 h-5" /> },
    { name: "Agenda", icon: <CalendarCheck className="w-5 h-5" /> },
    { name: "Dossier", icon: <Folder className="w-5 h-5" /> },
    { name: "Photo", icon: <Image className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name.toLowerCase())}
            className={`flex items-center justify-between w-full px-4 py-2 rounded-xl transition-all ${
              active === item.name.toLowerCase()
                ? "bg-gray-200 text-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 flex-nowrap">
              {item.icon}
              <span className="font-medium truncate">{item.name}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
