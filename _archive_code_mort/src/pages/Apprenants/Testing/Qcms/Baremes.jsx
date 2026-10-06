import { Link, useParams } from "react-router-dom"
import { NavBar } from "../../../components/Navbar/NavBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useStateContext } from "../../Context/ContextProvider"
import { LoadingScreen } from "../../../components/Body/LoadingScreen"
import { TablePaginator } from "../../../components/Body/TablePaginator"
import AlertMessage from "../../../components/Body/AlertMessage"
import { Edit3, Trash2, Plus, ArrowLeft, BarChart3, Save, X, AlertTriangle } from "lucide-react"

// Composant Modal de Confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 overflow-hidden transition-all transform bg-white shadow-2xl rounded-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    <p className="leading-relaxed text-slate-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 space-x-3 border-t bg-slate-50 border-slate-100">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 font-medium transition-all duration-200 border rounded-lg text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-all duration-200 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                                <span>Suppression...</span>
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Bareme() {
    const { id } = useParams()
    const { token, api_base_url } = useStateContext()
    const [isLoading, setIsLoading] = useState(false)
    const [bareme, setBareme] = useState([])
    const [niveaux, setNiveaux] = useState([])
    const [editingBareme, setEditingBareme] = useState(null)
    const [notification, setNotification] = useState({ type: '', message: '', show: false })
    const [formData, setFormData] = useState({
        idBareme: '',
        minPoints: '',
        maxPoints: '',
        niveau: ''
    })

    // États pour le modal de confirmation
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        baremeId: null,
        baremeData: null,
        isLoading: false
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const clearForm = () => {
        setFormData({
            idBareme: '',
            minPoints: '',
            maxPoints: '',
            niveau: ''
        });
        setEditingBareme(null);
    }

    // Fonction pour ouvrir le modal de confirmation
    const openDeleteModal = (baremeData) => {
        setDeleteModal({
            isOpen: true,
            baremeId: baremeData.idBareme,
            baremeData: baremeData,
            isLoading: false
        });
    }

    // Fonction pour fermer le modal de confirmation
    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            baremeId: null,
            baremeData: null,
            isLoading: false
        });
    }

    // Fonction de suppression confirmée
    const confirmDelete = async () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));
        
        try {
            const { data } = await axios.delete(`${api_base_url}qcm/qcm-bareme/delete/${deleteModal.baremeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setNotification({ type: 'success', message: data.message, show: true });
            setTimeout(() => {
                setNotification({ type: '', message: '', show: false });
            }, 2000);
            
            await BaremeRequest();
            closeDeleteModal();
        } catch (error) {
            setNotification({ type: 'error', message: error.message, show: true });
            setTimeout(() => {
                setNotification({ type: '', message: '', show: false });
            }, 2000);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const Actions = (baremeItem) => {
        const editBareme = async (e, baremeData) => {
            e.preventDefault();
            try {
                setFormData({
                    idBareme: baremeData.idBareme,
                    minPoints: baremeData.minPoints,
                    maxPoints: baremeData.maxPoints,
                    niveau: baremeData.id_niveau
                });
                setEditingBareme(baremeData.idBareme);
                
                document.getElementById('bareme-form').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
            } catch (error) {
                console.log(error)
            }
        }

        const handleDeleteClick = (e, baremeData) => {
            e.preventDefault();
            openDeleteModal(baremeData);
        };

        return (
            <div className="flex items-center justify-center space-x-2">
                <button 
                    onClick={(e) => editBareme(e, baremeItem)} 
                    className="group p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out"
                    title="Modifier"
                >
                    <Edit3 className="w-4 h-4" />
                </button>

                <button 
                    onClick={(e) => handleDeleteClick(e, baremeItem)}
                    className="group p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ease-in-out"
                    title="Supprimer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        )
    }

    const NiveauRequest = async () => {
        setIsLoading(true)
        await axios.get(`${api_base_url}qcm/bareme/create/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(({ data }) => {
            setNiveaux(data.niveaux)
            setIsLoading(false)
        }).catch((err) => {
            console.error(err?.message.data);
            setIsLoading(false)
        })
    }

    const BaremeRequest = async () => {
        setIsLoading(true)
        await axios.get(`${api_base_url}qcm/get/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        }).then(({ data }) => {
            const BaremeWithActions = data.QcmBareme.map((item, index) => ({
                ...item,
                id_niveau: item.niveau.niveau,
                actions: Actions(item)
            }));
            setBareme(BaremeWithActions)
            setIsLoading(false)
        }).catch((err) => {
            console.error(err);
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (editingBareme) {
                await axios.post(`${api_base_url}qcm/qcm-bareme/update/${formData.idBareme}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotification({ type: 'success', message: 'Modification du barème réussi! ', show: true })
            } else {
                await axios.post(`${api_base_url}qcm/qcm-bareme/store/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotification({ type: 'success', message: 'Ajout du barème réussi! ', show: true })
            }
            setTimeout(() => {
                setNotification({ type: '', message: '', show: false })
            }, 2000);
            await BaremeRequest();
            clearForm();
        } catch (error) {
            setNotification({ type: 'error', message: `Erreur lors de la soumission: ${error}`, show: true })
            setTimeout(() => {
                setNotification({ type: '', message: '', show: false })
            }, 2000);
            console.error('Erreur lors de la soumission:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        BaremeRequest();
        NiveauRequest();
    }, [])

    const columns = ["Points Minimum", 'Points Maximum', 'Niveau', 'Actions']
    const dataNames = ["minPoints", "maxPoints", 'id_niveau', 'actions']

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-gray-100">
            <NavBar />
            <AlertMessage type={notification.type} message={notification.message} visible={notification.show} />
            {isLoading && <LoadingScreen />}
            {/* Modal de Confirmation */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer ce barème ? Cette action est irréversible et supprimera définitivement les données associées.`}
                isLoading={deleteModal.isLoading}
            />

            {/* Header Section */}
            <div className="overflow-hidden bg-gradient-to-r from-purple-100 via-purple-600 to-purple-300">    
                <div className="py-16 text-center text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                    <div className="inline-flex items-center justify-center w-16 h-16 m-6 bg-white shadow-lg rounded-2xl shadow-blue-100/50">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="mb-4 text-4xl font-bold tracking-wide text-white">
                        Gestion des Barèmes
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-100">
                        Configurez vos seuils d'évaluation avec simplicité et précision
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-10">
                        <Link 
                            to={`/qcm/${id}/category-evaluations`} 
                            className="inline-flex items-center px-6 py-3 bg-white text-slate-700 font-medium rounded-xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 ease-out border border-slate-100"
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Critique par section
                        </Link>
                        <Link 
                            to="/qcm/index" 
                            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-medium rounded-xl shadow-lg shadow-slate-800/25 hover:shadow-xl hover:shadow-slate-800/30 hover:-translate-y-0.5 transition-all duration-300 ease-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Link>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl px-6 py-12 mx-auto mt-6">

                {/* Form Section */}
                <div id="bareme-form" className="mb-12">
                    <div className="overflow-hidden bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100">
                        <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-blue-50 border-slate-100">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800">
                                        {editingBareme ? 'Modifier le barème' : 'Nouveau barème'}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {editingBareme ? 'Ajustez les paramètres existants' : 'Définissez de nouveaux seuils d\'évaluation'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <input type="hidden" name="idBareme" value={formData.idBareme} />
                                
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700" htmlFor="minPoints">
                                            Points minimum
                                        </label>
                                        <input 
                                            className="w-full px-4 py-3 transition-all duration-200 ease-out border bg-slate-50 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white" 
                                            id="minPoints" 
                                            type="number" 
                                            name="minPoints" 
                                            value={formData.minPoints}
                                            onChange={handleInputChange}
                                            placeholder="Ex: 0"
                                            required 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700" htmlFor="maxPoints">
                                            Points maximum
                                        </label>
                                        <input 
                                            className="w-full px-4 py-3 transition-all duration-200 ease-out border bg-slate-50 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white" 
                                            id="maxPoints" 
                                            type="number" 
                                            name="maxPoints" 
                                            value={formData.maxPoints}
                                            onChange={handleInputChange}
                                            placeholder="Ex: 20"
                                            required 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700" htmlFor="niveau">
                                            Niveau d'évaluation
                                        </label>
                                        <div className="relative">
                                            <select 
                                                className="w-full px-4 py-3 transition-all duration-200 ease-out border appearance-none bg-slate-50 border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white" 
                                                id="niveau" 
                                                name="niveau"
                                                value={formData.niveau}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="" disabled>Sélectionner un niveau</option>
                                                {niveaux.map((niveau, index) => (
                                                    <option value={niveau.id} key={index}>
                                                        {niveau.niveau}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end pt-6 space-x-4 border-t border-slate-100">
                                    <button 
                                        type="button" 
                                        onClick={clearForm} 
                                        className="inline-flex items-center px-6 py-3 font-medium transition-all duration-200 ease-out border text-slate-600 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        {editingBareme ? 'Annuler' : 'Effacer'}
                                    </button>

                                    <button 
                                        type="submit" 
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        disabled={isLoading}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isLoading ? 'Traitement...' : (editingBareme ? 'Modifier' : 'Enregistrer')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div id="bareme-table">
                    <div className="overflow-hidden bg-white border shadow-xl rounded-3xl shadow-slate-200/50 border-slate-100">
                        <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-blue-50 border-slate-100">
                            <h3 className="flex items-center text-xl font-semibold text-slate-800">
                                <BarChart3 className="w-5 h-5 mr-3 text-blue-600" />
                                Barèmes configurés
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">Gérez vos seuils d'évaluation</p>
                        </div>
                        
                        <div className="p-8">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-16">
                                    <div className="w-8 h-8 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                                    <span className="ml-3 text-slate-600">Chargement...</span>
                                </div>
                            ) : (
                                <TablePaginator datas={bareme} dataNames={dataNames} columns={columns} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}