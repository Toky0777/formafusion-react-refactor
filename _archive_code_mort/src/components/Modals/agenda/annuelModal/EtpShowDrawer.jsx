import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { FaPlus} from "react-icons/fa6";
import EtpParticipantDetail from './EtpParticipantDetail';
import EtpFormateurDetail from './EtpFormateurDetail';
import EtpSessions from './EtpSessions';
import EtpLieuProjet from './EtpLieuProjet';
import EtpFormationDetail from './EtpFormationDetail';
import EtpDossierDetail from './EtpDossierDetail';

const EtpShowDrawer = ({
    type,
    id,
    setEtpShowDrawer,
    setShowEditDrawerEtp,
    setEditType,
    setEditId,
    route,
    idProjet,
    EditDrawer
}) => {
    EditDrawer = (type, id) => {
        setEtpShowDrawer(false);
        setEditType(type);
        setEditId(id);
        setShowEditDrawerEtp(true);
    };

    const renderContentByType = () => {
        switch (type) {
            case 'participant':
                return (
                    <EtpParticipantDetail route={route}/>
                );

            case 'formateur':
                return (<EtpFormateurDetail idFormateur={route}/> );

            case 'session':
                return <EtpSessions route={route} />;
            case 'lieu':
                return <EtpLieuProjet route={route} />;
            case 'formation':
                return <EtpFormationDetail route={route} />;
            case 'dossier':
                return <EtpDossierDetail route={route} />;  
            default:
                return <p>Type inconnu.</p>;
        }
    };

    const renderHeadByType = () => {
        switch (type) {
            case 'session':
                return (
                    <button
                        onClick={() => EditDrawer("session", idProjet)}
                        className="border border-gray-600 text-gray-600 px-2 py-1 text-sm rounded hover:bg-gray-100"
                    >
                        <i className="fa-solid fa-pen text-gray-600"></i> Modifier
                    </button>
                );

            case 'formateur':
                return (
                    <button
                        onClick={() => EditDrawer("formateur", idProjet)}
                        className="border border-gray-600 text-gray-600 px-2 py-1 text-sm rounded hover:bg-gray-100"
                    >
                        <i className="fa-solid fa-pen"></i> Ajouter Formateur
                    </button>
                );

            case 'participant':
                return (
                    <button
                        onClick={() => EditDrawer("participant", idProjet)}
                        className="border flex items-center border-gray-600 text-gray-600 px-2 py-1 text-sm rounded hover:bg-gray-100"
                    >
                         <FaPlus /> Ajouter d'autre apprenant
                    </button>
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
                onClick={() => setEtpShowDrawer(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed right-0 top-0 h-full bg-white  w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] z-50 shadow-lg p-2"
            >
            {/* <div className="fixed inset-y-0 right-0 w-full sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] bg-white shadow-lg p-1 z-50 overflow-y-auto">
              */} 
               <div className="flex justify-end items-end  border-b p-2  gap-2">
                    {/* {renderHeadByType()} */}
                    <button onClick={() => setEtpShowDrawer(false)}>
                        <i className="fa-solid fa-xmark text-gray-500"></i>
                    </button>
                </div>

                {renderContentByType()}
          
             </motion.div>
        </>
    );
};

export default EtpShowDrawer;
