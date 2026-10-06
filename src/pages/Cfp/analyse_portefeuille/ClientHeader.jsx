import { User } from 'lucide-react';
import { IMAGE_URL } from "../../../config/env";

const ClientHeader = ({ client, logoImages }) => {
  const imgUrl = IMAGE_URL + "/img/entreprises";
  return (
    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-white text-sm font-bold shadow-md">
        {client.logo ? (
          <img 
            src={`${imgUrl}/${client.logo}`} 
            alt={client.name}
            className="w-full h-full object-contain rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
        )}
      </div>

     
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">{client.name}</div>
        <div className="text-xs text-gray-600 flex items-center gap-1 truncate">
          {client.location}
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;