import axios from "../../../config/axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function ModalDeleteModule({ showDeleteModal, handleCloseDeleteModal, idProgramme, id, onDeleteSuccess }) {
 
    const [isLoggingOutGlobal, setIsLoggingOutGlobal] = useState(false);

    if (!showDeleteModal) return null;

    //API delete module
    const DeleteModule = async () => {
        setIsLoggingOutGlobal(true);
        try {
            const response = await axios.delete(`/cfp/module/programmes/${idProgramme}/content/${id}`)
            console.log(response)
            if (response.data.status === 200) {
                handleCloseDeleteModal()
                toast.success("Module supprimer avec succès");
                onDeleteSuccess(idProgramme, id)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)

        } finally {
            setIsLoggingOutGlobal(false);
        }
    }

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
                <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 animate-fade-in-up ">
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                        Confirmer la Suppression
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-6">
                        Êtes-vous sûr de vouloir supprimer ?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={handleCloseDeleteModal}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-[#8E548E] text-[#D0D8FD] px-6 py-2 rounded-lg text-sm font-semibold flex items-center justify-center"
                            onClick={() => DeleteModule(idProgramme, id)}
                            disabled={isLoggingOutGlobal}
                        >
                            {isLoggingOutGlobal ? (
                                <FaSpinner className="animate-spin w-5 h-5" />
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
