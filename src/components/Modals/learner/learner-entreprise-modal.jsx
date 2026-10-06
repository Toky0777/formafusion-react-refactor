import { useState, useEffect } from "react";
import { useModal, MODAL_TYPES } from "../../../contexts/cfp/ModalContext";
import axios from "../../../config/axios";
import { useTranslation } from 'react-i18next';
import { IMAGE_URL } from "../../../config/env";

function LearnerEntrepriseModal({ isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const endpoint = IMAGE_URL;
    const { openModal } = useModal();
    const { content } = useModal();
    const [entreprise, setEntreprise] = useState(null);
    const [referents, setReferents] = useState([]);
    const [projects, setProjects] = useState({
        preparation: [],
        future: [],
        progress: [],
        finished: [],
        fenced: []
    });

    useEffect(() => {
        if (isOpen && content?.idEtp) {
            axios.get(`/cfp/etp-drawer/${content.idEtp}`)
                .then((response) => {
                    setEntreprise(response.data.customer);
                    setReferents(response.data.referents);
                    setProjects({
                        preparation: response.data.projects_in_preparation || [],
                        future: response.data.projects_future || [],
                        progress: response.data.projects_in_progress || [],
                        finished: response.data.projects_finished || [],
                        fenced: response.data.projects_fenced || []
                    });
                    console.log(response.data);

                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données :", error);
                });
        }
    }, [isOpen, content?.idEtp]);

    const handlePrevious = () => {
        onClose();
        openModal(MODAL_TYPES.BATCH_UPLOAD);
    };

    const handleNext = () => {
        onClose();
        openModal(MODAL_TYPES.BATCH_UPLOAD_STEP3);
    };

    if (!isOpen || !entreprise) return null;

    // Trouver le référent principal (premier de la liste ou selon votre logique)
    const referentPrincipal = referents.length > 0 ? referents[0] : null;
    const autresReferents = referents.length > 1 ? referents.slice(1) : [];

    const setting = JSON.parse(sessionStorage.getItem("setting"));
    const currency = setting?.currency_unit || '';


    return (
        <div className="fixed inset-0 z-50 transition-opacity duration-300 opacity-100 backdrop-custom-blur backdrop-brightness-75">
            <div onClick={onClose} className="absolute inset-0" />

            <div
                className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 translate-x-0`}
                style={{ width: "50%" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    <span className="absolute inline-flex items-center gap-2 top-1 right-1">
                        <a
                            onClick={onClose}
                            className="flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer hover:bg-gray-200"
                        >
                            <i className="text-gray-500 fa-solid fa-xmark"></i>
                        </a>
                    </span>

                    <div id="client_edit" className="flex flex-col w-full">
                        <div className="w-full p-3">
                            <div className="inline-flex items-center w-full gap-3">
                                <div className="w-[116px] h-[77px] bg-white flex items-center justify-center p-1">
                                    <img class="object-cover w-full h-auto rounded-xl" src={`${IMAGE_URL}/img/entreprises/${entreprise.logo} `} alt="photo" />

                                </div>
                                <div className="flex flex-col justify-start w-full gap-y-2">
                                    <h3 className="text-2xl font-bold text-left text-gray-700">{entreprise.customerName}</h3>
                                    <p className="text-base text-left text-gray-500">
                                        {entreprise.siteWeb || t('website')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full px-4">
                            <div>
                                <ul role="list" className="divide-y divide-gray-200">
                                    <div>
                                        <p className="text-xl font-semibold text-gray-900">{t('main_referent')}</p>
                                    </div>

                                    {referentPrincipal && (
                                        <li className="pt-3 pb-0 sm:pt-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="relative w-10 h-10 text-2xl font-bold text-center text-gray-500 bg-gray-200 rounded-full">
                                                        <i className="fa-solid fa-user"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 ms-4">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                        {referentPrincipal.name} {referentPrincipal.firstName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        <i className="text-sm fa-solid fa-envelope"></i>
                                                        {referentPrincipal.email || '--'}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        <i className="text-sm fa-solid fa-phone"></i>
                                                        {referentPrincipal.customerPhone || '--'}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {autresReferents.length > 0 && (
                                <div className="mt-4">
                                    <ul role="list" className="divide-y divide-gray-200">
                                        <div>
                                            <p className="text-xl font-semibold text-gray-900">{t('other_referents')}</p>
                                        </div>
                                        {autresReferents.map((referent, index) => (
                                            <li key={index} className="pt-3 pb-0 sm:pt-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="relative w-10 h-10 text-2xl font-bold text-center text-gray-500 bg-gray-200 rounded-full">
                                                            <i className="fa-solid fa-user"></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0 ms-4">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            <i className="text-sm fa-solid fa-user"></i>
                                                            {referent.firstName} {referent.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            <i className="text-sm fa-solid fa-envelope"></i>
                                                            {referent.email || '--'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            <i className="text-sm fa-solid fa-phone"></i>
                                                            {referent.customerPhone || '--'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Section "En préparation" */}

                            {projects.preparation.length > 0 && (
                                <>
                                    <div className="mt-4">
                                        <span className="px-3 py-1 font-semibold text-white bg-orange-500 shadow-sm text-md rounded-xl">{t('status_preparation')}</span>
                                    </div>
                                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow">
                                        <table className="min-w-full text-sm text-left table-auto">
                                            <thead className="text-gray-700 bg-orange-50">
                                                <tr className="border-b">
                                                    <th className="px-4 py-3">#</th>
                                                    <th className="px-4 py-3">{t('course')}</th>
                                                    <th className="px-4 py-3">Ref</th>
                                                    <th className="px-4 py-3">{t('place')}</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('amount')} ({currency})</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="fa-solid fa-money-bill-transfer"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('start_end')}</th>
                                                    <th className="px-4 py-3 text-center">{t('detail')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.preparation.map((project, index) => (
                                                    <tr key={`prep-${index}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.project_reference || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.ville || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-center">{project.total_apprenant || '0'}</td>
                                                        <td className="px-4 py-2">
                                                            {project.total_ht ? `${project.total_ht.toLocaleString()}  ${currency}` : ` 0 ${currency}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <i
                                                                className={`fa-solid ${project.isPaid === 5
                                                                    ? 'fa-circle-info text-yellow-500'
                                                                    : project.isPaid === 4
                                                                        ? 'fa-circle-check text-green-500'
                                                                        : project.isPaid === 6
                                                                            ? 'fa-circle-xmark text-red-400'
                                                                            : 'fa-circle-question text-gray-400'
                                                                    }`}
                                                                title={
                                                                    project.isPaid === 5
                                                                        ? 'Paiement partiel (statut spécial)'
                                                                        : project.isPaid === 4
                                                                            ? 'Complètement payé'
                                                                            : project.isPaid === 6
                                                                                ? 'Non payé'
                                                                                : 'Non facturé'
                                                                }
                                                                data-bs-toggle="tooltip"
                                                            ></i>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {project.date_debut && project.date_fin
                                                                ? `${project.date_debut} - ${project.date_fin}`
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <a
                                                                href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="opacity-50 fa-solid fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}


                            {/* Section "A venir" */}

                            {projects.future.length > 0 && (
                                <>
                                    <div className="mt-4">
                                        <span className="px-3 py-1 font-semibold text-white bg-blue-500 shadow-sm text-md rounded-xl"> {t('status_upcoming')}</span>
                                    </div>
                                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow">
                                        <table className="min-w-full text-sm text-left table-auto">
                                            <thead className="text-gray-700 bg-blue-50">
                                                <tr className="border-b">
                                                    <th className="px-4 py-3">#</th>
                                                    <th className="px-4 py-3">{t('course')}</th>
                                                    <th className="px-4 py-3">Ref</th>
                                                    <th className="px-4 py-3">{t('place')}</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('amount')} ({currency})</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="fa-solid fa-money-bill-transfer"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('start_end')}</th>
                                                    <th className="px-4 py-3 text-center">{t('detail')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.future.map((project, index) => (
                                                    <tr key={`future-${index}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.project_reference || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.ville || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-center">{project.total_apprenant || '0'}</td>
                                                        <td className="px-4 py-2">
                                                            {project.total_ht ? `${project.total_ht.toLocaleString()} ${currency}` : `0 ${currency}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <i
                                                                className={`fa-solid ${project.isPaid === 5
                                                                    ? 'fa-circle-info text-yellow-500'
                                                                    : project.isPaid === 4
                                                                        ? 'fa-circle-check text-green-500'
                                                                        : project.isPaid === 6
                                                                            ? 'fa-circle-xmark text-red-400'
                                                                            : 'fa-circle-question text-gray-400'
                                                                    }`}
                                                                title={
                                                                    project.isPaid === 5
                                                                        ? 'Paiement partiel (statut spécial)'
                                                                        : project.isPaid === 4
                                                                            ? 'Complètement payé'
                                                                            : project.isPaid === 6
                                                                                ? 'Non payé'
                                                                                : 'Non facturé'
                                                                }
                                                                data-bs-toggle="tooltip"
                                                            ></i>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {project.date_debut && project.date_fin
                                                                ? `${project.date_debut} - ${project.date_fin}`
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <a
                                                                href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="opacity-50 fa-solid fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}


                            {/* Section "En cours" */}

                            {projects.progress.length > 0 && (
                                <>
                                    <div className="mt-4">
                                        <span className="px-3 py-1 font-semibold text-white bg-blue-600 shadow-sm text-md rounded-xl">{t('status_in_progress')}</span>
                                    </div>
                                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow">
                                        <table className="min-w-full text-sm text-left table-auto">
                                            <thead className="text-gray-700 bg-blue-50">
                                                <tr className="border-b">
                                                    <th className="px-4 py-3">#</th>
                                                    <th className="px-4 py-3">{t('course')}</th>
                                                    <th className="px-4 py-3">Ref</th>
                                                    <th className="px-4 py-3">{t('place')}</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('amount')}({currency})</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="fa-solid fa-money-bill-transfer"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('start_end')}</th>
                                                    <th className="px-4 py-3 text-center">{t('detail')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.progress.map((project, index) => (
                                                    <tr key={`progress-${index}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.project_reference || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.ville || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-center">{project.total_apprenant || '0'}</td>
                                                        <td className="px-4 py-2">
                                                            {project.total_ht ? `${project.total_ht.toLocaleString()} ${currency} ` : `0 ${currency}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <i
                                                                className={`fa-solid ${project.isPaid === 5
                                                                    ? 'fa-circle-info text-yellow-500'
                                                                    : project.isPaid === 4
                                                                        ? 'fa-circle-check text-green-500'
                                                                        : project.isPaid === 6
                                                                            ? 'fa-circle-xmark text-red-400'
                                                                            : 'fa-circle-question text-gray-400'
                                                                    }`}
                                                                title={
                                                                    project.isPaid === 5
                                                                        ? 'Paiement partiel (statut spécial)'
                                                                        : project.isPaid === 4
                                                                            ? 'Complètement payé'
                                                                            : project.isPaid === 6
                                                                                ? 'Non payé'
                                                                                : 'Non facturé'
                                                                }
                                                                data-bs-toggle="tooltip"
                                                            ></i>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {project.date_debut && project.date_fin
                                                                ? `${project.date_debut} - ${project.date_fin}`
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <a
                                                                href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="opacity-50 fa-solid fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* Section "Terminé" */}

                            {projects.finished.length > 0 && (
                                <>
                                    <div className="mt-4">
                                        <span className="px-3 py-1 font-semibold text-white bg-green-500 shadow-sm text-md rounded-xl">
                                            {t('status_completed')}
                                        </span>
                                    </div>
                                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow">
                                        <table className="min-w-full text-sm text-left text-gray-700 bg-white table-auto">
                                            <thead className="text-xs tracking-wider text-gray-600 uppercase bg-gray-100">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3">#</th>
                                                    <th scope="col" className="px-4 py-3">{t('course')}</th>
                                                    <th scope="col" className="px-4 py-3">Ref</th>
                                                    <th scope="col" className="px-4 py-3">{t('place')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3">{t('amount')} ({currency})</th>
                                                    <th scope="col" className="px-4 py-3 text-center">
                                                        <i className="fa-solid fa-money-bill-transfer"></i>
                                                    </th>
                                                    <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                                    <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.finished.map((project, index) => (
                                                    <tr key={`finished-${index}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.project_reference || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.ville || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-center">{project.total_apprenant || '0'}</td>
                                                        <td className="px-4 py-2">
                                                            {project.total_ht ? `${project.total_ht.toLocaleString()} ${currency} ` : `0 ${currency}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <i
                                                                className={`fa-solid ${project.isPaid === 5
                                                                    ? 'fa-circle-info text-yellow-500'
                                                                    : project.isPaid === 4
                                                                        ? 'fa-circle-check text-green-500'
                                                                        : project.isPaid === 6
                                                                            ? 'fa-circle-xmark text-red-500'
                                                                            : 'fa-circle-question text-gray-400'
                                                                    }`}
                                                                title={
                                                                    project.isPaid === 5
                                                                        ? 'Paiement partiel (statut spécial)'
                                                                        : project.isPaid === 4
                                                                            ? 'Complètement payé'
                                                                            : project.isPaid === 6
                                                                                ? 'Non payé'
                                                                                : 'Non facturé'
                                                                }
                                                                data-bs-toggle="tooltip"
                                                            ></i>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {project.date_debut && project.date_fin
                                                                ? `${project.date_debut} - ${project.date_fin}`
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <a
                                                                href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                <i className="transition fa-solid fa-eye opacity-70 hover:opacity-100"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}


                            {/* Section "Clôturé" */}

                            {projects.fenced.length > 0 && (
                                <>
                                    <div className="mt-4">
                                        <span className="px-3 py-1 font-semibold text-white bg-gray-600 shadow-sm text-md rounded-xl">{t('status_closed')}</span>
                                    </div>
                                    <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow">
                                        <table className="min-w-full text-sm text-left table-auto">
                                            <thead className="text-gray-700 bg-gray-100">
                                                <tr className="border-b">
                                                    <th className="px-4 py-3">#</th>
                                                    <th className="px-4 py-3">{t('course')}</th>
                                                    <th className="px-4 py-3">Ref</th>
                                                    <th className="px-4 py-3">{t('place')}</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="text-sm fa-solid fa-user"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('amount')} ({currency})</th>
                                                    <th className="px-4 py-3 text-center">
                                                        <i className="fa-solid fa-money-bill-transfer"></i>
                                                    </th>
                                                    <th className="px-4 py-3">{t('start_end')}</th>
                                                    <th className="px-4 py-3 text-center">{t('detail')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projects.fenced.map((project, index) => (
                                                    <tr key={`fenced-${index}`} className="border-t hover:bg-gray-50">
                                                        <td className="px-4 py-2">{index + 1}</td>
                                                        <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.project_reference || 'N/A'}</td>
                                                        <td className="px-4 py-2">{project.ville || 'N/A'}</td>
                                                        <td className="px-4 py-2 text-center">{project.total_apprenant || '0'}</td>
                                                        <td className="px-4 py-2">
                                                            {project.total_ht ? `${project.total_ht.toLocaleString()} ${currency} ` : `0 ${currency}`}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <i
                                                                className={`fa-solid ${project.isPaid === 5
                                                                    ? 'fa-circle-info text-yellow-500'
                                                                    : project.isPaid === 4
                                                                        ? 'fa-circle-check text-green-500'
                                                                        : project.isPaid === 6
                                                                            ? 'fa-circle-xmark text-red-400'
                                                                            : 'fa-circle-question text-gray-400'
                                                                    }`}
                                                                title={
                                                                    project.isPaid === 5
                                                                        ? 'Paiement partiel (statut spécial)'
                                                                        : project.isPaid === 4
                                                                            ? 'Complètement payé'
                                                                            : project.isPaid === 6
                                                                                ? 'Non payé'
                                                                                : 'Non facturé'
                                                                }
                                                                data-bs-toggle="tooltip"
                                                            ></i>
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {project.date_debut && project.date_fin
                                                                ? `${project.date_debut} - ${project.date_fin}`
                                                                : 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-2 text-center">
                                                            <a
                                                                href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <i className="opacity-50 fa-solid fa-eye"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LearnerEntrepriseModal;