import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { useAuth } from '../../../../../context/AuthContext';



const EditInfoBaseProjet = ({ modules, modalites, initialData, setShowEditInfoProjet }) => {
    const [refValue, setRefValue] = useState(initialData.project_reference || '');
    const [titre, setTitre] = useState(initialData.project_title || '');
    const [nbPlace, setNbPlace] = useState(initialData.nbPlace || '');
    const [description, setDescription] = useState(initialData.project_description || '');
    const [dateDebut, setDateDebut] = useState(initialData.dateDebut ? new Date(initialData.dateDebut).toISOString().split('T')[0] : '');
    const [dateFin, setDateFin] = useState(initialData.dateFin ? new Date(initialData.dateFin).toISOString().split('T')[0] : '');
    const [modalite, setModalite] = useState(initialData.idModalite || '');
    const [module, setModule] = useState(initialData.idModule || '');

    // Add a new state for loading
    const [isLoading, setIsLoading] = useState(false);

    const auth = useAuth();


    useEffect(() => {
        setRefValue(initialData.project_reference || '');
        setTitre(initialData.project_title || '');
        setNbPlace(initialData.nbPlace || '');
        setDescription(initialData.project_description || '');
        setDateDebut(initialData.dateDebut ? new Date(initialData.dateDebut).toISOString().split('T')[0] : '');
        setDateFin(initialData.dateFin ? new Date(initialData.dateFin).toISOString().split('T')[0] : '');
        setModalite(initialData.idModalite || '');
        setModule(initialData.idModule || '');
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!refValue || !titre || !description || !dateDebut || !dateFin || !modalite || !module) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Set loading to true when submission starts
        setIsLoading(true);
        console.log(refValue, titre, description)
        try {
            await Promise.all([
                axios.patch(`${process.env.REACT_APP_API_URL}/cfp/projets/${initialData.idProjet}/updateProjet`, {
                    project_reference: refValue,
                    project_title: titre,
                    project_description: description
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`,
                    }
                }),
                axios.patch(`${process.env.REACT_APP_API_URL}/cfp/projets/${initialData.idProjet}/update/module`, {
                    idModule: module,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`,
                    }
                }),
                axios.patch(`${process.env.REACT_APP_API_URL}/cfp/projets/${initialData.idProjet}/update/modalite`, {
                    idModalite: modalite,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`,
                    }
                })
            ]);

            toast.success('Projet mis à jour avec succès');
            setShowEditInfoProjet(false);

        } catch (err) {
            console.error("Error updating project:", err);
            toast.error('Erreur lors de la mise à jour du projet.');
        } finally {
            // Set loading to false regardless of success or failure
            setIsLoading(false);
        }
    };


    return (
        <>
            <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowEditInfoProjet(false)}
            />
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 z-50 w-full h-full bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-2/5"
            >
                <div className="w-full h-full overflow-y-auto ">
                    <div className="flex flex-col w-full">
                        <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                            <p className="text-lg font-medium text-gray-500">Modifier les informations générales</p>
                            <button
                                onClick={() => setShowEditInfoProjet(false)}
                                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
                                aria-label="Fermer"
                            >
                                <i className="text-gray-500 fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4 min-w-[400px] overflow-x-scroll overflow-y-auto">

                                <div>
                                    <label htmlFor="refValue" className="block text-left">Référence du projet</label>
                                    <input
                                        type="text"
                                        id="refValue"
                                        value={refValue}
                                        onChange={e => setRefValue(e.target.value)}
                                        className="w-full p-1 text-gray-700 bg-white border rounded"
                                        disabled={isLoading} // Disable input while loading
                                    />
                                </div>

                                <div>
                                    <label htmlFor="titre" className="block text-left">Titre du projet</label>
                                    <input
                                        type="text"
                                        id="titre"
                                        value={titre}
                                        onChange={e => setTitre(e.target.value)}
                                        className="w-full p-1 text-gray-700 bg-white border rounded"
                                        disabled={isLoading} // Disable input while loading
                                    />
                                </div>

                                {initialData.project_type === 'Inter' && (
                                    <div>
                                        <label htmlFor="nbPlace" className="block text-left">Nombre de place</label>
                                        <input
                                            type="number"
                                            id="nbPlace"
                                            value={nbPlace}
                                            onChange={e => setNbPlace(e.target.value)}
                                            className="w-full p-1 text-gray-700 bg-white border rounded"
                                            disabled={isLoading} // Disable input while loading
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="description" className="block text-left">Description</label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full p-1 text-gray-700 bg-white border rounded"
                                        disabled={isLoading} // Disable input while loading
                                    />
                                </div>

                                <div>
                                    <label htmlFor="module" className="block text-left">Choisir la formation</label>
                                    <select
                                        id="module"
                                        value={module}
                                        onChange={e => setModule(e.target.value)}
                                        className="w-full p-1 text-gray-700 bg-white border rounded"
                                        disabled={isLoading} // Disable input while loading
                                    >
                                        <option value="">Sélectionner</option>
                                        {modules.map(m => (
                                            <option key={m.idModule} value={m.idModule}>{m.module_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label htmlFor="dateDebut" className="block">Début</label>
                                        <input
                                            type="date"
                                            id="dateDebut"
                                            value={dateDebut}
                                            onChange={e => setDateDebut(e.target.value)}
                                            className="w-full p-1 text-gray-700 bg-gray-100 border rounded"
                                            disabled={isLoading} // Disable input while loading
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dateFin" className="block">Échéance</label>
                                        <input
                                            type="date"
                                            id="dateFin"
                                            value={dateFin}
                                            onChange={e => setDateFin(e.target.value)}
                                            className="w-full p-1 text-gray-700 bg-gray-100 border rounded"
                                            disabled={isLoading} // Disable input while loading
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="modalite" className="block text-left">Modalité</label>
                                    <select
                                        id="modalite"
                                        value={modalite}
                                        onChange={e => setModalite(e.target.value)}
                                        className="w-full p-1 text-gray-700 bg-white border rounded"
                                        disabled={isLoading} // Disable input while loading
                                    >
                                        <option value="">Sélectionner</option>
                                        {modalites.map(m => (
                                            <option key={m.idModalite} value={m.idModalite}>{m.modalite}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="inline-flex justify-end gap-2 pt-3 mb-14">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditInfoProjet(false)}
                                        className="p-1 border shadow"
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center gap-2 p-1 text-white bg-purple-600" // Added flex for loader
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        {isLoading && (
                                            <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default EditInfoBaseProjet;