import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    BookOpen, MapPin, Folder, Info, Calendar, CalendarCheck, 
    FileText, Clock, DollarSign, CreditCard 
} from 'lucide-react';
import { FaEllipsisVertical, FaTriangleExclamation, FaEye } from 'react-icons/fa6';
import ProjectMenu from './ProjectMenu';
import ProjectBadges from './ProjectBadges';
import ProjectTeam from './ProjectTeam';
import ProjectStats from './ProjectStats';

const ProjectCard = ({ 
    projet, 
    notes, 
    showMenu, 
    onToggleMenu,
    onShowApprenants,
    onShowEntreprise,
    onShowFormateurs,
    onShowHeures,
    onShowDocument,
    onShowLieu,
    onAskSupression,
    onAskProgramation,
    onAskDuplication,
    onAskArchiver,
    onAskAnnuler,
    onAskReporter,
    onAskCloturer
}) => {
    const note = notes[projet.idProjet]?.noteGeneral || 0;
    const avis = notes[projet.idProjet]?.countNotationProjet || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full p-5 h-[450px] rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden"
        >
            {/* Badge sous-traité */}
            {projet?.idSubContractor && <SubContractorBadge />}
            
            <div className="grid grid-cols-6">
                <div className="col-span-5">
                    <ProjectHeader 
                        projet={projet}
                        note={note}
                        avis={avis}
                    />
                </div>
                
                <div className="relative mt-4 flex justify-end col-span-1">
                    <ProjectMenu
                        projet={projet}
                        showMenu={showMenu === projet.idProjet}
                        onToggleMenu={() => onToggleMenu(projet.idProjet)}
                        onShowDetail={() => {/* navigation */}}
                        onAskProgramation={onAskProgramation}
                        onAskSupression={onAskSupression}
                        onAskDuplication={onAskDuplication}
                        onAskArchiver={onAskArchiver}
                        onAskAnnuler={onAskAnnuler}
                        onAskReporter={onAskReporter}
                        onAskCloturer={onAskCloturer}
                    />
                </div>
            </div>

            <ProjectBadges projet={projet} />

            <div className="mt-4">
                <ProjectLocation 
                    projet={projet} 
                    onShowLieu={onShowLieu}
                />
                
                <ProjectDossier projet={projet} />
                
                <ProjectDescription projet={projet} />
            </div>

            <ProjectTeam
                projet={projet}
                onShowApprenants={onShowApprenants}
                onShowEntreprise={onShowEntreprise}
                onShowFormateurs={onShowFormateurs}
            />

            <ProjectStats
                projet={projet}
                onShowHeures={onShowHeures}
                onShowDocument={onShowDocument}
            />

            <ProjectDatesAndPayment projet={projet} />
        </motion.div>
    );
};

export default ProjectCard;