import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import axios from "axios";
import { API_URL, IMAGE_URL } from "../../../../config/env"; // Import axios

const FormateurDetail = ({ idProjet }) => {
    const [form, setForm] = useState({});
    const [speciality, setSpeciality] = useState({}); // Keep this as an object if it represents a single specialty
    const [experiences, setExperiences] = useState([]);
    const [competences, setCompetences] = useState([]);
    const [diplomes, setDiplomes] = useState([]); // Corrected state name to match variable from API
    const [langues, setLangues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formateurId, setFormateurId] = useState([]);
    const auth = useAuth();
    const idFormateur = (formateurId && formateurId.length > 0) ? formateurId[0] : null;
    const getFormbyProjet = async (idProjet) => {
        try {
            const { data } = await axios.get(`${API_URL}/cfp/projets/getFormAdded/${idProjet}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.token}`,
                },
            });
            setFormateurId(data.FormateursId);
        } catch (error) {
            console.error("Erreur lors de la récupération des entreprises:", error);
        }
    };

    // recuperation du formateur
    const fetchFormateur = async (idFormateur) => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            const { data } = await axios.get(`${API_URL}/cfp/projets/formateur/${idFormateur}/mini-cv`, {
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
            console.error("Erreur lors de la récupération du formateur:", err);
            setError(err.response?.data?.message || "Une erreur est survenue lors du chargement des données.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idFormateur) {
            fetchFormateur(idFormateur);
        }
    }, [idFormateur]);

    useEffect(() => {
        if (idProjet) {
            getFormbyProjet(idProjet);
        }
    }, [idProjet]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
                <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                <p className="ml-4 text-sm text-gray-800">veuillez patientez...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative z-50 flex flex-col items-center justify-center w-full p-4 text-red-600 bg-white">
                <p className="text-xl font-semibold">{error}</p>
                <button
                    onClick={() => { fetchFormateur(idFormateur) }}
                    className="px-6 py-2 mt-4 text-gray-800 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    reessayer
                </button>
            </div>
        );
    }


    if ((!form || Object.keys(form).length === 0) && !loading && !error) {
        return null;
    }

    return (
        <div className="p-2">
            {/* Content */}
            <div className="relative flex flex-col w-full p-3">
                <div className="w-full h-40 p-4 rounded-3xl">
                    <div className="flex items-center gap-2">
                        <div className="flex justify-center ">
                            <div className="w-32 h-32 p-2 overflow-hidden bg-gray-100 rounded-full">
                                {form.photo ? (
                                    <img
                                        src={`${IMAGE_URL}/img/formateurs/${form.photo}`}
                                        alt="Aperçu"
                                        className="object-cover w-32 h-32 rounded-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-col items-start justify-start gap-1">
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
            <div className="flex flex-col w-full p-3 text-left gap-y-6">
                <div className="flex flex-col gap-2 p-3 border border-gray-200 border-dashed rounded-md">
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
                <div className="flex flex-col gap-2 p-3 text-left border border-gray-200 border-dashed rounded-md">
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
                                <li className="text-sm italic text-right text-gray-500">Aucune expérience</li>
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
                                <li className="text-sm italic text-right text-gray-500">Aucune formation</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Compétences & Langues */}
                <div className="flex flex-col gap-2 p-3 text-left border border-gray-200 border-dashed rounded-md">
                    <div className="flex justify-between gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Compétences</h5>
                        <ul className="flex flex-col gap-y-1">
                            {competences?.length > 0 ? (
                                competences.map((comp, index) => (
                                    // Assuming competences are strings or have a 'name' property
                                    <li key={index} className="text-sm text-gray-500">• {comp.Competence}</li>
                                ))
                            ) : (
                                <li className="text-sm italic text-right text-gray-500">Aucune competences</li>
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
                                <li className="text-sm italic text-right text-gray-500">Aucune langue</li>
                            )}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormateurDetail;