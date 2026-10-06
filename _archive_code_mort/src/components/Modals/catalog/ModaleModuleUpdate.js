import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function stripHtml(html) {
    return html
        .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

export default function ModalModuleUpdate({ showModule, closeModule, content, idProgramme, id, onUpdateSuccess }) {

    const [loading, setLoading] = useState(false);

    const [moduleData, setModuleData] = useState({
        title: '',
        description: '',
    })

    // récupération des donnée pour la modification par idProgramme et id(idContent)
    useEffect(() => {
        setLoading(true);
        axios
            .get(`/cfp/module/programmes/${idProgramme}/content/${id}`)
            .then((res) => {
                console.log("API Response module:", res.data);
                if (res.data.status === 200) {
                    setModuleData({
                        title: res.data.program_content.title || '',
                        description: res.data.program_content.description || '',
                    });
                } else {
                    console.error("Contenu introuvable !");
                }
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération.");
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [showModule, content]);

    const handleChangeModule = (e) => {
        const { name, value } = e.target;
        setModuleData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    // modification 
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const htmlDescription = `<p>${moduleData.description}</p>`;

        axios.put(`/cfp/module/programmes/${idProgramme}/content/${id}`, {
            content_title: moduleData.title,
            content_description: htmlDescription,

        })
            .then((res) => {
                console.log("Update Response module:", res.data);
                if (res.data.status === 200) {
                    toast.success("Module modifier avec succès")
                    closeModule();
                    onUpdateSuccess(idProgramme, {
                        id: id,
                        title: moduleData.title,
                        description: htmlDescription
                    });
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false);
            })
    }


    if (!showModule) return null;
    console.log("Loading:", loading);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white shadow-2xl rounded-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-hidden" data-aos="fade-down" data-aos-delay="300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-[#5B345B] border-b">
                        <p className="text-lg font-bold text-white text-center">Modifier votre Module</p>
                        <button onClick={closeModule} className="p-2 hover:bg-slate-500 rounded-full transition">
                            <RxCross2 size={25} className="text-red-600 font-bold" />
                        </button>
                    </div>

                    {/* Formulaire */}
                    <form className="p-5 space-y-4 overflow-y-auto max-h-[80vh] custom-scroll" onSubmit={handleUpdate} >

                        {/* Titre */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Titre</label>
                            <input
                                type="text"
                                name="title"
                                value={moduleData.title}
                                onChange={handleChangeModule}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            />
                        </div>

                        {/* description */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>

                            <div className="rounded-lg border border-gray-300 overflow-hidden">
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b">
                                    <span className="text-sm font-medium text-gray-700">Normal</span>
                                    <div className="flex gap-2 text-sm text-gray-600">
                                        <button type="button" className="font-bold hover:text-black">B</button>
                                        <button type="button" className="italic hover:text-black">I</button>
                                        <button type="button" className="underline hover:text-black">U</button>
                                        <button type="button" className="hover:text-black">🔗</button>
                                        <button type="button" className="hover:text-black">•</button>
                                        <button type="button" className="hover:text-black">𝒙</button>
                                    </div>
                                </div>

                                <textarea
                                    name="description"
                                    rows={10}
                                    value={stripHtml(moduleData.description)}
                                    onChange={handleChangeModule}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 text-sm flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Chargement...</span>
                                    </>
                                ) : (
                                    'Modifier'
                                )}
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}