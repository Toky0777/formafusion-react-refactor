import { useEffect, useState } from 'react'
import {  toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoaderCircle, Save, X, Plus, Mail, CheckCircle } from 'lucide-react'
import { motion } from "framer-motion";
import axios from '../../../config/axios';
import { useNavigate } from 'react-router-dom';

function SoustraitantAjout({ setShowModalAjout, refreshData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [buttonAjoutActive, setButtonAjoutActive] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [invitationLoading, setInvitationLoading] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        name: '',
        nif: '',
        email: '',
    })
    const [errors, setErrors] = useState({
        firstname: '',
        name: '',
        nif: '',
        email: '',
    })

    // Notification de succès
    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    // Notification d'erreur
    const showErrorNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    const validateForm = () => {
        let tempErrors = {
            firstname: '',
            name: '',
            nif: '',
            email: '',
        }
        let isValid = true

        // Prénom optionnel, seulement validation si rempli
        if (formData.firstname && formData.firstname.length < 2) {
            tempErrors.firstname = 'Le prénom doit contenir au moins 2 caractères.'
            isValid = false
        }

        if (!formData.name.trim()) {
            tempErrors.name = 'Le nom est requis.'
            isValid = false
        } else if (formData.name.length < 2) {
            tempErrors.name = 'Le nom doit contenir au moins 2 caractères.'
            isValid = false
        }

        // NIF optionnel, seulement validation si rempli
        if (formData.nif && formData.nif.length < 2) {
            tempErrors.nif = 'Le nif doit contenir au moins 2 caractères.'
            isValid = false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            tempErrors.email = "L'email est requis";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "L'email n'est pas valide";
            isValid = false;
        }
        setErrors(tempErrors)
        return isValid
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSendInvitation = async (cfpData) => {
        setInvitationLoading(cfpData.cfp_id);
        try {
            const resultat = await axios.post(`/sub-contractors/send-invitations`, {
                firstname: cfpData.cfp_firstname,
                name: cfpData.cfp_name,
                nif: cfpData.cfp_nif,
                email: cfpData.cfp_email,
                cfp_id: cfpData.cfp_id
            });

            if (resultat.data.status === 200) {
                // D'abord rafraîchir les données
                await Promise.all([
                    fetchData(),
                    refreshData()
                ]);
                
                // Ensuite afficher la notification
                showSuccessNotification("✅ Invitation envoyée avec succès !");
                
            } else if (resultat.data.status === 400) {
                showErrorNotification("❌ Erreur lors de l'envoi de l'invitation : " + resultat.data.message);
            } else {
                showErrorNotification("❌ Une erreur est survenue lors de l'envoi de l'invitation !");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate("/login");
            } else {
                showErrorNotification("❌ Erreur lors de l'envoi de l'invitation");
            }
        } finally {
            setInvitationLoading(null);
        }
    }

    const handleCreateSubcontractor = async (e) => {
        e.preventDefault()
        console.log(formData);
        
        if (!validateForm()) return

        setLoading(true)
        try {
            const resultat = await axios.post(`/sub-contractors/create`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                }
            );

            if (resultat.data.status === 200) {
                showSuccessNotification(" Sous-traitant créé avec succès !");
                
                try {
                    // Rafraîchir les données locales
                    await fetchData();

                } catch (fetchError) {
                    console.error('Erreur lors du rafraîchissement des données:', fetchError);
                    // Continuer même si fetchData échoue
                }
                
                // Rafraîchir les données parentes
                refreshData();
                setShowModalAjout(false);
            } else if (resultat.data.status === 400) {
                showErrorNotification("❌ Erreur lors de la création : " + resultat.data.message);
            } else {
                showErrorNotification("❌ Une erreur est survenue lors de la création du sous-traitant !");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate("/login");
            } else {
                showErrorNotification("❌ Erreur lors de la création du sous-traitant");
            }
        } finally {
            setLoading(false);
        }
    }

    // Fonction pour générer une clé unique
    const generateUniqueKey = (item, index) => {
        if (item.cfp_id) {
            return `cfp-${item.cfp_id}-${index}`;
        }
        return `cfp-${index}`;
    }

    // Fonction pour déterminer le bouton en fonction du statut de collaboration
    const renderCollaborationButton = (item) => {
        if (item.isInCollaboration) {
            return (
                <button 
                    disabled
                    className="flex items-center gap-2 px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded-lg cursor-not-allowed"
                >
                    <CheckCircle size={16} />
                    En collaboration
                </button>
            );
        } else {
            return (
                <button 
                    onClick={() => handleSendInvitation(item)}
                    disabled={invitationLoading === item.cfp_id}
                    className={`flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg ${
                        invitationLoading === item.cfp_id 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {invitationLoading === item.cfp_id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <Mail size={16} />
                    )}
                    {invitationLoading === item.cfp_id ? 'Envoi...' : 'Invitation'}
                </button>
            );
        }
    }

    // Filtrer les données basées sur le terme de recherche
    const dataFiltre = Array.isArray(data) ? data.filter((item) => {
        return (
            item.cfp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cfp_email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }) : [];

    const fetchData = async() => {
        try {
            setDataLoading(true);
            const res = await axios.get('/sub-contractors/cfp');
          
            if (res.data && res.data.cfps && Array.isArray(res.data.cfps.cfp_items)) {
                setData(res.data.cfps.cfp_items);
            } else if (Array.isArray(res.data)) {
                setData(res.data);
            } else {
                console.error('Structure de données inattendue:', res.data);
                setData([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);  
            setData([]);
        } finally {
            setDataLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* Overlay sombre */}
            <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModalAjout(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 z-50 w-full h-full p-6 overflow-y-auto transition-transform duration-300 bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-2/5"
            >   
                {/* ToastContainer à l'intérieur du modal */}
  

                {/* Loading au milieu du modal */}
                {dataLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
                        <div className="flex flex-col items-center gap-3">
                            <LoaderCircle className="w-8 h-8 text-purple-500 animate-spin" />
                            <span className="text-gray-600">Chargement des données...</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between p-2 bg-gray-100">
                    <h2 className="text-xl font-bold">Ajouter SousTraitant</h2>
                    <button onClick={() => setShowModalAjout(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Barre de recherche et bouton Nouveau - CACHÉS quand formulaire actif */}
                {!buttonAjoutActive && (
                    <>
                        <h3 className='m-2 mb-4'>Chercher un sous-traitant</h3>
                        
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="searchTerm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg"
                                    placeholder="Rechercher un sous-traitant par nom ou email..."
                                />
                            </div>
                            <button
                                onClick={() => setButtonAjoutActive(true)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400 whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Nouveau
                            </button>
                        </div>
                    </>
                )}

                {/* Affichage des données - TOUJOURS visible sauf quand le formulaire est actif */}
                {!buttonAjoutActive && (
                    <>
                        {/* Message quand il n'y a pas de données */}
                        {data.length === 0 && !dataLoading && (
                            <div className="p-4 text-center">
                                <p className="text-gray-600">Aucun sous-traitant disponible</p>
                            </div>
                        )}

                        {data.length > 0 && (
                            <>
                                {/* Compteur de résultats */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        {searchTerm ? 
                                            `${dataFiltre.length} résultat(s) trouvé(s)` : 
                                            `${data.length} sous-traitant(s) disponible(s)`
                                        }
                                    </p>
                                </div>

                                {/* Liste des CFP */}
                                <ul className="w-full divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {(searchTerm ? dataFiltre : data).map((item, index) => (
                                        <li key={generateUniqueKey(item, index)}>
                                            <div className="flex items-center justify-between w-full p-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{item.cfp_name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{item.cfp_email}</p>
                                                    {item.isInCollaboration && (
                                                        <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                                            <CheckCircle size={12} className="mr-1" />
                                                            En collaboration
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                                    {renderCollaborationButton(item)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </>
                )}

                {/* Formulaire d'ajout affiché après clic sur "Nouveau" */}
                {buttonAjoutActive && (
                    <form onSubmit={handleCreateSubcontractor} className="flex flex-col mt-4 space-y-4">
                        {/* Loading pour l'enregistrement */}
                        {loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-80">
                                <div className="flex flex-col items-center gap-3">
                                    <LoaderCircle className="w-8 h-8 text-purple-500 animate-spin" />
                                    <span className="text-gray-600">Création en cours...</span>
                                </div>
                            </div>
                        )}

                        {/* Texte d'information modifié */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">* Champs obligatoires</span> - Nom et Email
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="firstname" className="text-slate-700">
                                        Prénom (Optionnel)
                                    </label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        className="px-3 py-2 bg-gray-200 border border-gray-200 rounded-lg"
                                        placeholder="Saisir le prénom du sous-traitant (optionnel)"
                                    />
                                    {errors.firstname && <p className="text-sm text-red-600">{errors.firstname}</p>}
                                </div>

                                <div className="flex flex-col w-full gap-1">
                                    <label htmlFor="name" className="text-slate-700">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="px-3 py-2 bg-gray-200 border border-gray-200 rounded-lg"
                                        placeholder="Saisir le nom du sous-traitant"
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="nif" className="text-slate-700">
                                        NIF (Optionnel)
                                    </label>
                                    <input
                                        type="number"
                                        id="nif"
                                        name="nif"
                                        value={formData.nif}
                                        onChange={handleInputChange}
                                        className="px-3 py-2 bg-gray-200 border border-gray-200 rounded-lg"
                                        placeholder="Saisir le NIF du sous-traitant (optionnel)"
                                    />
                                    {errors.nif && <p className="text-sm text-red-600">{errors.nif}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="text-slate-700">
                                    Mail *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="px-3 py-2 bg-gray-200 border border-gray-200 rounded-lg"
                                    placeholder="Saisir l'email du sous-traitant"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="flex justify-end w-full gap-2">
                                <button
                                    type="button"
                                    onClick={() => setButtonAjoutActive(false)}
                                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                                    disabled={loading}
                                >
                                    Retour
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg transition-colors ${loading
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-purple-500 text-white hover:bg-blue-700'
                                        }`}
                                    disabled={loading}
                                >
                                    <div className="flex items-center gap-1">
                                        <Save size={18} className="mr-2" />
                                        {loading ? 'Création...' : 'Créer'}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </motion.div>
        </>
    )
}

export default SoustraitantAjout