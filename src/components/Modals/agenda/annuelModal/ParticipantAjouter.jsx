import axios from "../../../../config/axios";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";

import { toast, Toaster } from "react-hot-toast";
import { useAuth } from '../../../../contexts/AuthContext';
import { Search } from "lucide-react";
import { IMAGE_URL } from "../../../../config/env";


const ParticipantAjouter = ({ idProjet }) => {
    const [loading, setLoading] = useState(false);
    const [availableEmployes, setAvailableEmployes] = useState([]);
    const [selectedApprenants, setSelectedApprenants] = useState([]);
    const [entreprises, setEntreprise] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [idEtp, setIdEtp] = useState(null);
    const auth = useAuth();
    console.log(idProjet);
    useEffect(() => {
        getEtpbyProjet(idProjet);
        getSelectedApprenants(idProjet);
    }, [idProjet]);

    useEffect(() => {
        if (idEtp) {
            fetchAvailableEmployes(idEtp);
        }
    }, [idEtp]);

    const getEtpbyProjet = async (idProjet) => {
        try {
            const { data } = await axios.get(`/cfp/projet/etpInter/getEtpAdded/${idProjet}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setEntreprise(data.etps);
            console.log(data.etps)
        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises:", error);
        }
    };

    const fetchAvailableEmployes = async (idEtp) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/cfp/projet/apprenants/${idEtp}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setAvailableEmployes(data.apprs || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des employés:", error);
        }
        setLoading(false);
    };

    const getSelectedApprenants = async (idProjet) => {
        try {
            const { data } = await axios.get(`/cfp/projet/apprenants/added/${idProjet}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            console.log(data)
            setSelectedApprenants(data.apprs || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des apprenants ajoutés:", error);
        }
    };

    const manageApprenant = async (type, idProjet, idApprenant) => {
        try {
            const response = await axios({
                method: type,
                url: `/cfp/projet/apprenants/${idProjet}/${idApprenant}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
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
            console.error("Erreur lors de la requête:", error);
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


            <div className="w-full h-full p-4 overflow-y-auto ">
                <div className="flex items-start h-full gap-4">
                    {/* Liste des employés disponibles */}
                    <div className="w-1/2 pr-4 border-r">
                        <div className="mb-2 text-left">
                            <label className="text-sm font-semibold text-left text-gray-700">Entreprises :</label>
                            <select
                                className="w-full p-2 mt-1 text-gray-700 bg-gray-100 border rounded"
                                value={idEtp || ""}
                                onChange={(e) => setIdEtp(e.target.value)}
                            >
                                <option value="" className="text-gray-700" >-- Veuillez sélectionner une entreprise --</option>
                                {entreprises?.map((etp) => (
                                    <option className="text-gray-800" key={etp.idEtp} value={etp.idEtp}>
                                        {etp.etp_name}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="relative flex items-center transition-all duration-200 bg-white border border-gray-100 rounded shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
                            <Search className="absolute w-4 h-4 text-gray-400 left-2" />
                            <input
                                type="text"
                                className="w-64 p-1 pl-6 pr-2 text-gray-800 placeholder-gray-400 bg-transparent border-none rounded focus:outline-none"
                                placeholder="Rechercher un employé..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>


                        {loading ? (
                            <p>Chargement en cours...</p>
                        ) : (
                            <>

                                <table className="w-full table-auto">
                                    <tbody>
                                        {filteredEmployes.length > 0 ? (
                                            <>
                                                <tr>
                                                    <td colSpan="2" className="py-2 text-left">
                                                        Tous les employés de cette entreprise :
                                                    </td>
                                                </tr>

                                                {filteredEmployes.map((employed, index) => {
                                                    const isSelected = selectedApprenants.some(app => app.idEmploye === employed.idEmploye);
                                                    return (
                                                        <tr key={index} className="border-b">
                                                            <td className="flex items-center gap-2 py-2">
                                                                <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                                    {employed.emp_photo ? (
                                                                        <img
                                                                            src={`${IMAGE_URL}/img/employes/${employed.emp_photo}`}
                                                                            alt=""
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm uppercase">{employed.emp_name?.charAt(0)}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-start">
                                                                    <div className="text-sm font-semibold text-gray-800 uppercase">
                                                                        {employed.emp_name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">{employed.emp_firstname}</div>
                                                                </div>
                                                            </td>
                                                            <td className="text-right">
                                                                <button
                                                                    onClick={() => manageApprenant("post", idProjet, employed.idEmploye)}
                                                                    className="bg-green-500 btn btn-success btn-sm"
                                                                    disabled={isSelected}
                                                                >
                                                                    <FaPlus />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="text-center">Aucun employé trouvé</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </>

                        )}
                    </div>

                    {/* Liste des employés sélectionnés */}
                    <div className="w-1/2 pl-4">
                        <h4 className="mb-2 text-sm font-semibold text-left text-gray-600">{selectedApprenants.length} employés sélectionnés pour cet session</h4>
                        <table className="w-full table-auto">
                            <tbody>
                                {selectedApprenants.length > 0 ? (
                                    selectedApprenants?.map((apprenant, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="flex items-center gap-2 py-2">
                                                <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                    {apprenant.emp_photo ? (
                                                        <img src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo}`} alt="" />
                                                    ) : (
                                                        <span className="text-sm uppercase">{apprenant.emp_name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <div className="text-sm font-semibold text-gray-800 uppercase">{apprenant.emp_name}</div>
                                                    <div className="text-xs text-gray-500">{apprenant.emp_firstname}</div>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => manageApprenant("delete", idProjet, apprenant.idEmploye)}
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

export default ParticipantAjouter;
