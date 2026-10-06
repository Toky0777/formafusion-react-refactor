import React, { useState } from "react";
import { Search, Pen, X } from "lucide-react";
import { Button } from "../ui/button";

export const AgencyList = ({ agencies = [], onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgencies = agencies.filter((agency) => {
    const ville = agency.ville?.toLowerCase() || "";
    const postal = agency.viCodePostal || "";
    const villeCoded = agency.villeNameCoded?.toLowerCase() || "";

    return (
      ville.includes(searchTerm.toLowerCase()) ||
      postal.includes(searchTerm) ||
      villeCoded.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section className="flex flex-col m-4">
      <div className="w-full border border-gray-100 bg-white rounded-xl">
        <div className="flex items-center justify-between w-full p-4">
          <h3 className="text-lg font-medium text-gray-600">Agency List</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="search"
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
            />
          </div>
        </div>
        <hr className="border border-gray-300 my-2" />

        {filteredAgencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Postal Code
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    City
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    Location
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAgencies.map((agency) => (
                  <tr
                    key={agency.id}
                    className="group hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="p-4 text-sm text-gray-700">
                      {agency.viCodePostal || "--"}
                    </td>
                    <td className="p-4 text-sm text-gray-700 capitalize">
                      {agency.ville || "--"}
                    </td>
                    <td className="p-4 text-sm text-gray-700 capitalize">
                      {agency.villeNameCoded || "--"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Pen}
                          onClick={() => onEdit(agency)}
                          title="Edit this agency"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={X}
                          onClick={() => onDelete(agency.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete this agency"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No agencies found</div>
        )}
      </div>
    </section>
  );
};
