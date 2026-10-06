import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";

import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../../../../context/AuthContext";


const Ajoutemployed = ({ idProjet, setShowPageApprenant }) => {
    const [loading, setLoading] = useState(false);
    const [availableEmployes, setAvailableEmployes] = useState([]);
    const [selectedApprenants, setSelectedApprenants] = useState([]);
    const [entreprises, setEntreprise] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [idEtp, setIdEtp] = useState(null);
    const auth = useAuth();

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
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/projet/etpInter/getEtpAdded/${idProjet}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setEntreprise(data.etps);
        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises:", error);
        }
    };

    const fetchAvailableEmployes = async (idEtp) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/projet/etpInter/getemployedProjetInter/${idEtp}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setAvailableEmployes(data.appr);
        } catch (error) {
            console.error("Erreur lors de la récupération des employés:", error);
        }
        setLoading(false);
    };

    const getSelectedApprenants = async (idProjet) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/apprenant-drawer/${idProjet}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setSelectedApprenants(data.appr);
        } catch (error) {
            console.error("Erreur lors de la récupération des apprenants ajoutés:", error);
        }
    };

    const manageApprenant = async (type, idProjet, idApprenant) => {
        try {
            const response = await axios({
                method: type,
                url: `${process.env.REACT_APP_API_URL}/cfp/projet/etpInter/${idProjet}/${idApprenant}`,
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

            <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPageApprenant(false)}
            />

            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.5 }}
                className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg"
            >
                <div className="w-full h-full p-4 overflow-y-auto">
                    <div className="flex items-start h-full gap-4">
                        {/* Liste des employés disponibles */}
                        <div className="w-1/2 pr-4 border-r">
                            <div className="mb-2">
                                <label className="text-sm font-semibold text-gray-700">Entreprise</label>
                                <select
                                    className="w-full p-2 mt-1 border rounded"
                                    value={idEtp || ""}
                                    onChange={(e) => setIdEtp(e.target.value)}
                                >
                                    <option value="">-- Sélectionner une entreprise --</option>
                                    {entreprises.map((etp) => (
                                        <option key={etp.id} value={etp.id}>{etp.nom}</option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="text"
                                className="w-full p-2 mb-2 border rounded"
                                placeholder="Rechercher un employé..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {loading ? (
                                <p>Chargement...</p>
                            ) : (
                                <table className="w-full table-auto">
                                    <tbody>
                                        {filteredEmployes.length > 0 ? (
                                            filteredEmployes.map((employed, index) => {
                                                const isSelected = selectedApprenants.some(app => app.idEmploye === employed.idEmploye);
                                                return (
                                                    <tr key={index} className="border-b">
                                                        <td className="flex items-center gap-2 py-2">
                                                            <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                                {employed.emp_photo ? (
                                                                    <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${employed.emp_photo}`} alt="" />
                                                                ) : (
                                                                    <span className="text-sm uppercase">{employed.emp_name?.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-semibold uppercase">{employed.emp_name}</div>
                                                                <div className="text-xs text-gray-500">{employed.emp_firstname}</div>
                                                            </div>
                                                        </td>
                                                        <td className="text-right">
                                                            <button
                                                                onClick={() => manageApprenant("post", idProjet, employed.idEmploye)}
                                                                className="btn btn-success btn-sm"
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
                            <h4 className="mb-2 text-sm font-semibold">{selectedApprenants.length} employés sélectionnés</h4>
                            <table className="w-full table-auto">
                                <tbody>
                                    {selectedApprenants.length > 0 ? (
                                        selectedApprenants.map((apprenant, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="flex items-center gap-2 py-2">
                                                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
                                                        {apprenant.emp_photo ? (
                                                            <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant.emp_photo}`} alt="" />
                                                        ) : (
                                                            <span className="text-sm uppercase">{apprenant.emp_name?.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold uppercase">{apprenant.emp_name}</div>
                                                        <div className="text-xs text-gray-500">{apprenant.emp_firstname}</div>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => manageApprenant("delete", idProjet, apprenant.idEmploye)}
                                                        className="btn btn-danger btn-sm"
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

                    <div className="flex justify-end w-full mt-6">
                        <button onClick={() => setShowPageApprenant(false)} className="mr-2 btn btn-secondary">Annuler</button>
                        <button onClick={() => setShowPageApprenant(false)} className="btn btn-primary">Fermer</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Ajoutemployed;
