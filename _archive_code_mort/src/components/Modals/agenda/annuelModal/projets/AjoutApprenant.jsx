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
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[1010px] flex-col overflow-hidden bg-white shadow-lg"
            >
                <div className="flex min-h-0 flex-1 flex-col p-4">
                    <div className="flex min-h-0 flex-1 gap-4">
                        {/* Liste des employés disponibles */}
                        <div className="flex min-h-0 w-1/2 flex-col overflow-hidden border-r pr-4">
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
                            <div className="min-h-0 flex-1 overflow-y-auto">
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
                        </div>

                        {/* Liste des employés sélectionnés */}
                        <div className="flex min-h-0 w-1/2 flex-col overflow-hidden pl-4">
                            <h4 className="mb-2 shrink-0 text-sm font-semibold">{selectedApprenants.length} employés sélectionnés</h4>
                            <div className="min-h-0 flex-1 overflow-y-auto">
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
                    </div>

                    <div className="flex w-full shrink-0 justify-end border-t bg-white pt-4 mt-4">
                        <button onClick={() => setShowPageApprenant(false)} className="mr-2 btn btn-secondary">Annuler</button>
                        <button onClick={() => setShowPageApprenant(false)} className="btn btn-primary">Fermer</button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Ajoutemployed;
