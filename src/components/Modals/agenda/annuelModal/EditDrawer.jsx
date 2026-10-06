import { useState, useEffect } from 'react';
import SessionModifCalendar from './SessionModifCalendar';
import ParticipantAjouter from './ParticipantAjouter';
import FormateurAjouter from './FormateurAjouter';
import { motion } from "framer-motion";

const EditDrawer = ({ type, id, setShowEditDrawer, idEtp = null, idCfp_inter = null, fetchEventsGroups }) => {
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



  const renderContentByType = () => {
    switch (type) {
      case 'participant':
        return <ParticipantAjouter idProjet={id} />;

      case 'formateur':
        return <FormateurAjouter idProjet={id} setShowEditDrawer={setShowEditDrawer} />;


      case 'session':
        return <SessionModifCalendar projectId={id} />;

      default:
        return <p>Type inconnu.</p>;
    }
  };
  const renderHeadByType = () => {
    switch (type) {
      case 'session':
        return (
          <h3 className='font-bold text-purple-600'>Modification de Session </h3>
        );

      case 'formateur':
        return (
          <h3 className='font-bold text-purple-600'>Ajout d'autre formateur </h3>
        );

      case 'participant':
        return (
          <h3 className='font-bold text-purple-600'>Ajout d'autre apprenants </h3>
        );

      default:
        return null;
    }
  };
  const quitDrawer = () => {
    setShowEditDrawer(false);
    fetchEventsGroups();
  }
  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => quitDrawer()}
      />

      {/* Panneau de formulaire */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 1 }}
        className="fixed right-0 top-0 h-full bg-white  w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] z-50 shadow-lg p-2"
      >
        <div className="flex items-center justify-between pb-2 mb-4">
          {renderHeadByType()}
          <button onClick={() => quitDrawer()}>
            <i className="text-gray-500 fa-solid fa-xmark hover:text-white hover:bg-red-600 "></i>
          </button>
        </div>

        {/* Contenu spécifique au type */}
        {renderContentByType()}

        <div className="flex justify-start w-full mt-1">

          <button onClick={() => setShowEditDrawer(false)} className="p-2 bg-purple-600 btn btn-primary">Fermer</button>
        </div>
      </motion.div>
    </>
  );
};

export default EditDrawer;
