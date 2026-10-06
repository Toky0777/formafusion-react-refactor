import { Lightbulb, Pencil, Trash2, Eye } from "lucide-react"
import { Link } from "react-router-dom";
export default function Accueil() {

    return (
        <>
            <div className="px-4 sm:px-6 md:px-10 py-6">

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase text-center mb-6">
                    Introduction à la Documentation d’Aide
                </h2>

                <div className="max-w-3xl mx-auto  p-4 sm:p-6 ">
                    <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                        Cette section a été conçue pour vous guider pas à pas dans l’utilisation de notre plateforme, produit ou service.
                        Que vous soyez débutant ou utilisateur avancé, vous y trouverez des instructions claires, des conseils pratiques et
                        des solutions aux problèmes les plus courants.
                    </p>

                    <p className="text-gray-700 mb-3 font-medium text-sm sm:text-base">
                        Notre objectif est de vous permettre de :
                    </p>

                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                        <li>Comprendre rapidement les fonctionnalités disponibles.</li>
                        <li>Trouver facilement des réponses à vos questions.</li>
                        <li>Résoudre efficacement les difficultés que vous pourriez rencontrer.</li>
                    </ul>
                </div>

                <div>
                    <h1 className="text-gray-700">Cette logiciel est composée de huit (8) grandes étapes: <b>MarketPlace</b>, <b>Business Intelligence</b>, <b>Dossier FMFP</b>, <b>Gestion des Utilisateurs</b>, <b> Formation & contenu</b>, <b>Suivi & Présence</b>, <b>Gestion Administrative</b>, <b>Evaluations</b></h1>
                </div>

                <div>
                    <h1 className="text-gray-700 mt-3">Chaque étapes comprends plusieurs microservice :</h1>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>MarketPlace :</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/cours_en_ligne">Catalogue en ligne</Link></li>
                            <li><Link to="/cfp/reservation">Réservation</Link></li>
                            <li> <Link to="/cfp/loyalty_rewards/list">Loyalité and Rewards</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Business Intelligence :</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/analytic">Analytics</Link></li>
                            <li><Link to="/cfp/reporting">Reporting</Link></li>
                            <li> <Link to="/cfp/ca/ca_projet">Analyse de chiffre d'affaire</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Dossier FMFP :</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/fmfp/en_soumission">En soumission</Link></li>
                            <li><Link to="/cfp/fmfp/en_execution">En cours d'execution</Link></li>
                            <li> <Link to="/cfp/fmfp/cloture">Cloturé</Link></li>
                        </ul>
                    </div>


                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Gestion des Utilisateurs :</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/apprenant">Apprenants</Link></li>
                            <li><Link to="/cfp/formateur">Formateurs</Link></li>
                            <li> <Link to="/cfp/sous_traitant">Sous-traitants</Link></li>
                            <li> <Link to="/cfp/utilisateurs">Administrateurs</Link></li>
                            <li> <Link to="/cfp/client">Clients</Link></li>
                            <li> <Link to="/cfp/particulier/list">Particuliers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Formation et Contenu :</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/catalogue">Catalogue Interne</Link></li>
                            <li><Link >Projets</Link></li>
                            <li> <Link to="/cfp/refresh/module">LMS</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Suivi et Présence:</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/presence">Présence</Link></li>
                            <li><Link to="/cfp/agenda">Agenda</Link></li>
                            <li> <Link to="/cfp/lieu_salle">Lieu et Salle</Link></li>
                            <li> <Link to="/cfp/materiel">Gestion des matériels</Link></li>
                            <li> <Link to="/cfp/badge">Badges</Link></li>
                            <li> <Link to="/cfp/disponibilite_de_formateur">Disponiblité de Formateur</Link></li>
                            <li> <Link to="/cfp/disponibilite_de_materiel">Disponiblité de matériel</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Gestion Administrative:</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/dossier">Dossiers</Link></li>
                            <li><Link to="/cfp/proforma">Devis</Link></li>
                            <li> <Link to="/cfp/bon-commande">Vos bon de commande</Link></li>
                            <li> <Link to="/cfp/facture">Factures</Link></li>
                            <li> <Link to="/cfp/recouvrement">Recouvrement</Link></li>
                            <li> <Link to="/cfp/photos">Photos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-gray-700 mt-3"><b>Evaluations:</b> </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li> <Link to="/cfp/evaluation_a_chaud">Evaluations Chaud</Link></li>
                            <li><Link to="/cfp/evaluation/froids">Evaluations Froid</Link></li>
                            <li> <Link to="/cfp/skill_matrix/projets">Skill Matrix</Link></li>
                            <li> <Link to="/cfp/prequal">Pre-qual</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md">
                    <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                        Sur ce site, certaines icônes permettent des actions rapides sur les éléments :
                    </p>
                    <ul className="text-gray-700 list-disc list-inside space-y-3">
                        <li className="flex items-center">
                            <Pencil className="mr-2 text-gray-600" /> : sert à modifier un élément.
                        </li>
                        <li className="flex items-center">
                            <Trash2 className="mr-2 text-gray-600" /> : sert à supprimer un élément.
                        </li>
                        <li className="flex items-center">
                            <Eye className="mr-2 text-gray-600" /> : sert à voir les détails.
                        </li>
                    </ul>
                </div>

                <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md ">
                    <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                        <span className="text-red-500 ">Remarque :</span>  Tous les prix et données chiffrées dans cette documentation sont fictifs et utilisés uniquement à titre d’exemple.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
                        <p className="text-gray-700 text-sm sm:text-base font-semibold">
                            Questions fréquemment posées :
                        </p>
                    </div>

                    <ul className="list-disc list-inside mt-2 space-y-2 text-blue-600 text-sm sm:text-base">
                        <li>
                            <Link to="doc_catalogue" className="hover:underline">
                                Comment créer un cours dans le Catalogue Interne?
                            </Link>
                        </li>
                        <li>
                            <Link to="doc_projet/creation/intra" className="hover:underline">
                                Comment créer un cours dans le Projet Intra ?
                            </Link>
                        </li>
                        <li>
                            <Link to="doc_projet/creation/inter" className="hover:underline">
                                Comment créer un cours dans le Projet Inter ?
                            </Link>
                        </li>
                        <li>
                            <Link to="doc_projet/status" className="hover:underline">
                                Explication des status dans le Projet
                            </Link>
                        </li>
                        <li>
                            <Link to="doc_projet/detail" className="hover:underline">
                                Détails et Actions à faire dans un Projet
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

        </>
    );
}
