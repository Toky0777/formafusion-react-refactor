import { useState, useEffect } from 'react'
import { X, Image } from "lucide-react";
import { motion } from "framer-motion";
import { IMAGE_URL } from "../../../config/env";
function FormateurVoir({ setShowModalVoir, formateur }) {
    const [formavoir, setFormaVoir] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (formateur) {
            setFormaVoir(formateur);
            setImagePreview(formateur.form_photo || null);
        }
    }, [formateur]);

    if (!formavoir) return null; // Sécurité pour éviter le rendu sans données

    return (
        <>
            {/* Overlay sombre */}
            <motion.div
                className="fixed inset-0 backdrop-blur-sm z-40 bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModalVoir(false)}
            />

            {/* Panneau de formulaire */}
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-2/5 bg-white shadow-lg p-6 z-50 transition-transform duration-300 overflow-y-auto"
            >    <div className="flex flex-col w-full">
                    {/* Header */}
                    <div className="w-full px-4 py-2 inline-flex items-center justify-between bg-gray-100">
                        <p className="text-lg text-gray-500 font-medium">À propos du formateur</p>
                        <button onClick={() => setShowModalVoir(false)} className="text-gray-500 hover:text-gray-700">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-2">
                        {/* Info */}
                        <div className="w-full flex flex-col p-3 relative">
                            <div className="w-full h-40 rounded-3xl p-4">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <div className="col-span-1 flex justify-center">
                                        <div className="w-32 h-32 rounded-full p-2 overflow-hidden bg-gray-100">
                                            {imagePreview ? (
                                                <img
                                                    src={`${IMAGE_URL}/img/formateurs/${imagePreview}`}
                                                    alt="Aperçu"
                                                    className="w-32 h-32 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Image className="w-20 h-20 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="ml-3 flex flex-col gap-y-2">
                                            <h3 className="text-2xl font-bold text-gray-700">{formavoir.form_name} {formavoir.form_firstname}</h3>
                                            <p className="text-base text-gray-500">{formavoir.titre}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coordonnées */}
                        <div className="w-full flex flex-col p-3 gap-y-6">
                            <div className="p-3 border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                                <div className="grid grid-cols-6">
                                    <div className="col-span-2">
                                        <h5 className="text-lg font-semibold text-gray-600">Email :</h5>
                                    </div>
                                    <div className="col-span-4 text-right">
                                        <p className="text-base text-gray-400">{formavoir.form_email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-6">
                                    <div className="col-span-2">
                                        <h5 className="text-lg font-semibold text-gray-600">Téléphone :</h5>
                                    </div>
                                    <div className="col-span-4 text-right">
                                        <p className="text-base text-gray-400">{formavoir.form_phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expériences & Formations */}
                            <div className="p-3 border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                                <div className="flex flex-col gap-y-1">
                                    <h5 className="text-lg font-semibold text-gray-600">Expériences</h5>
                                    <ul className="flex flex-col gap-y-1">
                                        {formavoir?.experiences?.length > 0 ? (
                                            formavoir.experiences.map((exp, index) => (
                                                <li key={index} className="text-sm text-gray-500">• {exp}</li>
                                            ))
                                        ) : (
                                            <li className="text-right text-gray-500 text-sm italic">Aucune expérience</li>
                                        )}
                                    </ul>

                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <h5 className="text-lg font-semibold text-gray-600">Formations</h5>
                                    <ul className="flex flex-col gap-y-1">
                                        {formavoir?.formations?.length > 0 ? (
                                            formavoir.formations.map((f, index) => (
                                                <li key={index} className="text-sm text-gray-500">• {f}</li>
                                            ))
                                        ) : (
                                            <li className="text-right text-gray-500 text-sm italic">Aucune formation</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Compétences & Langues */}
                            <div className="p-3 border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                                <div className="flex flex-col gap-y-1">
                                    <h5 className="text-lg font-semibold text-gray-600">Compétences</h5>
                                    <ul className="flex flex-col gap-y-1">
                                        {formavoir?.competences?.length > 0 ? (
                                            formavoir.competences.map((f, index) => (
                                                <li key={index} className="text-sm text-gray-500">• {f}</li>
                                            ))
                                        ) : (
                                            <li className="text-right text-gray-500 text-sm italic">Aucune competences</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-y-1">
                                    <h5 className="text-lg font-semibold text-gray-600">Langues</h5>
                                    <ul className="flex flex-col gap-y-1">
                                        {formavoir?.langues?.length > 0 ? (
                                            formavoir.langues.map((f, index) => (
                                                <li key={index} className="text-sm text-gray-500">• {f}</li>
                                            ))
                                        ) : (
                                            <li className="text-right text-gray-500 text-sm italic">Aucune langues</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export default FormateurVoir;
