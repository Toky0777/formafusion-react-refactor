import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import codePostal from "../../../components/codePostal/codePostal";
import axios from "../../../config/axios";

export default function ModalLieux({ show, handleClose, onAjoutSuccess }) {

    // affichage message d'erreur
    const [message, setMessage] = useState(null);

    const [loading, setLoading] = useState(false);

    //state pour le  boutton radio
    const [selected, setSelected] = useState("");

    //affichage de code Postal
    const [selectedCodePostal, setSelectedCodePostal] = useState('');
    const handleCodePostal = (event) => {
        setSelectedCodePostal(Number(event.target.value));
    }

    // affichage des entreprise
    const [etpcfp, setEtpCfp] = useState("");
    useEffect(() => {
        const fetchDataEtpCfp = async () => {
            try {
                const response = await axios.get("/cfp/lieux/getEtps")
                setEtpCfp(response.data.etps)
            } catch (error) {
                console.log(error)
            }

        }
        fetchDataEtpCfp();
    }, [])

    // state pour changement de région
    const [selectedRegion, setSelectedRegion] = useState("");
    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value);
        setSelectedCodePostal("");
    }
    const filteredCodePostal = codePostal.filter(cp => cp.region === selectedRegion);

    //ajout une nouvelle lieu
    const [intitule, setIntitule] = useState("");
    const [quartier, setQuartier] = useState("");
    const [selectedEntreprise, setSelectedEntreprise] = useState("");

    const handleSubmitLieux = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = {
            li_name: intitule,
            main_salle_quartier: quartier,
            idVilleCoded: selectedCodePostal,
            idVille: selectedRegion,
            idLieuType:
                selected === "public" ? 1 :
                    selected === "prive" ? 2 :
                        selected === "entreprise" ? 3 : null,
            idEntreprise: selected === "entreprise" ? selectedEntreprise : null
        };
        try {
            const response = await axios.post("/cfp/lieux", formData,);
            const newLieu = response.data.data;
            console.log("donnée envoyée:", response)
            setIntitule("");
            setQuartier("");
            setSelectedRegion("");
            setSelectedCodePostal("");
            setSelectedEntreprise("");
            setSelected("");

            onAjoutSuccess(response.data.data);

            setTimeout(() => {
                handleClose();
                toast.success("Lieu ajouté avec succès");
            }, 1000);

        } catch (error) {
            console.log("Erreur lors de l'ajout : " + (error?.response?.data?.message || "Erreur inconnue"))
            toast.error("Erreur lors de l'ajout");

        } finally {
            setLoading(false)
        }
    }

    if (!show)
        return null;

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
                <div className="bg-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[45%] rounded-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-slate-200 px-6 py-4  rounded-t-2xl">
                        <h2 className="text-gray-500 text-base sm:text-lg md:text-xl ">Ajouter une nouvelle Lieu</h2>
                        <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition">
                            <RxCross2 size={24} className="text-red-500" />
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-4 text-sm font-medium ${message.includes("succès") ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} data-aos="zoom-in-up" data-aos-delay="300">
                            {message}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form className="space-y-8 p-4 sm:p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2" onSubmit={handleSubmitLieux}>

                        {/* Type : public, privé, entreprise */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 gap-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="public"
                                    checked={selected === "public"}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="w-4 h-4 accent-red-600"
                                />
                                <label className="ml-2 text-sm text-gray-900">Client</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="prive"
                                    checked={selected === "prive"}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <label className="ml-2 text-sm text-gray-900">Centre de Formation</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="entreprise"
                                    checked={selected === "entreprise"}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className="w-4 h-4 accent-green-600"
                                />
                                <label className="ml-2 text-sm text-gray-900"> Entreprise</label>
                            </div>
                        </div>

                        {/* Entreprise */}
                        {selected === "entreprise" && (
                            <section>
                                <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Entreprise</h3>
                                <select
                                    value={selectedEntreprise}
                                    onChange={(e) => setSelectedEntreprise(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                >
                                    {etpcfp && etpcfp.length > 0 ? (
                                        <>
                                            <option value="">-- Veuillez choisir une entreprise --</option>
                                            {etpcfp && etpcfp.map((etp) => (
                                                <option key={etp.idEtp} value={etp.idEtp}>{etp.etp_name}</option>
                                            ))}
                                        </>
                                    ) : (
                                        <h1>Vous n'avez pas d'entreprise clients</h1>
                                    )}
                                </select>
                            </section>
                        )}

                        {/* Intitulé */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Intitulé</h3>
                            <input
                                type="text"
                                value={intitule}
                                onChange={(e) => setIntitule(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                placeholder="ex:Carlton"
                                required />
                        </section>

                        {/* Région */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Province</h3>
                            <select
                                value={selectedRegion}
                                onChange={handleRegionChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                            >
                                <option value="">-- Veuillez choisir une province --</option>
                                <option value="1">Antananarivo</option>
                                <option value="2">Antsirabe</option>
                                <option value="3">Fianarantsoa</option>
                                <option value="4">Mahajanga</option>
                                <option value="5">Toamasina</option>
                                <option value="6">Toliary</option>

                            </select>

                        </section>

                        {/* Code postal */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Code Postal</h3>
                            <select
                                value={selectedCodePostal}
                                onChange={handleCodePostal}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                            >
                                <option value=""></option>
                                {filteredCodePostal.map(d => (
                                    <option key={d.id} value={d.id}>{d.code} - {d.ville}</option>
                                ))}
                            </select>
                        </section>

                        {/* Quartier */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Quartier</h3>
                            <input
                                type="text"
                                value={quartier}
                                onChange={(e) => setQuartier(e.target.value)}
                                className="w-full p-3 border rounded-md"
                                placeholder="ex:Anosy"
                                required />
                        </section>

                        {/* Bouton */}
                        <div className="text-right">
                            <button
                                type="submit"
                                className="bg-slate-100 text-gray-500 px-6 py-3 rounded-lg text-sm "
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Chargement...</span>
                                    </>
                                ) : (
                                    'Ajouter une lieu'
                                )}
                            </button>
                        </div>
                    </form>

                </div>

            </div>

        </>

    );
}