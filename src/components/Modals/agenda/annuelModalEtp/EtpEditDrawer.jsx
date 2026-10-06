import { useState, useEffect } from 'react';
import EtpParticipantAjouter from './EtpParticipantAjouter';
import EtpFormateurAjouter from './EtpFormateurAjouter';
import { motion } from "framer-motion";

const EtpEditDrawer = ({ type, id, setShowEditDrawerEtp, idEtp = null, idCfp_inter = null }) => {
  const [showEnterpriseSelect, setShowEnterpriseSelect] = useState(false);

  useEffect(() => {
    if (type === 'apprenants') {
      setShowEnterpriseSelect(true);
      if (idCfp_inter === null) {
        // getApprenantProjets(idEtp, id);
        // getApprenantAdded(id);
      } else {
        // getApprenantProjetInter(id);
        // getApprenantAddedInter(id);
      }
    } else if (type === 'formateurs') {
      // getAllForms(id);
      // getFormAdded(id);
    }
  }, [type, id, idEtp, idCfp_inter]);

  // const handleMainSearch = (e, targetId) => {
  //   console.log(`Searching for: ${e.target.value} in ${targetId}`);
  //   // Implement your search logic here
  // };

  // const handleNewAppr = () => {
  //   console.log("New Apprenant clicked");
  //   // Implement the logic for adding a new apprenant
  // };

  const renderContentByType = () => {
    switch (type) {
      case 'participant':
        return <EtpParticipantAjouter idProjet={id} />;

      case 'formateur':
        return <EtpFormateurAjouter idProjet={id} setShowEditDrawerEtp={setShowEditDrawerEtp} />;


     

      default:
        return <p>Type inconnu.</p>;
    }
  };
  const renderHeadByType = () => {
    switch (type) {
      case 'session':
        return (
          <h3 className='text-gray-600 font-bold'>Modification de Session </h3>
        );

      case 'formateur':
        return (
          <h3 className='text-gray-600 font-bold'>Ajout d'autre formateur </h3>
        );

      case 'participant':
        return (
          <h3 className='text-gray-600 font-bold'>Ajout d'autre apprenants </h3>
        );

      default:
        return null;
    }
  };
  return (
    <>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm z-40 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowEditDrawerEtp(false)}
      />

      {/* Panneau de formulaire */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 1 }}
        className="fixed right-0 top-0 h-full bg-white  w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] z-50 shadow-lg p-2"
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          {renderHeadByType()}
          <button onClick={() => setShowEditDrawerEtp(false)}>
            <i className="fa-solid fa-xmark text-gray-500"></i>
          </button>
        </div>
        {/* Contenu spécifique au type */}
        {renderContentByType()}

        <div className="w-full flex justify-start mt-1">

          <button onClick={() => setShowEditDrawerEtp(false)} className="btn btn-primary bg-purple-600 p-2">Fermer</button>
        </div>

      </motion.div>
    </>
  );
};

export default EtpEditDrawer;
