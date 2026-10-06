import axios from '../../../config/axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";

export default function ModalDelete({ showDelete, handleCloseDelete, idLieu, onDeleteLieu, }) {

    const [loadinglieu, setLoadinglieu] = useState(false);

    //suppression lieu
    const handleDeleteLieu = async () => {
        setLoadinglieu(true);
        try {
            const response = await axios.delete(`/cfp/lieux_delete/${idLieu}`);
            console.log("id lieu supprimé : ", idLieu)

            if (response.data.status === 200) {
                setTimeout(() => {
                    handleCloseDelete();
                    setLoadinglieu(false);
                }, 1000);

                onDeleteLieu(idLieu);
                console.log(response.data.message)
            } else {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadinglieu(false)
        }
    }


    if (!showDelete) return null;

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
                        Voulez-vous vraiment supprimer ce lieu ?
                    </h2>

                    <div className="flex justify-center gap-6">

                        <button
                            onClick={handleDeleteLieu}
                            className="bg-red-600 text-[#D0D8FD] px-7 py-4 rounded-lg text-[15px]  flex items-center justify-center"
                        >
                            {loadinglieu ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                </>
                            ) : (
                                "oui"
                            )}

                        </button>

                        <button
                            onClick={handleCloseDelete}
                            className=" bg-slate-400 px-7 py-2 rounded-lg text-[15px]  text-white "
                        >
                            Annuler
                        </button>

                    </div>
                </div>
            </div>


        </>

    );
}