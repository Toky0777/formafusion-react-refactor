import { Book } from "lucide-react";

const CardCours = ({ cours }) => {
  return (
    <>
      <div className="bg-blue-500 flex items-center text-white gap-2 px-5 py-2 rounded">
        <Book className="h-5 w-5" />
        <h1 className="font-bold  text-lg">Cours</h1>
      </div>
      <div className="w-full bg-white rounded ">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-sm bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 ">
                Formation
              </th>
              <th scope="col" className="px-4 py-3">
                Nombre d'heures
              </th>
              <th scope="col" className="px-4 py-3">
                Notation
              </th>
            </tr>
          </thead>
          <tbody>
            {cours?.length !== 0 ? (
              cours?.map((item, index) => (
                <tr key={index} className="bg-white">
                  <td className="text-sm text-gray-800 border-t border-gray-200 ">
                    {item.modules}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-600 border-t border-gray-200">
                    {item.totalHeures} hrs
                  </td>
                  <td className="px-4 py-2 text-sm text-center border-t border-gray-200">
                    {item.notes}{" "}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500 ">
                  Aucune formation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CardCours;
