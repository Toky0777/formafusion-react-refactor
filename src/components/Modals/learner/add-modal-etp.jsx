import { useState, useEffect, useContext } from "react";
import axios from "../../../config/axios";
import { ModalContext } from "../../../contexts/cfp/ModalContext";
import { useTranslation } from 'react-i18next';
import toastr from 'toastr';

function AddLearnerModalEtp() {
    const { isOpen, type, closeModal } = useContext(ModalContext);
    const [isVisible, setIsVisible] = useState(false);
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        emp_name: '',
        emp_firstname: '',
        emp_email: '',
        emp_phone: '',
        idEntreprise: '',
        emp_photo: null,
        matricule: ''
    });

    const [entreprises, setEntreprises] = useState([]);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setIsVisible(isOpen);
        if (isOpen) {
            setError(null);
            setFieldErrors({});
            // Réinitialiser les données du formulaire lorsque la modale s'ouvre
            setFormData({
                emp_name: '',
                emp_firstname: '',
                emp_email: '',
                emp_phone: '',
                idEntreprise: '',
                emp_photo: null,
                matricule: ''
            });
        }
    }, [isOpen]);

    useEffect(() => {
        // Charger la liste des entreprises uniquement si la modale est ouverte et de type 'addApprenant'
        if (isOpen && type === 'addApprenant') {
            const fetchEntreprises = async () => {
                setLoading(true);
                try {
                    // Endpoint suggéré pour charger les entreprises. Vérifiez le nom de l'endpoint sur votre backend.
                    const response = await axios.get('/etp/employes/add/getEtpType');
                    setEntreprises(response.data?.entreprises || []);
                } catch (error) {
                    if (error.response?.status === 404) {
                        setEntreprises([]);
                        setError(t('Aucune entreprise trouvée.'));
                    } else {
                        setError('Erreur lors du chargement des entreprises.');
                        console.error("Erreur de chargement des entreprises :", error);
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchEntreprises();
        }
    }, [isOpen, type]); // Le changement clé est ici : la dépendance 't' a été retirée.

    const handleChange = e => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
        setFieldErrors({ ...fieldErrors, [name]: null });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                formPayload.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('/etp/employes', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toastr.success(response.data.message);

            setTimeout(() => {
                window.location.reload();
            }, 3500);

            closeModal();
            setFormData({
                emp_name: '',
                emp_firstname: '',
                emp_email: '',
                emp_phone: '',
                idEntreprise: '',
                matricule: ''
            });

        } catch (error) {
            console.error(error);
            if (error.response) {
                toastr.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    toastr.options = {
        positionClass: "toast-top-center",
        timeOut: 6000,
        progressBar: true,
    };

    if (!isOpen || type !== 'addApprenant') return null;

    return (
        <div className={`backdrop-custom-blur backdrop-brightness-75 fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                className="absolute inset-0"
                onClick={closeModal}
            />
            <div
                className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ width: '42%', minWidth: '500px' }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 !shadow-sm">
                        <h1 className="text-lg font-medium text-gray-500">Ajouter un Apprenant</h1>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {error && (
                            <div className="p-4 mb-4 text-white bg-red-500 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {loading && (
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Entreprise */}
                            {/* <div className="flex flex-col gap-1">
                                <label htmlFor="idEntreprise" className="text-gray-600 text-base after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Company
                                </label>
                                {entreprises.length > 0 ? (
                                    <select
                                        name="idEntreprise"
                                        id="idEntreprise"
                                        value={formData.idEntreprise}
                                        onChange={handleChange}
                                        className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                        required
                                    >
                                        <option value="" disabled>-- Sélectionnez une entreprise --</option>
                                        {entreprises.map(etp => (
                                            <option key={etp.idEtp} value={etp.idEtp}>
                                                {etp.etp_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="w-full h-10 px-2 py-2 text-gray-400 bg-gray-100 border border-gray-200 rounded-md">
                                        Aucune entreprise disponible
                                    </div>
                                )}
                                {fieldErrors.idEntreprise && (
                                    <div className="mt-1 text-sm text-red-500">{fieldErrors.idEntreprise}</div>
                                )}
                            </div> */}

                            {/* Matricule */}
                            <div className="mb-4">
                                <label htmlFor="matricule">Matricule</label>
                                <input
                                    id="matricule"
                                    type="text"
                                    name="matricule"
                                    value={formData.matricule}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                />
                                {fieldErrors.matricule && (
                                    <div className="mt-1 text-sm text-red-500">{fieldErrors.matricule}</div>
                                )}
                            </div>

                            {/* Nom */}
                            <div className="mb-4">
                                <label htmlFor="emp_name">
                                    Nom<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="emp_name"
                                    name="emp_name"
                                    value={formData.emp_name}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                    required
                                />
                                {fieldErrors.emp_name && (
                                    <div className="mt-1 text-sm text-red-500">{fieldErrors.emp_name}</div>
                                )}
                            </div>

                            {/* Prénom */}
                            <div className="mb-4">
                                <label htmlFor="emp_firstname"> Prénom(s) </label>
                                <input
                                    type="text"
                                    id="emp_firstname"
                                    name="emp_firstname"
                                    value={formData.emp_firstname}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                    required
                                />
                                {fieldErrors.emp_firstname && (
                                    <div className="mt-1 text-sm text-red-500">{fieldErrors.emp_firstname}</div>
                                )}
                            </div>

                            {/* Téléphone et Email */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="emp_phone">Téléphone</label>
                                    <input
                                        type="text"
                                        id="emp_phone"
                                        name="emp_phone"
                                        value={formData.emp_phone}
                                        onChange={handleChange}
                                        className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                        required
                                    />
                                    {fieldErrors.emp_phone && (
                                        <div className="mt-1 text-sm text-red-500">{fieldErrors.emp_phone}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="emp_email"> Mail </label>
                                    <input
                                        type="email"
                                        id="emp_email"
                                        name="emp_email"
                                        value={formData.emp_email}
                                        onChange={handleChange}
                                        className="w-full h-10 pl-2 text-gray-400 duration-200 bg-transparent border border-gray-200 rounded-md outline-none hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                        required
                                    />
                                    {fieldErrors.emp_email && (
                                        <div className="mt-1 text-sm text-red-500">{fieldErrors.emp_email}</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Boutons */}
                            <div className="flex justify-end !space-x-4 pt-10">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="!px-3 !py-2 !ml-3 !text-base !text-gray-600 !transition !duration-200 !bg-gray-200 !rounded-md !cursor-pointer !focus:outline-none !hover:bg-gray-300/80"
                                    style={{ minWidth: '80px' }}
                                >
                                    Fermer
                                </button>
                                <button
                                    type="submit"
                                    className="!px-3 !py-2 !text-base !font-medium !text-white !transition !duration-200 !bg-purple-600 !rounded-md !cursor-pointer !hover:bg-purple-700 focus:!outline-none"
                                    disabled={loading}
                                    style={{ minWidth: '80px' }}
                                >
                                    {loading ? 'Ajout en cours...' : 'Ajouter'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddLearnerModalEtp;
