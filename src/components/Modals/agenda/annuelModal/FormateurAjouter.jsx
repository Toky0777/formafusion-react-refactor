import axios from "../../../../config/axios";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { Search } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { IMAGE_URL } from "../../../../config/env";
const FormateurAjouter = ({ idProjet, setShowEditDrawer }) => {
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
            const { data } = await axios.get(`/cfp/forms/`, {
               
            });
            setavailableFormateurs(data.forms || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des employés:", error);
        }
        setLoading(false);
    };

    const getselectedFormateurs = async (idProjet) => {
        try {
            const { data } = await axios.get(`/cfp/projets/${idProjet}/formateur`, {
              
            });

            setselectedFormateurs(data.forms || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des formateurs ajoutés:", error);
        }
    };

    const manageFormateurs = async (type, idProjet, idFormateur) => {
        try {
            const response = await axios({
                method: type,
                url: `/cfp/projets/${idProjet}/${idFormateur}/form/assign`,
               
            });
            const res = response.data;

            toast.success("opération effectué!", { duration: 1500 });
            getselectedFormateurs(idProjet);
            await fetchavailableFormateurs();

        } catch (error) {
            console.error("Erreur lors de la requête:", error);
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


            <div className="w-full h-full p-4 overflow-y-auto ">
                <div className="flex items-start h-full gap-4">
                    {/* Liste des employés disponibles */}
                    <div className="w-1/2 pr-4 border-r">
                        <div className="mb-2 text-left">
                            <label className="text-sm font-semibold text-left text-gray-700">Liste de tous les formateurs </label>
                        </div>

                        <div className="relative flex items-center mb-1 transition-all duration-200 bg-white border border-gray-100 rounded shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
                            <Search className="absolute w-4 h-4 text-gray-400 left-2" />
                            <input
                                type="text"
                                className="w-64 p-1 pl-6 pr-2 text-gray-800 placeholder-gray-400 bg-transparent border-none rounded focus:outline-none"
                                placeholder="Rechercher nom..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <table className="w-full table-auto">
                                <tbody>
                                    {filteredFormateurs.length > 0 ? (
                                        filteredFormateurs.map((formateur, index) => {
                                            const isSelected = selectedFormateurs.some(app => app.idFormateur === formateur.idFormateur);
                                            return (
                                                <tr key={index} className="border-b">
                                                    <td className="flex items-center gap-2 py-2">
                                                        <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                            {formateur.form_photo ? (
                                                                <img src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`} alt="" />
                                                            ) : (
                                                                <span className="text-sm uppercase">{formateur.form_name?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <div className="text-sm font-semibold text-gray-800 uppercase">{formateur.form_name}</div>
                                                            <div className="text-xs text-gray-500">{formateur.form_first_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => manageFormateurs("post", idProjet, formateur.idFormateur)}
                                                            className="bg-green-500 btn btn-success btn-sm"
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
                        <h4 className="mb-2 text-sm font-semibold text-left text-gray-600">{selectedFormateurs.length} formateurs sélectionnés</h4>
                        <table className="w-full table-auto">
                            <tbody>
                                {selectedFormateurs.length > 0 ? (
                                    selectedFormateurs.map((formateur, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="flex items-center gap-2 py-2">
                                                <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                    {formateur.form_photo ? (
                                                        <img src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`} alt="" />
                                                    ) : (
                                                        <span className="text-sm uppercase">{formateur.form_name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="text-sm font-semibold text-gray-800 uppercase">{formateur.form_name}</div>
                                                    <div className="text-xs text-gray-500">{formateur.form_first_name}</div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => manageFormateurs("delete", idProjet, formateur.idFormateur)}
                                                    className="bg-red-500 btn btn-danger btn-sm "
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

export default FormateurAjouter;
