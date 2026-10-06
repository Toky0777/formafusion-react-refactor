

import { useModal, MODAL_TYPES } from "../../../contexts/cfp/ModalContext";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../../config/axios";
import { useTranslation } from 'react-i18next';
import { IMAGE_URL } from "../../../config/env";

function EntrepriseModal({ isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const { openModal } = useModal();
    const endpoint = IMAGE_URL;


    const { content } = useModal();
    const [user, setUser] = useState(null);
    const [referent, setReferent] = useState([]);
    const [projects, setProjects] = useState({ preparation: [], future: [], progress: [], finished: [], fenced: [] });

    useEffect(() => {
        if (isOpen) {
            axios.get(`/cfp/etp-drawers/apprenant/${content.idEmploye}`)
                .then((response) => {
                    // console.log(response.data);
                    setUser(response.data.user);
                    // console.log(response.data.user);
                    setReferent([]);
                    // console.log([]);
                    setProjects({
                        preparation: response.data.projects_in_preparation || [],
                        future: response.data.projects_future || [],
                        progress: response.data.projects_in_progress || [],
                        finished: response.data.projects_finished || [],
                        fenced: response.data.projects_fenced || [],
                    });
                    // console.log({
                    //   preparation: response.data.projects_in_preparation || [],
                    //   future: response.data.projects_future || [],
                    //   progress: response.data.projects_in_progress || [],
                    //   finished: response.data.projects_finished || [],
                    //   fenced: response.data.projects_fenced || [],
                    // });
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des données :", error);
                });
        }
    }, [isOpen]);


    const handlePrevious = () => {
        onClose();
        openModal(MODAL_TYPES.BATCH_UPLOAD);
    };

    const handleNext = () => {
        onClose();
        openModal(MODAL_TYPES.BATCH_UPLOAD_STEP3);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 transition-opacity duration-300 opacity-100 backdrop-custom-blur backdrop-brightness-75">
            <div onClick={onClose} className="absolute inset-0" />

            <div
                className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-300 translate-x-0`}
                style={{ width: "50%" }}
                onClick={(e) => e.stopPropagation()}
            >

                <div>
                    <ul role="list" className="divide-y divide-gray-200">
                        <div className="flex items-center justify-between p-4 shadow-sm">
                            <p className="text-lg font-medium text-gray-500">{t('employee')}</p>
                        </div>

                        {user && (
                            <li key={user.name} className="pt-3 pb-0 sm:pt-4">

                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {user.photo ? (

                                            <img src={`${endpoint}/img/employes/${user.photo}`}
                                                alt="photo" className="relative object-cover w-24 h-24 text-2xl font-semibold text-gray-600 bg-gray-200 rounded-full" />
                                        ) : (
                                            <div className="relative w-24 h-24 text-2xl font-bold text-center text-gray-500 bg-gray-200 rounded-full">
                                                <p className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                                    {user.name?.charAt(0) || 'U'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 ms-4">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            <i className="text-sm fa-solid fa-user"></i> {user.name} {user.firstName}  ({user.fonction ? user.fonction : t('not_specified')})
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            <i className="text-sm fa-solid fa-envelope"></i> {user.email || t('not_specified')}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            <i className="text-sm fa-solid fa-phone"></i> {user.phone || t('not_specified')}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            <i className="text-sm fa-solid fa-address-card"></i> {user.matricule || t('not_specified')}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            <i className="text-sm fa-solid fa-house-circle-check"></i> {user.customerName || t('not_specified')}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )}

                    </ul>
                </div>





                {/* Section "En préparation" */}
                {projects.preparation.length > 0 && (
                    <>
                        <div className="mt-4" id="title_learner_in_preparation">
                            <span className="px-3 py-1 font-semibold text-white bg-orange-500 shadow-sm text-md rounded-xl">{t('status_preparation')}</span>
                        </div>
                        <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow" id="project_in_preparation">
                            <table className="min-w-full text-sm text-left table-auto">
                                <thead className="text-gray-700 bg-orange-50">
                                    <tr className="border-b">
                                        <th scope="col" className="px-4 py-3">#</th>
                                        <th scope="col" className="px-4 py-3">{t('course')}</th>
                                        <th scope="col" className="px-4 py-3">Ref</th>
                                        <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                        <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.preparation.map((project, index) => (
                                        <tr key={`preparation-${index}`} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.reference || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.date_debut ? `${project.date_debut} - ${project.date_fin}` : 'N/A'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <a href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}>
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
                        <div className="mt-4" id="title_learner_future">
                            <span className="px-3 py-1 font-semibold text-white bg-blue-500 shadow-sm text-md rounded-xl"> {t('status_upcoming')} </span>
                        </div>
                        <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow" id="project_future">
                            <table className="min-w-full text-sm text-left table-auto">
                                <thead className="text-gray-700 bg-blue-50">
                                    <tr className="border-b">
                                        <th scope="col" className="px-4 py-3">#</th>
                                        <th scope="col" className="px-4 py-3">{t('course')}</th>
                                        <th scope="col" className="px-4 py-3">Ref</th>
                                        <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                        <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.future.map((project, index) => (
                                        <tr key={`future-${index}`} className="border-t hover:bg-gray-50">

                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.reference || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.date_debut ? `${project.date_debut} - ${project.date_fin}` : 'N/A'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <a href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}>
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
                        <div className="mt-4" id="title_learner_in_progress">
                            <span className="px-3 py-1 font-semibold text-white bg-blue-600 shadow-sm text-md rounded-xl">{t('status_in_progress')}</span>
                        </div>
                        <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow" id="project_in_progress">
                            <table className="min-w-full text-sm text-left table-auto">
                                <thead className="text-gray-700 bg-blue-50">
                                    <tr className="border-b">
                                        <th scope="col" className="px-4 py-3">#</th>

                                        <th scope="col" className="px-4 py-3">{t('course')}</th>
                                        <th scope="col" className="px-4 py-3">Ref</th>
                                        <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                        <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.progress.map((project, index) => (
                                        <tr key={`progress-${index}`} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.reference || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.date_debut ? `${project.date_debut} - ${project.date_fin}` : 'N/A'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <a href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}>
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

                {/* Section "Terminée" */}
                {projects.finished.length > 0 && (
                    <>
                        <div className="mt-4 ml-4" id="title_learner_finished">
                            <span className="px-3 py-1 font-semibold text-white bg-green-500 shadow-sm text-md rounded-xl">{t('status_completed')}</span>
                        </div>
                        <div className="mt-2 ml-4 w-[900px] overflow-x-auto rounded-lg shadow border border-gray-200" id="project_finished">
                            <table className="min-w-full text-sm text-left text-gray-700 bg-white table-auto">
                                <thead className="text-xs tracking-wider text-gray-600 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">#</th>
                                        <th scope="col" className="px-4 py-3">{t('course')}</th>
                                        <th scope="col" className="px-4 py-3">Ref</th>
                                        <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                        <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.finished.map((project, index) => (
                                        <tr key={`finished-${index}`} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.reference || 'N/A'}</td>
                                            <td>{project.date_debut ? `${project.date_debut} - ${project.date_fin}` : 'N/A'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <a href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}>
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

                {/* Section "Clôturé" */}
                {projects.fenced.length > 0 && (
                    <>
                        <div className="mt-4" id="title_learner_fenced">
                            <span className="px-3 py-1 font-semibold text-white bg-gray-600 shadow-sm text-md rounded-xl">{t('status_closed')}</span>
                        </div>
                        <div className="mt-2 overflow-x-auto border border-gray-200 rounded-lg shadow" id="project_fenced">
                            <table className="table min-w-full text-sm text-left text-gray-700 bg-white table-auto table-hover table-sm">
                                <thead className="text-gray-700 bg-gray-100">
                                    <tr className="border-b">
                                        <th scope="col" className="px-4 py-3">#</th>
                                        <th scope="col" className="px-4 py-3">{t('course')}</th>
                                        <th scope="col" className="px-4 py-3">Ref</th>
                                        <th scope="col" className="px-4 py-3">{t('start_end')}</th>
                                        <th scope="col" className="px-4 py-3 text-center">{t('detail')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.fenced.map((project, index) => (
                                        <tr key={`fenced-${index}`} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{project.module_name || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.reference || 'N/A'}</td>
                                            <td className="px-4 py-2">{project.date_debut ? `${project.date_debut} - ${project.date_fin}` : 'N/A'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <a href={`https://projet.mg.formafusion.io/cfp/projets/${project.id_projet}`}>
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
    );
}

export default EntrepriseModal;