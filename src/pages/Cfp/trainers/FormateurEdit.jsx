import { useState, useEffect } from "react";
import { X, Pen, Image, LoaderCircle, Save } from "lucide-react";
import axios from "../../../config/axios";
import { useAuth } from "../../../contexts/AuthContext";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { IMAGE_URL } from "../../../config/env";

function FormateurEdit({ setShowModalEdit, formateur, refreshData }) {
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        email: '',

        image: null,
    });
    const { t } = useTranslation();
    const auth = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (formateur) {
            setFormData({
                name: formateur.form_name || '',
                firstname: formateur.form_firstname || '',
                email: formateur.form_email || '',

                image: null,
            });

            setImagePreview(`${IMAGE_URL}/img/formateurs/${formateur.form_photo}` || null);
        }
    }, [formateur]);

    const validateForm = () => {
        const tempErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            tempErrors.name = "Le nom est requis.";
            isValid = false;
        }

        if (!formData.firstname.trim()) {
            tempErrors.firstname = "Le prénom est requis.";
            isValid = false;
        }



        setErrors(tempErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // s'il y a une nouveau image
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitImage = async () => {
        if (!formData.image) return;

        setLoadingImage(true);

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
            });

        try {
            const base64Image = await toBase64(formData.image);

            const res = await axios.post(
                `/cfp/formateurs/${formateur.idFormateur}/photos`,
                {
                    image: base64Image,
                }
            );
            refreshData();
            setImagePreview(res.data.image_url);
            setLoadingImage(false)
            toast.success("Image mise à jour avec succès !");
            setShowModalEdit(false);
        } catch (err) {
            console.error("Erreur d'envoi d'image :", err);
            toast.error("Erreur lors de l’envoi de l’image.");
        } finally {
            setLoadingImage(false);
        }
    };


    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoadingForm(true);
        try {
            const payload = {
                name: formData.name,
                firstname: formData.firstname,
                email: formData.email,

            };
            // console.log(payload);

            await axios.patch(`/cfp/formateurs/${formateur.idFormateur}`, payload);

            refreshData();
            setLoadingForm(false);
            toast.success("Informations mises à jour  avec succès!");
            setShowModalEdit(false);
        } catch (error) {
            // Si l’erreur vient de Laravel avec status 422
            // console.log(err)
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally { 
            setLoadingForm(false);
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
                onClick={() => setShowModalEdit(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 z-50 w-full h-full p-6 overflow-y-auto transition-transform duration-300 bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-2/5"
            > <div className="flex items-center justify-between p-2 mb-4 bg-gray-100">
                    <div className="flex items-center gap-1">
                        <Pen className="w-4 h-4 font-bold" />
                        <h2 className="text-xl font-bold"> Editer Formateur</h2>
                    </div>

                    <button onClick={() => setShowModalEdit(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {loadingForm && (
                    <svg className="w-8 h-8 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                )}

                <div className="grid grid-cols-9 gap-2">
                    {/* Partie gauche - Image */}
                    <div className="flex flex-col items-center col-span-3 gap-4">
                        <div className="relative">
                            {imagePreview ? (
                                <img src={imagePreview} alt="profile" className="object-cover w-32 h-32 border border-purple-600 rounded-full" />
                            ) : (
                                <div className="flex items-center justify-center w-32 h-32 bg-gray-200 border border-purple-600 rounded-full">
                                    <Image className="w-20 h-20 text-gray-400" />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        <button
                            onClick={handleSubmitImage}
                            disabled={loadingImage || !formData.image}
                            className={`mt-2 px-4 py-2 rounded-md text-white ${loadingImage ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
                        >

                            {loadingImage ? (
                                <>
                                    Enregistrement <LoaderCircle className="inline text-white animate-spin" />
                                </>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Pen className="w-4 h-4 font-bold" />
                                    Changer l'image
                                </div>

                            )}
                        </button>
                    </div>

                    {/* Partie droite - Formulaire Infos */}
                    <div className="col-span-6">
                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            <div>
                                <label className="text-slate-700">{t('labelNom')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 bg-white border rounded-lg"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="text-slate-700">{t('labelPrenom')}</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 bg-white border rounded-lg"
                                />
                                {errors.firstname && <p className="text-sm text-red-600">{errors.firstname}</p>}
                            </div>



                            <div>
                                <label className="text-slate-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 bg-white border rounded-lg"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModalEdit(false)}
                                    className="px-4 py-2 text-white bg-gray-400 rounded-lg"
                                    disabled={loadingForm}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loadingForm}
                                    className={`px-4 py-2 rounded-md text-white ${loadingForm ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                                >
                                    {loadingForm ? (
                                        <>
                                            Enregistrement <LoaderCircle className="inline text-white animate-spin" />
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <Save size={18} className="mr-2" />Enregistrer
                                        </div>

                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default FormateurEdit;
