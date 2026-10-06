import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../../Context/ContextProvider";
import { NavBar } from "../../../components/Navbar/NavBar";
import { LoadingScreen } from "../../../components/Body/LoadingScreen";
import AlertMessage from "../../../components/Body/AlertMessage";

// Composant Modal de Suppression
const DeleteModal = ({ 
    isOpen, 
    onClose,
    onConfirm, 
    title = "Confirmer la suppression", 
    message = "Êtes-vous sûr de vouloir supprimer cette évaluation? Cette action est irréversible.",
    confirmText = "Supprimer",
    cancelText = "Annuler",
    isLoading = false 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                        <button 
                            onClick={onClose} 
                            className="p-1 transition-colors duration-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="px-6 py-6">
                    <p className="leading-relaxed text-slate-700">{message}</p>
                </div>
                <div className="px-6 py-4 border-t bg-slate-50 border-slate-200">
                    <div className="flex justify-end space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-2.5 font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                        <button 
                            type="button" 
                            onClick={onConfirm}
                            className="flex items-center px-6 py-2.5 font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Evaluation()
{
    const { id } = useParams();
    const { token, api_base_url } = useStateContext()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ evaluations, setEvaluations ] = useState([])
    const [ showEval, setShowEval ] = useState(false)
    const [ selectedEvaluation, setSelectedEvaluation ] = useState({id: null, name: '', evaluation: {}})
    const [ level, setLevel ] = useState([])
    const [ qcm, setQcm ] = useState({})
    const [ notification, setNotification ] = useState({type: '', message: '', show: false})
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)
    const [ selectedEvaluationForDelete, setSelectedEvaluationForDelete ] = useState(null)
    const [ isDeleting, setIsDeleting ] = useState(false)

    const DataRequest = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`${api_base_url}qcm/${id}/category-evaluations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEvaluations(data.groupedEvaluations)
            setLevel(data.niveaux)
            setQcm(data.qcm)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        DataRequest();
    }, [])

    const showEvaluationForm = (id, name) => {
        setSelectedEvaluation({ id, name });
        setShowEval(true);
    };
    
    const editEvaluationForm = (id, name, evaluation) => {
        setSelectedEvaluation({ id, name, evaluation });
        setShowEval(true);
    };

    const hideAddEvaluationForm = () => {
        setShowEval(false)
    } 

    const openDeleteModal = (evaluationId) => {
        setSelectedEvaluationForDelete(evaluationId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedEvaluationForDelete(null);
    };

    const handleDeleteEvaluation = async () => {
        if (!selectedEvaluationForDelete) return;

        setIsDeleting(true);
        try {
            const response = await axios.delete(`${api_base_url}qcm-evaluations/${selectedEvaluationForDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setNotification({type: 'success', message: 'Évaluation supprimée avec succès', show: true})
            setTimeout(() => {
                setNotification({type: '', message: '', show: false})
            }, 3000);
            DataRequest();
            closeDeleteModal();
        } catch (error) {
            setNotification({type: 'error', message: `Erreur: ${error.message}`, show: true})
            setTimeout(() => {
                setNotification({type: '', message: '', show: false})
            }, 3000);
        } finally {
            setIsDeleting(false);
        }
    }

    const AddEvaluationForm = ({ idCategorie, idQCM, evaluationName, hideAddEvaluationForm, level, evaluation }) => {
        const [formData, setFormData] = useState({
            idCategorie: idCategorie,
            idQCM: idQCM,
            min_percentage: evaluation?.min_percentage ?? "",
            max_percentage: evaluation?.max_percentage ?? "",
            id_niveau: evaluation?.id_niveau || "",
            description: evaluation?.description || "",
            recommendations: evaluation?.recommendations || "",
        });
        
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };
        
        const handleSubmit = async(e) => {
            e.preventDefault()
            try {
                if (evaluation) {
                    const response = await axios.put(`${api_base_url}qcm-evaluations/${evaluation.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setTimeout(() => {
                        setNotification({type: 'success', message: 'Évaluation modifiée avec succès', show: true})
                    }, 1000);
                } else {
                    const response = await axios.post(`${api_base_url}qcm-evaluations/store`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setTimeout(() => {
                        setNotification({type: 'success', message: 'Évaluation ajoutée avec succès', show: true})
                    }, 1000);
                }
                setTimeout(() => {
                    setNotification({type: '', message: '', show: false})
                }, 3000);
                DataRequest();
                hideAddEvaluationForm();
            } catch (error) {
                setNotification({type: 'error', message: error.message, show: true})
                setTimeout(() => {
                    setNotification({type: '', message: '', show: false})
                }, 3000);
            }
        }
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="w-full max-w-3xl overflow-hidden bg-white shadow-2xl rounded-2xl">
                    <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-blue-100 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800">
                                        {evaluation ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
                                    </h3>
                                    <p className="text-sm text-slate-600">{evaluationName}</p>
                                </div>
                            </div>
                            <button 
                                onClick={hideAddEvaluationForm} 
                                className="p-1 transition-colors duration-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <input type="hidden" name="idQCM" value={idQCM}/>
                        <input type="hidden" name="idCategorie" value={idCategorie}/>

                        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Pourcentage Minimum (%)
                                </label>
                                <input 
                                    type="number" 
                                    name="min_percentage" 
                                    min="0" 
                                    max="100" 
                                    className="w-full px-4 py-3 transition-all duration-200 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    onChange={handleInputChange} 
                                    value={formData.min_percentage} 
                                    placeholder="Ex: 0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-slate-700">
                                    Pourcentage Maximum (%)
                                </label>
                                <input 
                                    type="number" 
                                    name="max_percentage" 
                                    min="0" 
                                    max="100" 
                                    className="w-full px-4 py-3 transition-all duration-200 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                    onChange={handleInputChange} 
                                    value={formData.max_percentage} 
                                    placeholder="Ex: 100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Niveau d'évaluation
                            </label>
                            <select 
                                name="id_niveau" 
                                className="w-full px-4 py-3 transition-all duration-200 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                onChange={handleInputChange}
                                value={formData.id_niveau}
                                required
                            >
                                <option value="">Sélectionner un niveau</option>
                                {level.map((niveau) => (
                                    <option key={niveau.id} value={niveau.id}>
                                        {niveau.niveau}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea 
                                name="description" 
                                rows="3" 
                                className="w-full px-4 py-3 transition-all duration-200 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Description du niveau atteint..." 
                                required 
                                value={formData.description} 
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-slate-700">
                                Recommandations
                            </label>
                            <textarea 
                                name="recommendations" 
                                rows="3" 
                                className="w-full px-4 py-3 transition-all duration-200 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Recommandations pour amélioration..." 
                                required 
                                value={formData.recommendations} 
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex flex-col justify-end gap-4 pt-4 border-t sm:flex-row border-slate-200">
                            <button 
                                type="button" 
                                onClick={hideAddEvaluationForm} 
                                className="px-6 py-3 font-medium transition-all duration-200 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
                            >
                                ✕ Annuler
                            </button>
                            <button 
                                type="submit" 
                                className="px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 hover:shadow-xl"
                            >
                                💾 {evaluation ? 'Modifier' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <>
            <NavBar />
            <AlertMessage type={notification.type} message={notification.message} visible={notification.show}/>
            
            {isLoading ? <LoadingScreen /> : (
                <div className="min-h-screen bg-gradient-to-br from-gray-500 via-white to-gray-200">
                    {/* Header avec gradient */}
                    <div className="overflow-hidden bg-gradient-to-r from-purple-100 via-purple-600 to-purple-300">

                        <div className="overflow-hidden text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                            <div className="container px-4 py-12 mx-auto text-center">
                                {/* Icône centrale */}
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mt-10 mb-6 bg-white shadow-lg rounded-2xl">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                
                                <h1 className="mb-3 text-3xl font-bold md:text-4xl">Critique par section</h1>
                                <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
                                    Définissez les évaluations pour chaque catégorie de votre QCM avec précision
                                </p>
                                
                                {/* Bouton de retour */}
                                <div className="flex justify-center">
                                    <Link 
                                        to={`/qcm/bareme/create/${id}`} 
                                        className="px-6 py-3 font-medium text-white transition-all duration-200 shadow-lg bg-slate-800 rounded-xl hover:bg-slate-900 hover:shadow-xl"
                                    >
                                        ← Retour aux barèmes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container px-4 py-8 mx-auto max-w-7xl">
                        {/* Notification */}
                        {notification.show && (
                            <div className={`p-4 mb-6 border-l-4 rounded-xl shadow-lg ${
                                notification.type === 'success' 
                                    ? 'text-green-800 bg-green-50 border-green-500' 
                                    : 'text-red-800 bg-red-50 border-red-500'
                            }`} role="alert">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {notification.type === 'success' ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold">
                                            {notification.type === 'success' ? 'Succès!' : 'Erreur!'}
                                        </p>
                                        <p className="mt-1 text-sm">{notification.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sections d'évaluation */}
                        {evaluations.map((evaluation, index) => (
                            <div key={index} className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">
                                <div className="p-6 border-b md:p-8 border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-xl">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-semibold text-slate-800">{evaluation.category.nomCategorie}</h2>
                                                <p className="text-sm text-slate-600">Gérez les évaluations de cette catégorie</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => showEvaluationForm(evaluation.category.idCategorie, evaluation.category.nomCategorie)} 
                                            className="px-6 py-3 font-medium text-white transition-all duration-200 bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 hover:shadow-xl"
                                        >
                                            ➕ Ajouter une évaluation
                                        </button>
                                    </div>
                                </div>

                                {/* Tableau des évaluations */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                    Score (%)
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                    Niveau
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                    Description
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                    Recommandations
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-200">
                                            {evaluation.evaluations.map((evals) => (
                                                <tr key={evals.id} className="transition-colors duration-200 hover:bg-slate-50">
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                                                        {evals.min_percentage}% - {evals.max_percentage}%
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                                            {evals.niveau.niveau}
                                                        </span>
                                                    </td>
                                                    <td className="max-w-xs px-6 py-4 text-sm truncate text-slate-600">
                                                        {evals.description}
                                                    </td>
                                                    <td className="max-w-xs px-6 py-4 text-sm truncate text-slate-600">
                                                        {evals.recommendations}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                onClick={() => editEvaluationForm(evaluation.category.idCategorie, evaluation.category.nomCategorie, evals)}
                                                                className="p-2 text-blue-600 transition-colors duration-200 rounded-lg hover:text-blue-800 hover:bg-blue-50"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                onClick={() => openDeleteModal(evals.id)}
                                                                className="p-2 text-red-600 transition-colors duration-200 rounded-lg hover:text-red-800 hover:bg-red-50"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {evaluation.evaluations.length === 0 && (
                                        <div className="py-12 text-center">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            <p className="text-lg text-slate-500">Aucune évaluation configurée</p>
                                            <p className="text-sm text-slate-400">Créez votre première évaluation pour cette catégorie</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {evaluations.length === 0 && (
                            <div className="p-12 text-center bg-white shadow-xl rounded-2xl">
                                <svg className="w-16 h-16 mx-auto mb-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <h3 className="mb-2 text-xl font-semibold text-slate-800">Aucune catégorie trouvée</h3>
                                <p className="text-slate-600">Créez d'abord des catégories pour votre QCM</p>
                            </div>
                        )}
                    </div>

                    {/* Modal d'ajout/modification d'évaluation */}
                    {showEval && (
                        <AddEvaluationForm
                            idCategorie={selectedEvaluation.id}
                            evaluationName={selectedEvaluation.name}
                            evaluation={selectedEvaluation.evaluation ?? undefined}
                            hideAddEvaluationForm={() => setShowEval(false)}
                            level={level}
                            idQCM={qcm.idQCM}
                        />
                    )}

                    {/* Modal de suppression */}
                    <DeleteModal
                        isOpen={showDeleteModal}
                        onClose={closeDeleteModal}
                        onConfirm={handleDeleteEvaluation}
                        title="Confirmer la suppression"
                        message="Êtes-vous sûr de vouloir supprimer cette évaluation? Cette action est irréversible."
                        confirmText="Supprimer"
                        cancelText="Annuler"
                        isLoading={isDeleting}
                    />
                </div>
            )}
        </>
    )
}