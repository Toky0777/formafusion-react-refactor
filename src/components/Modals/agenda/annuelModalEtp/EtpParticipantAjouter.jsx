import axios from "../../../../config/axios";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { Search } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { IMAGE_URL } from "../../../../config/env";



const EtpParticipantAjouter = ({ idProjet }) => {
    const [loading, setLoading] = useState(false);
    const [availableEmployes, setAvailableEmployes] = useState([]);
    const [selectedApprenants, setSelectedApprenants] = useState([]);
    const [entreprises, setEntreprise] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [idEtp, setIdEtp] = useState(null);
    useEffect(() => {
        getEtpbyProjet(idProjet);
        getSelectedApprenants(idProjet);
    }, [idProjet]);

    useEffect(() => {
        if (idEtp) {
            fetchAvailableEmployes(idEtp);
        }
    }, [idEtp]);

       useEffect(() => {
        if (idProjet) {
            getSelectedApprenants(idProjet);
        }
    }, [idProjet]);
console.log(idProjet)
    const getEtpbyProjet = async (idProjet) => {
        try {
            const { data } = await axios.get(`/etp/projet/inter/getEtpAdded/${idProjet}`);
            console.log(data.etps)
            setEntreprise(data.etps);
        } catch (error) {
            console.warn("Erreur lors de la récupération des entreprises:", error);
        }
    };

    const fetchAvailableEmployes = async (idEtp) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/etp/projet/apprenants/${idEtp}`);
            setAvailableEmployes(data.apprs || []);
        } catch (error) {
            console.warn("Erreur lors de la récupération des employés:", error);
        }
        setLoading(false);
    };

    const getSelectedApprenants = async (idProjet) => {
        try {
            const { data } = await axios.get(`/etp/apprenant-drawer/${idProjet}`);
            console.table(data.apprenants)
            setSelectedApprenants(data.apprenants || []);
        } catch (error) {
            console.warn("Erreur lors de la récupération des apprenants ajoutés:", error);
        }
    };

    const manageApprenant = async (type, idProjet, idApprenant) => {
        try {
            const response = await axios({
                method: type,
                url: `/etp/projet/apprenants/${idProjet}/${idApprenant}`
            });
            const res = response.data;
            if (res.success) {
                toast.success(res.success, { duration: 1500 });
                getSelectedApprenants(idProjet);
                fetchAvailableEmployes(idEtp);
            } else {
                toast.error(res.error || "Erreur lors de la requête");
            }
        } catch (error) {
            console.warn("Erreur lors de la requête:", error);
            toast.error("Une erreur s'est produite");
        }
    };

    const filteredEmployes = availableEmployes.filter((emp) => {
        const term = searchTerm.toLowerCase();
        return (
            (emp.emp_name && emp.emp_name.toLowerCase().includes(term)) ||
            (emp.emp_firstname && emp.emp_firstname.toLowerCase().includes(term))
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
                        <div className="mb-2 text-left">
                            <label className="text-sm font-semibold text-gray-700  text-left">Entreprise</label>
                            <select
                                className="mt-1 w-full border rounded p-2 bg-gray-100 text-gray-700"
                                value={idEtp || ""}
                                onChange={(e) => setIdEtp(e.target.value)}
                            >
                                <option value="" className="text-gray-700" >-- Sélectionner une entreprise --</option>
                                {entreprises?.map((etp) => (
                                    <option className="text-gray-800" key={etp.idEtp} value={etp.idEtp}>
                                        {etp.etp_name}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="relative flex items-center bg-white rounded shadow border border-gray-100 transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
                            <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="pl-6 pr-2 p-1  rounded border-none focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 w-64"
                                placeholder="Rechercher un employé..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <p>Chargement...</p>
                        ) : (
                            <table className="table-auto w-full">
                                <tbody>
                                    {filteredEmployes.length > 0 ? (
                                        filteredEmployes.map((employed, index) => {
                                            const isSelected = selectedApprenants.some(app => app.idEmploye === employed.idEmploye);
                                            return (
                                                <tr key={index} className="border-b">
                                                    <td className="flex items-center gap-2 py-2">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                            {employed.emp_photo ? (
                                                                <img src={`${IMAGE_URL}/img/employes/${employed.emp_photo}`} alt="" />
                                                            ) : (
                                                                <span className="text-sm uppercase">{employed.emp_name?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col items-start">
                                                            <div className="font-semibold uppercase text-sm text-gray-800">{employed.emp_name}</div>
                                                            <div className="text-xs text-gray-500">{employed.emp_firstname}</div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right">
                                                        <button
                                                            onClick={() => manageApprenant("post", idProjet, employed.idEmploye)}
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
                        <h4 className="text-sm font-semibold mb-2 text-gray-600 text-left">{selectedApprenants.length} employés sélectionnés</h4>
                        <table className="table-auto w-full">
                            <tbody>
                                {selectedApprenants.length > 0 ? (
                                    selectedApprenants.map((apprenant, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="flex items-center gap-2 py-2">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {apprenant.photo ? (
                                                        <img src={`${IMAGE_URL}/img/employes/${apprenant.photo}`} alt="" />
                                                    ) : (
                                                        <span className="text-sm uppercase">{apprenant.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="font-semibold uppercase text-sm text-gray-800">{apprenant.name}</div>
                                                    <div className="text-xs text-gray-500">{apprenant.firstName
}</div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => manageApprenant("delete", idProjet, apprenant.idEmploye)}
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

export default EtpParticipantAjouter;
