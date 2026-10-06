import { useState } from 'react';
import { Mail, MapPin, Building2 } from 'lucide-react';
import SousTraitantVoir from './SousTraitantVoir';

const SousTraitantListe = ({ soustraitants, count, search }) => {
  const [showModalVoir, setShowModalVoir] = useState(false);
  const [selectedSousTraitant, setSelectedSousTraitant] = useState(null);


  // const handleVoir = (soutraitant) => {
  //   setSelectedSousTraitant(soutraitant);
  //   setShowModalVoir(true);
  // };

  const SoutraitantFiltered = soustraitants.filter(item =>
    item.sub_name.toLowerCase().includes(search.toLowerCase()) ||
    item.sub_email.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div className="container flex flex-col w-full gap-6 mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[72vh] overflow-y-auto pr-2 custom-scrollbar">
        {SoutraitantFiltered.length > 0 ? (
          SoutraitantFiltered.map((soutraitant, index) => (
            <div 
              key={index} 
              className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white shadow rounded-xl hover:shadow-xl group border border-gray-100"
            >
              <div className="flex-1 p-6">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center min-w-0 flex-1 mr-2">
                      <div className="relative group w-24 h-24 flex-shrink-0">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                          <Building2 className="w-12 h-12 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-3 flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {soutraitant.sub_name}
                  </h3>
                </div>

                {/* Localisation */}
                <div className="flex items-center mb-3 text-gray-600">
                  <MapPin className="flex-shrink-0 w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {soutraitant.cfp_ville || "Aucune localisation"}
                  </span>
                </div>

                {/* Informations de contact */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="flex-shrink-0 w-4 h-4 mr-2" />
                    <p className="text-sm truncate">
                      {soutraitant.sub_email || "Aucun email"}
                    </p>
                  </div>
                  {/* <div className="flex items-center text-gray-600 transition-colors">
                    <Phone className="flex-shrink-0 w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {soutraitant.telephone || "Aucun numéro"}
                    </span>
                  </div> */}
                </div>


              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full py-12">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gray-100">
              <Building2 className="text-gray-400" size={40} />
            </div>
            <p className="text-xl font-semibold text-gray-600">Aucun résultat</p>
            {search && (
              <p className="mt-2 text-sm text-gray-500">
                Aucun sous-traitant ne correspond à "{search}"
              </p>
            )}
          </div>
        )}
      </div>
      
      {showModalVoir && (
        <SousTraitantVoir 
          setShowModalVoir={setShowModalVoir} 
          soutraitant={selectedSousTraitant}
        />
      )}
      
      {/* Style pour la scrollbar personnalisée */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default SousTraitantListe;