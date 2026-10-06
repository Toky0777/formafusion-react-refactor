import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import axios from "../../../config/axios";
import { X, Plus, MapPin, Building, Image, Type } from 'lucide-react';


export default function ModalSalle({ showSalle, handleCloseSalle, handleOpenVille, onAjoutSuccess }) {

    // affichage message d'erreur
    const [message, setMessage] = useState(null);

    //ajout nouvelle salle
    const [salleName, setSalleName] = useState("");
    const [selectedLieuId, setSelectLieuId] = useState("");
    const [imageFile, setImageFile] = useState("");

    //récupération des données dans la base de données
    const [lieus, setLieux] = useState([]);
    const [villes, setVilles] = useState([]);
    const [loading, setLoading] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [lieuxRes, sallesRes] = await Promise.all([
                axios.get("/cfp/lieux"),
                axios.get("/cfp/salles",),
            ]);
            const lieux = lieuxRes.data.lieux_addSalle;
            const salles = sallesRes.data.salles;
            const ville = lieuxRes.data.ville_addSalle;
            const type = lieuxRes.data.lieu_types

            const getCodePostalPrefix = (villeNom) => {
                const map = {
                    'Antananarivo': '101',
                    'Toamasina': '509',
                    'Fianarantsoa': '308',
                    'Toliary': '601',
                    'Mahajanga': '411',
                    'Antsiranana': '203'
                };
                return map[villeNom] || '';
            };

            const lieuxAvecSalles = lieux.map(lieu => {
                const sallesAssocies = salles.filter(
                    salle => salle.lieu_name.trim().toLowerCase() === lieu.li_name.trim().toLowerCase()
                );

                //la ville correspondante grâce au code postal
                const villeFromList = ville.find(v => lieu.vi_code_postal.startsWith(getCodePostalPrefix(v.ville)));

                //type
                const typeAssocie = type.find(t => t.lt_name === lieu.idType);

                return {
                    ...lieu,
                    salles: sallesAssocies,
                    villeRegion: villeFromList?.ville || "Région inconnue",
                    typeNom: typeAssocie?.type || "Type inconnu"
                };

            });
            setLieux(lieuxAvecSalles);
            setVilles(ville);
            console.log("Lieux finaux avec types :", lieuxAvecSalles);
        } catch (error) {
            console.error("erreur lors de la récupération des données:", error);
            toast.error("erreur lors de la récupération des données")
        } finally {
            setLoading(false);
        }
    };

    //ajout nouvelle salle
    const handleSubitSalle = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("salle_name", salleName);
        formData.append("idLieu", selectedLieuId);
        formData.append("salle_image", imageFile);

        for (let [key, val] of formData.entries()) {
            console.log(key, val);
        }

        try {
            const resp = await axios.post("/cfp/salles", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("salle ajoute:",resp);
            if (resp.data.status === 200) {
                toast.success("Salle ajoutée avec succès");
                handleCloseSalle();

                // envoyer la salle créée au parent
                onAjoutSuccess(resp.data.data);

                // Réinitialiser le formulaire
                setSalleName("");
                setSelectLieuId("");
                setImageFile("");
            } else {
                toast.error(resp.data.message);
            }


        } catch (error) {
            console.log(error)
            toast.error("Une erreur s'est produit");
        }
    }

    if (!showSalle) return null;

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
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center px-4 h-screen">
                <div className="bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[45%] max-w-4xl mx-auto rounded-2xl " >

                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#5B345B] to-[#7B4B7B] px-8 py-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Building size={24} className="text-white" />
                                </div>
                                <h2 className="text-white text-xl font-bold">Ajouter salles</h2>
                            </div>
                            <button
                                onClick={handleCloseSalle}
                                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-4 text-sm font-medium ${message.includes("succès") ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} data-aos="zoom-in-up" data-aos-delay="300">
                            {message}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form className="space-y-8 p-4 sm:p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2" onSubmit={handleSubitSalle}>

                        {/* === Choisir un lieu === */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-amber-800 text-sm leading-relaxed mb-4">
                                        Les lieux affichés correspondent à des villes avec leur code postal.
                                        Si votre lieu ne figure pas dans la liste, vous pouvez l'ajouter facilement.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleOpenVille}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                    >
                                        <Plus size={16} />
                                        Ajouter un nouveau lieu
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* === Sélection de Lieu === */}
                        <div className="space-y-3">
                            <section>
                                <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                    <MapPin size={20} className="text-[#5B345B]" />
                                    Choisir un lieu
                                </label>
                                <select
                                    value={selectedLieuId}
                                    onChange={(e) => setSelectLieuId(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5B345B] focus:ring-4 focus:ring-[#5B345B]/20 transition-all duration-200 bg-gray-50 hover:bg-white"
                                >
                                    {lieus.map((d) => (
                                        <option key={d.idLieu} value={d.idLieu}>
                                            {d.li_name} - {d.vi_code_postal} - {d.ville_name}
                                        </option>
                                    ))}
                                </select>

                            </section>
                        </div>

                        {/* === Image === */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Image size={20} className="text-[#5B345B]" />
                                Image de la salle
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full p-3 border rounded-md"
                                required
                            />
                        </div>

                        {/* === Nom de la salle === */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Type size={20} className="text-[#5B345B]" />
                                Nom de la salle
                            </label>
                            <input
                                value={salleName}
                                onChange={(e) => setSalleName(e.target.value)}
                                type="text"
                                placeholder="Entrez le nom de la salle..."
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5B345B] focus:ring-4 focus:ring-[#5B345B]/20 transition-all duration-200 bg-gray-50 hover:bg-white"
                                required
                            />
                        </div>

                        {/* === Bouton === */}
                        <div className="text-right">
                            <button
                                type="submit"
                                className="bg-[#5B345B] hover:bg-[#472747] text-white px-6 py-3 rounded-lg text-sm font-semibold transition"
                            >
                                Ajouter une salle
                            </button>
                        </div>

                    </form>

                </div>

            </div>


        </>

    );
}