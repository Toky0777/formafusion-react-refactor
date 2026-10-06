import { MoreVertical } from "lucide-react";

const ProjectTable = () => {
  const trashItems = [
    {
      id: 1,
      formation: "Excel Analyse et gestion de données (Niveau III)",
      client: "ALOE",
      dateDebut: "14.07.24",
      dateFin: "31.07.24",
      type: "Intra",
      formateur: "--",
      apprenants: 0,
      prix: "0 Ar",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              #
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Formation
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Client
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Période
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Formateur
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
              Apprenants
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Prix
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trashItems.map((item) => (
            <tr
              key={item.id}
              className="transition-colors duration-200 hover:bg-gray-50"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                {item.id}
              </td>
              <td className="max-w-xs px-6 py-4 text-sm text-gray-900">
                <div className="line-clamp-2">{item.formation}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {item.client}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {item.dateDebut} - {item.dateFin}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {item.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {item.formateur}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-900 whitespace-nowrap">
                {item.apprenants}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                {item.prix}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <div className="relative inline-block text-left">
                  <button className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
