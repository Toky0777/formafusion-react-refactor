import { X, User, Mail, Phone, UserCheck, DollarSign } from 'lucide-react';
import { motion } from "framer-motion";
const SousTraitantVoir = ({ setShowModalVoir,  entreprise }) => {
  return (
    <>
      {/* Overlay sombre */}
           <motion.div
                className="fixed inset-0 backdrop-blur-sm z-40 bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModalVoir(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-2/5 bg-white shadow-lg p-6 z-50 transition-transform duration-300 overflow-y-auto"
            >    <div className="absolute top-2 right-2">
        <button onClick={()=>setShowModalVoir(false)} className="w-10 h-10 rounded-md hover:bg-gray-200 flex items-center justify-center">
          <X className="text-gray-500" />
        </button>
      </div>

      <div className="flex flex-col w-full px-6 py-4">
        {/* Header entreprise */}
        <div className="flex items-center gap-4">
          <div className="w-[116px] h-[77px] bg-white flex items-center justify-center p-1 rounded-xl shadow">
            <img
              src={entreprise?.image || 'https://via.placeholder.com/150'}
              alt={entreprise?.nom || 'Entreprise'}
              className="object-cover w-full h-auto rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-gray-700">{entreprise?.nom || 'Nom Entreprise'}</h3>
            <p className="text-base text-gray-500">Site web — {entreprise?.siteweb || '--'}</p>
          </div>
        </div>

        {/* Référent principal */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Référent principal</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
              <User />
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-gray-900 font-medium">{entreprise?.referent?.nom || 'Nom Référent'}</span>
              <span className="text-gray-500"><Mail className="inline mr-1" size={14} /> {entreprise?.referent?.email || '--'}</span>
              <span className="text-gray-500"><Phone className="inline mr-1" size={14} /> {entreprise?.referent?.telephone || '--'}</span>
            </div>
          </div>
        </div>

        {/* Autres référents */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Autres référents</h4>
          {/* Tu peux mapper ici sur entreprise.autresReferents */}
          <p className="text-sm text-gray-500">Aucun autre référent pour le moment.</p>
        </div>

        {/* Tables */}
        {[
          { id: 'preparation', title: 'En préparation' },
          { id: 'future', title: 'À venir' },
          { id: 'progress', title: 'En cours' },
          { id: 'finished', title: 'Terminé' },
          { id: 'fenced', title: 'Clôturé' },
        ].map(section => (
          <div key={section.id} className="mt-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500 border border-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2"></th>
                    <th className="px-3 py-2">Cours</th>
                    <th className="px-3 py-2">Ref</th>
                    <th className="px-3 py-2">Lieu</th>
                    <th className="px-3 py-2"><UserCheck size={14} /></th>
                    <th className="px-3 py-2">Montant (Ar)</th>
                    <th className="px-3 py-2"><DollarSign size={14} /></th>
                    <th className="px-3 py-2">Début - Fin</th>
                    <th className="px-3 py-2">Détail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                  </tr>
                  {/* Tu peux remplacer cette ligne par une map() sur les projets */}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
    </>
  );
};

export default SousTraitantVoir;
