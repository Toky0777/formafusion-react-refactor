import { useState, useEffect } from "react";
import axios from "../../../../config/axios";

const EtpFormateurDetail = ({ idFormateur }) => {
    const [form, setForm] = useState({});
    const [speciality, setSpeciality] = useState({}); // Keep this as an object if it represents a single specialty
    const [experiences, setExperiences] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [diplomes, setDiplomes] = useState([]); // Corrected state name to match variable from API
    const [langues, setLangues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // recuperation du formateur
    const fetchFormateur = async (idFormateur) => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const { data } = await axios.get(`/etp/projets/formateur/${idFormateur}/mini-cv`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`
                }
            });

            // Destructure the data directly
            const { form, experiences, diplomes, competences, langues, speciality } = data;

            // Update state variables
            setCompetences(competences);
            setExperiences(experiences);
            setDiplomes(diplomes); // Use setDiplomes here
            setLangues(langues);
            setForm(form);
            setSpeciality(speciality); // Set speciality

            setLoading(false);
        } catch (err) {
            console.warn("Erreur lors de la récupération du formateur:", err);
            setError(err.response?.data?.message || "Une erreur est survenue lors du chargement des données.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idFormateur) { // Only fetch if idFormateur is provided
            fetchFormateur(idFormateur);
        }
    }, [idFormateur]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                <p className="ml-4 text-sm text-gray-800">veuillez patientez...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full relative z-50 flex flex-col items-center justify-center bg-white p-4 text-red-600">
                <p className="text-xl font-semibold">{error}</p>
                <button
                    onClick={() => { fetchFormateur(idFormateur) }}
                    className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                    reessayer
                </button>
            </div>
        );
    }

    // Render nothing or a placeholder if form is empty and not loading/error
    // Using Object.keys(form).length to check if the object is populated
    if (Object.keys(form).length === 0 && !loading && !error) {
        return null; // Or a message like "Aucune donnée de formateur"
    }

    return (
        <div className="p-2">
            {/* Content */}
            <div className="w-full flex flex-col p-3 relative">
                <div className="w-full h-40 rounded-3xl p-4">
                    <div className="flex items-center gap-2">
                        <div className=" flex justify-center">
                            <div className="w-32 h-32 rounded-full p-2 overflow-hidden bg-gray-100">
                                {form.photo ? (
                                    <img
                                        src={`${import.meta.env.VITE_URL_IMAGE}/img/formateurs/${form.photo}`}
                                        alt="Aperçu"
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col justify-start items-start gap-1">
                                <h3 className="text-xl font-bold text-gray-700">{form.name} {form.firstName}</h3>
                                {/* Assuming 'speciality' is a string or has a 'name' property. Adjust as needed. */}
                                {speciality && (
                                    <p className="text-base text-gray-500">{speciality.form_titre}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coordonnées */}
            <div className="w-full text-left flex flex-col p-3 gap-y-6">
                <div className="p-3 border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                    <div className="grid grid-cols-6">
                        <div className="col-span-2">
                            <h5 className="text-sm font-semibold text-gray-600">Email :</h5>
                        </div>
                        <div className="col-span-4 text-right">
                            <p className="text-base text-gray-400">{form.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-6">
                        <div className="col-span-2">
                            <h5 className="text-sm font-semibold text-gray-600">Téléphone :</h5>
                        </div>
                        <div className="col-span-4 text-right">
                            <p className="text-base text-gray-400">{form.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Expériences & Formations (Diplômes) */}
                <div className="text-left p-3 border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                    <div className="flex justify-between ">
                        <h5 className="text-sm font-semibold text-gray-600">Expériences</h5>
                        <ul className="flex flex-col gap-y-1">
                            {experiences?.length > 0 ? (
                                experiences.map((exp, index) => (
                                    // Render specific properties of the experience object
                                    <li key={index} className="text-sm text-gray-500">
                                        • {exp.Fonction} à {exp.Lieu_de_stage} ({exp.Date_debut} - {exp.Date_fin})
                                    </li>
                                ))
                            ) : (
                                <li className="text-right text-gray-500 text-sm italic">Aucune expérience</li>
                            )}
                        </ul>
                    </div>
                    <div className="flex justify-between gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Formations / Diplômes</h5>
                        <ul className="flex flex-col gap-y-1">
                            {diplomes?.length > 0 ? ( // Use diplomes state here
                                diplomes.map((diplome, index) => (
                                    // Render specific properties of the diploma object
                                    <li key={index} className="text-sm text-gray-500">
                                        • {diplome.Diplome}  - {diplome.Ecole}
                                    </li>
                                ))
                            ) : (
                                <li className="text-right text-gray-500 text-sm italic">Aucune formation</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Compétences & Langues */}
                <div className="p-3 text-left border border-dashed border-gray-200 rounded-md flex flex-col gap-2">
                    <div className="flex justify-between gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Compétences</h5>
                        <ul className="flex flex-col gap-y-1">
                            {competences?.length > 0 ? (
                                competences.map((comp, index) => (
                                    // Assuming competences are strings or have a 'name' property
                                    <li key={index} className="text-sm text-gray-500">• {comp.Competence}</li>
                                ))
                            ) : (
                                <li className="text-right text-gray-500 text-sm italic">Aucune competences</li>
                            )}
                        </ul>
                    </div>
                    <div className="flex justify-between gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Langues</h5>
                        <ul className="flex flex-col items-start justify-start gap-y-1">
                            {langues?.length > 0 ? (
                                langues.map((lang, index) => (
                                    <li key={index} className="text-sm text-gray-500">
                                        • {lang.Langue}
                                    </li>
                                ))
                            ) : (
                                <li className="text-right text-gray-500 text-sm italic">Aucune langue</li>
                            )}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EtpFormateurDetail;