import axios from "../../../config/axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

export default function ModaleDeleteCfp({ showDeleteCfp, closeModalDeleteCfp, idModule, onDeleteSuccess }) {
    const [isLoggingOutGlobal, setIsLoggingOutGlobal] = useState(false);
    const { ModuleComptes } = useStateContext();

    if (!showDeleteCfp) return null;

    // suppression définitivement
    const handleDeleteCfp = async () => {
        setIsLoggingOutGlobal(true)
        console.log("idModule:", idModule);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/cfp/modules/${idModule}/destroy`);

            if (response.data.status === 200) {
                toast.success("Suppression réussie");
                ModuleComptes();
                onDeleteSuccess(idModule);
                closeModalDeleteCfp();
            } else {
                toast.error(response.data.message);
                console.log("suppression impossible:", response.data.error)
            }

        } catch (error) {
            toast.error("Erreur lors de la suppression ");
        } finally {
            setIsLoggingOutGlobal(false)
        }
    };


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
            <div className="fixed top-0 left-0 w-full  bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4 h-[99vh]">
                <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl animate-fade-in-up ">
                    <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
                        Confirmer la Suppression
                    </h2>
                    <p className="mb-6 text-sm text-center text-gray-600">
                        Êtes-vous sûr de vouloir supprimer définitivement ?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={closeModalDeleteCfp}
                            className="px-4 py-2 text-sm font-medium text-gray-600 transition border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-[#8E548E] text-[#D0D8FD] px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-center"
                            onClick={handleDeleteCfp}
                            disabled={isLoggingOutGlobal}
                        >
                            {isLoggingOutGlobal ? (
                                <FaSpinner className="w-5 h-5 animate-spin" />
                            ) : (
                                "Oui, confirmer"
                            )}
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}
