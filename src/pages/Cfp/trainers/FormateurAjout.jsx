import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { LoaderCircle, Save, X } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import axios from "../../../config/axios";

function FormateurAjout({ setShowModalAjout, refreshData }) {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        form_name: '',
        form_firstname: '',
        form_email: '',
        form_phone: '',

    });


    const [errors, setErrors] = useState({
        form_name: '',
        form_firstname: '',
        form_email: '',
        form_phone: '',

    });

    const [loading, setLoading] = useState(false);


    const validateForm = () => {
        let tempErrors = {
            form_name: '',
            form_firstname: '',
            form_email: '',
            form_phone: '',

        };
        let isValid = true;

        if (!formData.form_name.trim()) {
            tempErrors.form_name = "Le nom est requis.";
            isValid = false;
        } else if (formData.form_name.length < 2) {
            tempErrors.form_name = "Le nom doit contenir au moins 2 caractères.";
            isValid = false;
        }

        if (!formData.form_firstname.trim()) {
            tempErrors.form_firstname = "Le prénom est requis.";
            isValid = false;
        } else if (formData.form_firstname.length < 2) {
            tempErrors.form_firstname = "Le prénom doit contenir au moins 2 caractères.";
            isValid = false;
        }

        if (!formData.form_phone || formData.form_phone.length < 10) {
            tempErrors.form_phone = "Le numéro de téléform_phone est invalide.";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        // console.log(formData);
        try {
            const { data } = await axios.post(`/cfp/formateurs`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (data?.success) {
                toast.success("Formateur ajouté avec succès");
                refreshData();
                setShowModalAjout(false);
            } else if (data?.error) {
                if (data.error.form_email && Array.isArray(data.error.form_email) && data.error.form_email.length > 0) {

                    const errorMessage = data.error.form_email[0];
                    toast.error(errorMessage);
                    console.error("Erreur de validation de l'email :", errorMessage);
                } else {

                    toast.error("Une erreur inattendue est survenue lors de l'ajout du formateur !");
                    console.warn("Erreur API non gérée :", data.error); // Pour le débogage
                }

                refreshData();
                setShowModalAjout(false);
            } else {
                // Handle cases where the backend might send a 200 OK without a 'success' key
                toast.error("une erreur est servenue lors de l'ajout de formateur!");
                setShowModalAjout(false);
            }
            setLoading(false);
        } catch (error) {
            const response = error.response;
            console.log(response);
            if (error.response?.status === 401) {
                navigate("/user");
            }
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            {/* Overlay sombre */}
            <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5}}
                onClick={() => setShowModalAjout(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.5}}
                className="fixed top-0 right-0 z-50 w-full h-full p-6 overflow-y-auto transition-transform duration-300 bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-2/5"
            > <div className="flex items-center justify-between p-2 mb-4 bg-gray-100">
                    <h2 className="text-xl font-bold"> {t('titreAjout')}</h2>
                    <button
                        onClick={() => setShowModalAjout(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 ">
                    {loading && (
                        <svg className="w-8 h-8 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                    )}
                    <div className="flex flex-col w-full gap-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col w-full gap-1">
                                <label htmlFor="name" className="text-slate-700">{t('labelNom')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="form_name"
                                    value={formData.form_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg input input-bordered"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="form_firstnnihena ame" className="text-slate-700">{t('labelPrenom')}</label>
                                <input
                                    type="text"
                                    id="form_firstname"
                                    name="form_firstname"
                                    value={formData.form_firstname}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg input input-bordered"
                                />
                                {errors.form_firstname && <p className="text-sm text-red-600">{errors.form_firstname}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="form_email" className="text-slate-700">Mail</label>
                            <input
                                type="email"
                                id="form_email"
                                name="form_email"
                                value={formData.form_email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg input input-bordered"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="form_phone" className="text-slate-700">Téléphone</label>
                            <input
                                type="tel"
                                id="form_phone"
                                name="form_phone"
                                value={formData.form_phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg input input-bordered"
                                maxLength="19"
                            />
                            {errors.form_phone && <p className="text-sm text-red-600">{errors.form_phone}</p>}
                        </div>
                        <div className="flex justify-end w-full gap-2">
                            <button
                                type="button"
                                onClick={() => setShowModalAjout(false)}
                                className="px-4 py-2 text-white transition-colors bg-gray-400 rounded-lg hover:text-gray-800"
                                disabled={loading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg transition-colors ${loading
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-purple-500 text-white hover:bg-blue-700"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        Enregistrement <LoaderCircle className="inline text-white animate-spin" />
                                    </>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Save size={18} className="mr-2" />{t(' EnrgesInfo')}
                                    </div>

                                )}
                            </button>
                        </div>
                    </div>


                </form>
            </motion.div>
        </>
    );
}

export default FormateurAjout;
