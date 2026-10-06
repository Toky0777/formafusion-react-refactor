import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import codePostal from "../../../components/codePostal/codePostal";
import axios from "../../../config/axios";


export default function ModalModificationLieuEtSalle({ showUpdateLieuEtSalle, handleCloseUpdateLieuEtSalle, data, onUpdateSuccess }) {

    const provinces = [
        { id: "1", name: "Antananarivo" },
        { id: "2", name: "Antsirabe" },
        { id: "3", name: "Fianarantsoa" },
        { id: "4", name: "Mahajanga" },
        { id: "5", name: "Toamasina" },
        { id: "6", name: "Toliary" },
    ];

    const [villesFiltered, setVillesFiltered] = useState([]);
    const [liName, setLiName] = useState("");
    const [liQuartier, setLiQuartier] = useState("");
    const [salles, setSalles] = useState([]);
    const [salleNames, setSalleNames] = useState({});
    const [salleName, setSalleName] = useState("");
    const [imageSalle, setImageSalle] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState("");
    const [selectedCodePostal, setSelectedCodePostal] = useState("");

    useEffect(() => {
        if (data?.salles) {
            setSalles(data.salles);
            const initialSalleNames = data.salles.reduce((acc, salle) => {
                acc[salle.idSalle] = salle.salle_name;
                return acc;
            }, {});
            setSalleNames(initialSalleNames);
        }
    }, [data]);

    useEffect(() => {
        console.log("data reçue :", data);
        if (data) {
            setLiName(data.li_name || "");
            setLiQuartier(Array.isArray(data.li_quartier) ? data.li_quartier[0] : data.li_quartier || "");
            setSalleName(data.salles?.[0]?.salle_name || "");
            setSelectedRegionId(data.idVille || "");
        }
    }, [data]);

    useEffect(() => {
        if (selectedRegionId) {
            const filtered = codePostal.filter(c => c.region === selectedRegionId);
            setVillesFiltered(filtered);
            // Si data.idVilleCoded correspond à cette région, on le met comme sélection
            if (data?.idVilleCoded) {
                const exists = filtered.find(c => c.code === data.idVilleCoded);
                if (exists) {
                    setSelectedCodePostal(data.idVilleCoded);
                } else {
                    setSelectedCodePostal(""); // Réinitialiser si non trouvé
                }
            }
        } else {
            setVillesFiltered([]);
            setSelectedCodePostal("");
        }
    }, [selectedRegionId]);

   
    const handleRegionChange = (event) => {
        setSelectedRegionId(event.target.value);
        setSelectedCodePostal(""); // Réinitialiser le code postal
    };

    const handleCodePostalChange = (event) => {
        setSelectedCodePostal(event.target.value);
    };

    //modification lieu (sur le boutton Mettre à jour les informations )
    const handleSubmitUpdateLieu = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("idLieu", data.idLieu);
        // Pour handleSubmitUpdateLieu :
        if (data.salles && data.salles.length > 0) {
            formData.append("idSalle", data.salles[0].idSalle);
        }

        formData.append("li_name", liName);
        formData.append("li_quartier", liQuartier);
        formData.append("salle_name", salleName);

        // vérification si l'utilisateur change la région ou code postal
        if (selectedRegionId !== data.villeRegion) {
            formData.append("idVilleUpdate", selectedRegionId);
        }
        if (selectedCodePostal !== data.vi_code_postal) {
            formData.append("idVilleCodedUpdate", selectedCodePostal);
        }

        // 🔥 Afficher les données avant envoi
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const res = await axios.post('/cfp/updateSalleLieu', formData);

            if (res.data.status === 200) {
                setTimeout(() => {
                    handleCloseUpdateLieuEtSalle();
                }, 2000);
                toast.success("Mise à jour réussi");
                onUpdateSuccess();
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            console.log("Erreur de modification");
        }
    };


    if (!showUpdateLieuEtSalle) return null;
    if (!data) return null;

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

            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4 h-screen">
                <div className="bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[45%] ">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-slate-200 px-6 py-4">
                        <h2 className="text-gray-500 text-base md:text-xl ">Modifier les informations de lieux et salles</h2>
                        <button onClick={handleCloseUpdateLieuEtSalle} className="p-2 hover:bg-white/10 rounded-full transition">
                            <RxCross2 size={24} className="text-red-500" />
                        </button>
                    </div>

                    {/* Formulaire */}
                    <form className="space-y-8 p-4 sm:p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2" onSubmit={handleSubmitUpdateLieu} >

                        {/* === Intitulé === */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Informations générales</h3>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full">
                                    <label className="block mb-1 font-medium">Nom du Lieu</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-md"
                                        value={liName}
                                        onChange={(e) => setLiName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block mb-1 font-medium">Quartier</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border rounded-md"
                                        value={liQuartier}
                                        onChange={(e) => setLiQuartier(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mt-4">

                                <div className="w-full">
                                    <label className="block mb-1 font-medium">Province</label>
                                    <select
                                        value={selectedRegionId}
                                        onChange={handleRegionChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                    >
                                        <option value="">{data.villeRegion}</option>
                                        {provinces.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div className="w-full">
                                    <label className="block mb-1 font-medium">Code Postal</label>
                                    <select
                                        value={selectedCodePostal}
                                        onChange={handleCodePostalChange}
                                        disabled={!selectedRegionId}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                    >
                                        <option value="">
                                            {data.vi_code_postal} - {data.ville_name}
                                        </option>
                                        {villesFiltered.map(d => (
                                            // <-- Utiliser d.id (id de ville_codeds) comme value
                                            <option key={d.id} value={d.id}>
                                                {d.code} - {d.ville}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                            </div>

                        </section>

                        

                        {/* === Bouton de soumission === */}
                        <div className="text-right pt-2">
                            <button
                                type="submit"
                                className="bg-slate-100 text-gray-500 px-6 py-3 rounded-lg text-sm "
                            >
                                Mettre à jour les informations
                            </button>
                        </div>

                    </form>

                </div>
            </div >


        </>

    );
}