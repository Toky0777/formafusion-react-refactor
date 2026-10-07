import axios from "../../../../config/axios";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";

import { toast, Toaster } from "react-hot-toast";
import { IMAGE_URL } from "../../../../config/env";




const EtpFormateurAjouter = ({ idProjet,setShowEditDrawer }) => {
    const [loading, setLoading] = useState(false);
    const [availableFormateurs, setavailableFormateurs] = useState([]);
    const [selectedFormateurs, setselectedFormateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [idEtp, setIdEtp] = useState(null);
    useEffect(() => {
     
        getselectedFormateurs(idProjet);
    }, [idProjet]);

    useEffect(() => {
       
            fetchavailableFormateurs();
     
    }, []);

   

    const fetchavailableFormateurs = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/etp/forms/`);
            setavailableFormateurs(data.forms || []);
        } catch (error) {
            console.warn("Erreur lors de la récupération des employés:", error);
        }
        setLoading(false);
    };

    const getselectedFormateurs = async (idProjet) => {
        try {
            const { data } = await axios.get(`/cfp/projets/${idProjet}/formateur`, );
            
            setselectedFormateurs(data.forms || []);
        } catch (error) {
            console.warn("Erreur lors de la récupération des formateurs ajoutés:", error);
        }
    };

    const manageFormateurs = async (type, idProjet, idFormateur) => {
        try {
            const response = await axios({
                method: type,
                url: `/etp/projets/${idProjet}/${idFormateur}/form/assign`,
            });
            const res = response.data;
           
                toast.success("opération effectué!", { duration: 1500 });
                getselectedFormateurs(idProjet);
              await  fetchavailableFormateurs();
            
        } catch (error) {
            console.warn("Erreur lors de la requête:", error);
            toast.error("Une erreur s'est produite");
        }
    };

    const filteredFormateurs = availableFormateurs.filter((form) => {
        const term = searchTerm.toLowerCase();
        return (
            (form.form_name && form.form_name.toLowerCase().includes(term)) ||
            (form.form_first_name && form.form_first_name.toLowerCase().includes(term))
        );
    });
   
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} toastOptions={{
                style: { background: "#fff", color: "#363636" },
                duration: 5000,
            }} />


            <div className="w-full h-full overflow-y-auto p-4 ">
                <div className="flex items-start gap-4 h-full">
                    {/* Liste des employés disponibles */}
                    <div className="w-1/2 border-r pr-4">
                        <div className="mb-2">
                            <label className="text-sm font-semibold text-gray-700  text-left">Liste de tout les formateurs</label>
                           
                        </div>
                        <input
                            type="text"
                            className=" mb-2 p-2 border rounded bg-white text-gray-700 w-1/2"
                            placeholder="Rechercher nom..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <table className="table-auto w-full">
                                <tbody>
                                    {filteredFormateurs.length > 0 ? (
                                        filteredFormateurs.map((formateur, index) => {
                                            const isSelected = selectedFormateurs.some(app => app.idFormateur === formateur.idFormateur);
                                            return (
                                                <tr key={index} className="border-b">
                                                    <td className="flex items-center gap-2 py-2">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                            {formateur.form_photo ? (
                                                                <img src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`} alt="" />
                                                            ) : (
                                                                <span className="text-sm uppercase">{formateur.form_name?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <div className="font-semibold uppercase text-sm text-gray-800">{formateur.form_name}</div>
                                                            <div className="text-xs text-gray-500">{formateur.form_first_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => manageFormateurs("post", idProjet, formateur.idFormateur)}
                                                            className="btn btn-success btn-sm bg-green-500"
                                                            disabled={isSelected}
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan="2" className="text-center">Aucun employé trouvé</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Liste des employés sélectionnés */}
                    <div className="w-1/2 pl-4">
                        <h4 className="text-sm font-semibold mb-2 text-gray-600 text-left">{selectedFormateurs.length} formateurs sélectionnés</h4>
                        <table className="table-auto w-full">
                            <tbody>
                                {selectedFormateurs.length > 0 ? (
                                    selectedFormateurs.map((formateur, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="flex items-center gap-2 py-2">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {formateur.form_photo ? (
                                                        <img src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`} alt="" />
                                                    ) : (
                                                        <span className="text-sm uppercase">{formateur.form_name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="font-semibold uppercase text-sm text-gray-800">{formateur.form_name}</div>
                                                    <div className="text-xs text-gray-500">{formateur.form_first_name}</div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => manageFormateurs("delete", idProjet, formateur.idFormateur)}
                                                    className="btn btn-danger btn-sm bg-red-500 "
                                                >
                                                    <FaXmark />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="2" className="text-center">Aucun employé sélectionné</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

               
            </div>

        </>
    );
};

export default EtpFormateurAjouter;
