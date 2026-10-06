import { useState, useRef, useEffect } from 'react';
import axios from '../../../../config/axios';
import toastr from 'toastr';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AjoutApprBatch from './AjoutApprBatch';
import {
  faPlus,
  faPen,
  faTrash,
  faUsers,
  faSpinner,
  faUserPlus,
  faTimesCircle,
  faCheck,
  faBan,
} from '@fortawesome/free-solid-svg-icons';

function Batch() {
    const [batches, setBatches] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newBatchName, setNewBatchName] = useState('');
    const [showApprenantDrawer, setShowApprenantDrawer] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const MySwal = withReactContent(Swal);
    const editInputRef = useRef(null);
    const createInputRef = useRef(null);

    toastr.options = {
        positionClass: "toast-top-center",
        timeOut: 6000,
        progressBar: true,
    };

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/etp/batch/getAll');
            if (response.data && response.data.results) {
                setBatches(response.data.results);
            } else {
                toastr.error('Erreur lors du chargement des batches.');
            }
        } catch (error) {
            toastr.error('Erreur de connexion au serveur.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerId = async () => {
        try {
            const response = await axios.get('/etp/batch');
            if (response.data.status === 200) {
                setCustomerId(response.data.idCustomer);
            } else {
                toastr.error('Erreur lors de la récupération de l\'identifiant client.');
            }
        } catch (error) {
            toastr.error('Erreur de connexion au serveur.');
        }
    };

    useEffect(() => {
        fetchCustomerId();
        fetchBatches();
    }, []);

    useEffect(() => {
        // Focus sur le champ d'édition quand on passe en mode édition
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    useEffect(() => {
        // Focus sur le champ de création quand on passe en mode création
        if (isCreating && createInputRef.current) {
            createInputRef.current.focus();
        }
    }, [isCreating]);

    const startEditing = (batch) => {
        setEditingId(batch.id);
        setEditName(batch.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName('');
    };

    const startCreating = () => {
        setIsCreating(true);
        setNewBatchName('');
    };

    const cancelCreating = () => {
        setIsCreating(false);
        setNewBatchName('');
    };

    const handleEditSubmit = async (batchId) => {
        if (!editName.trim()) {
            toastr.error('Veuillez saisir un nom pour le batch.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await axios.put(`/etp/batch/update/${batchId}`, {
                name: editName,
                customer_id: customerId
            });

            toastr.success(response.data.message);
            setBatches(batches.map(batch =>
                batch.id === batchId ? { ...batch, name: editName } : batch
            ));
            setEditingId(null);
            setEditName('');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erreur lors de la modification du batch.';
            toastr.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateSubmit = async () => {
        if (!newBatchName.trim()) {
            toastr.error('Veuillez saisir un nom pour le batch.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await axios.post('/etp/batch/create', {
                name: newBatchName,
                customer_id: customerId
            });

            toastr.success(response.data.message);
            // Ajouter le nouveau batch à la liste
            const newBatch = {
                id: response.data.id || Date.now(), // Utiliser l'ID de la réponse ou un ID temporaire
                name: newBatchName,
                batchlearners_count: 0
            };

            setBatches([...batches, newBatch]);
            setIsCreating(false);
            setNewBatchName('');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Erreur lors de la création du batch.';
            toastr.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const closeApprenantDrawer = () => {
        setShowApprenantDrawer(false);
        setSelectedBatch(null);
        fetchBatches(); // Rafraîchit les données après la fermeture
    };

    const handleDeleteBatch = (id) => {
        MySwal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Vous ne pourrez pas revenir en arrière !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimez-le !',
            cancelButtonText: 'Annuler',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`/etp/batch/delete/${id}`);
                    toastr.success(response.data.message);
                    setBatches(batches.filter(batch => batch.id !== id));
                } catch (error) {
                    const errorMessage = error.response?.data?.error || 'Erreur lors de la suppression du batch.';
                    toastr.error(errorMessage);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-500">Gestion des Batches</h1>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr className="text-left text-gray-700 font-medium text-sm uppercase">
                                    <th className="px-6 py-4 w-12">#</th>
                                    <th className="px-6 py-4">Nom du Batch</th>
                                    <th className="px-6 py-4 text-center">Nombre d'employés</th>
                                    <th className="px-6 py-4 text-center w-56">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-purple-600 text-3xl mb-3" />
                                                <p>Chargement des batches...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {/* Ligne pour créer un nouveau batch */}
                                        {isCreating && (
                                            <tr className="bg-blue-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    <FontAwesomeIcon icon={faPlus} className="text-green-600" />
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800">
                                                    <div className="flex items-center">
                                                        <input
                                                            ref={createInputRef}
                                                            type="text"
                                                            value={newBatchName}
                                                            onChange={(e) => setNewBatchName(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Nom du nouveau batch"
                                                        />
                                                        <div className="flex ml-2">
                                                            <button
                                                                onClick={handleCreateSubmit}
                                                                disabled={submitting}
                                                                className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-full transition-colors duration-200 ml-1"
                                                                title="Créer le batch"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={cancelCreating}
                                                                disabled={submitting}
                                                                className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors duration-200 ml-1"
                                                                title="Annuler"
                                                            >
                                                                <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                                        <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                                        0
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            disabled
                                                            className="p-3 text-blue-300 rounded-full transition-colors duration-200"
                                                        >
                                                            <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="p-3 text-yellow-300 rounded-full transition-colors duration-200"
                                                        >
                                                            <FontAwesomeIcon icon={faPen} className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="p-3 text-red-300 rounded-full transition-colors duration-200"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}

                                        {/* Lignes des batches existants */}
                                        {batches.length > 0 ? (
                                            batches.map((batch, index) => (
                                                <tr key={batch.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                                        {editingId === batch.id ? (
                                                            <div className="flex items-center">
                                                                <input
                                                                    ref={editInputRef}
                                                                    type="text"
                                                                    value={editName}
                                                                    onChange={(e) => setEditName(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                                <div className="flex ml-2">
                                                                    <button
                                                                        onClick={() => handleEditSubmit(batch.id)}
                                                                        disabled={submitting}
                                                                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-full transition-colors duration-200 ml-1"
                                                                        title="Confirmer"
                                                                    >
                                                                        <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={cancelEditing}
                                                                        disabled={submitting}
                                                                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors duration-200 ml-1"
                                                                        title="Annuler"
                                                                    >
                                                                        <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            batch.name
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                                            {batch.batchlearners_count || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                type="button"
                                                                className="p-3 text-gray-600 hover:text-white hover:bg-gray-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                onClick={startCreating}
                                                                disabled={isCreating || editingId !== null}
                                                                title='Nouveau batche'
                                                            >
                                                                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                title="Gérer les apprenants"
                                                                onClick={() => { setSelectedBatch(batch); setShowApprenantDrawer(true); }}
                                                                disabled={editingId !== null || isCreating}
                                                                className="p-3 text-blue-600 hover:text-white hover:bg-blue-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                title="Modifier le batch"
                                                                onClick={() => startEditing(batch)}
                                                                disabled={editingId !== null || isCreating}
                                                                className="p-3 text-yellow-600 hover:text-white hover:bg-yellow-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <FontAwesomeIcon icon={faPen} className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                title="Supprimer le batch"
                                                                onClick={() => handleDeleteBatch(batch.id)}
                                                                disabled={editingId !== null || isCreating}
                                                                className="p-3 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : !isCreating && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <FontAwesomeIcon icon={faTimesCircle} className="text-gray-300 text-4xl mb-3" />
                                                        <p>Aucun batch créé pour le moment.</p>
                                                        <button
                                                            onClick={startCreating}
                                                            className="mt-4 text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                                                        >
                                                            Créer votre premier batch
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Drawer pour ajouter des apprenants */}
            {showApprenantDrawer && (
                <AjoutApprBatch
                    isOpen={showApprenantDrawer}
                    onClose={closeApprenantDrawer}
                    batch={selectedBatch}
                />
            )}
        </div>
    );
}

export default Batch;