// src/components/ent/employes/EmployeeDetailsPanel.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '../../../../components/drawer/learners/Drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faEnvelope,
  faPhone,
  faGraduationCap,
  faIdCard,
  faUser,
  faMapMarkerAlt,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

const EmployeeDetailsPanel = ({ employee, isOpen, onClose }) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const {
        nom = t('not_specified'),
        prenom = t('not_specified'),
        mail = t('not_specified'),
        email = t('not_specified'),
        telephone = t('not_specified'),
        img,
        photoUrl,
        fonction = t('not_specified'),
        etpName = t('not_specified'),
        matricule = t('not_specified'),
        ville = '',
        codePostal = '',
        lot = '',
        quartier = ''
    } = employee || {};

    // Priorité à img, puis photoUrl, puis placeholder
    const imageSource = img || photoUrl;
    const displayEmail = mail || email;

    // Réinitialiser l'état de l'image quand l'employé change
    useEffect(() => {
        if (employee) {
            setImageError(false);
            setImageLoading(true);
        }
    }, [employee]);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const hasAddress = ville || codePostal || lot || quartier;

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <div className="w-full text-center border-b border-gray-200">
                <h2 className="text-lg font-semibold text-purple-600 truncate">
                {`Profile de ${prenom} ${nom}`}
                </h2>
            </div>
            <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 shadow-lg mb-4 flex items-center justify-center overflow-hidden">
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                            <div className="animate-pulse bg-gray-200 w-20 h-20 rounded-full"></div>
                        </div>
                    )}
                    
                    {imageSource && !imageError ? (
                        <img
                            alt={`${prenom} ${nom}`}
                            className="w-full h-full object-cover"
                            src={imageSource}
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <FontAwesomeIcon 
                                icon={faUser} 
                                className="text-4xl text-purple-400" 
                            />
                            <span className="text-xs text-purple-600 mt-1 font-medium">
                                {prenom?.charAt(0)}{nom?.charAt(0)}
                            </span>
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-2">{prenom} {nom}</h3>
                <p className="text-sm text-gray-500 mt-1">{fonction}</p>
                
                {matricule && matricule !== t('not_specified') && (
                    <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full mt-2 font-medium">
                        #{matricule}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {/* Informations principales */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FontAwesomeIcon icon={faIdCard} className="text-purple-500" />
                        {'Informations personnelles'}
                    </h4>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faBuilding} className="text-gray-400 w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">{'Entreprise'}</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{etpName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{displayEmail}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{telephone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400 w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Fonction</p>
                                <p className="text-sm font-medium text-gray-900">{fonction}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adresse */}
                {hasAddress && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-500" />
                            {t('address')}
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                            {lot && (
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHome} className="text-gray-400 w-3 h-3" />
                                    <span className="text-gray-700">Lot: {lot}</span>
                                </div>
                            )}
                            {quartier && (
                                <p className="text-gray-700">Quartier: {quartier}</p>
                            )}
                            {ville && (
                                <p className="text-gray-700">Ville: {ville}</p>
                            )}
                            {codePostal && (
                                <p className="text-gray-700">Code Postal: {codePostal}</p>
                            )}
                        </div>
                    </div>
                )}

              
                {/* <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-700 mb-2">
                        {t('additional_info')}
                    </h4>
                    <p className="text-xs text-purple-600">
                        {t('employee_since')} 
                    </p>
                </div> */}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Fermer
                </button>
            </div>
        </Drawer>
    );
};

export default EmployeeDetailsPanel;