import { useState } from "react";
import Sidebar from "./RightSidebar";

const Help = () => {
  const [active, setActive] = useState("employés");

  const renderContent = () => {
    switch (active) {
      case "employés":
           return (
              <div className="p-4">
                  <h2 className="text-xl font-semibold mb-3">Aide sur le menu Employés</h2>

                  <p className="text-gray-600 mb-3">
                    Cette section vous guide dans la gestion des comptes internes de votre organisation. 
                    Vous apprendrez comment créer, modifier et supprimer des employés, ainsi que gérer leurs rôles et permissions.
                  </p>

                  <p className="text-gray-600 mb-6">
                    Suivez ces étapes pour administrer vos employés de manière efficace et sécurisée :
                  </p>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Accéder à la page employés
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Allez dans le menu et cliquez sur la section <span className="font-bold">"Employés"</span>.</li>
                        <li>La page affichera toutes les employés existantes.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Créer un nouvel employé
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Cliquez sur le bouton <span className="font-bold">"Ajouter un employé"</span>.</li>
                        <li>Remplissez les informations requises : nom, email, rôle et mot de passe.</li>
                        <li>Cliquez sur <span className="font-bold">"Enregistrer"</span> pour créer le compte.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Modifier un employé existant
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Dans la liste des employés, trouvez l’employé à modifier.</li>
                        <li>Cliquez sur l’icône <span className="font-bold">"Éditer"</span> à côté de son nom.</li>
                        <li>Modifiez les informations nécessaires (nom, rôle, permissions, etc.)</li>
                        <li>Enregistrez les modifications en cliquant sur <span className="font-bold">"Mettre à jour"</span>.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        4
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Supprimer un employé
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Dans la liste des employés, trouvez l’employé à supprimer.</li>
                        <li>Cliquez sur l’icône <span className="font-bold">"Supprimer"</span>.</li>
                        <li>Confirmez la suppression lorsque le message de confirmation apparaît.</li>
                      </ul>
                    </div>
                  </div>
                </div>

            );
      case "centre de formation" : 
           return (
              <div className="p-4">
                  <h2 className="text-xl font-semibold mb-3">Aide sur le menu centre de formation</h2>

                  <p className="text-gray-600 mb-3">
                    Cette section vous guide dans la gestion des comptes internes de votre organisation. 
                    Vous apprendrez comment créer, modifier et supprimer des employés, ainsi que gérer leurs rôles et permissions.
                  </p>

                  <p className="text-gray-600 mb-6">
                    Suivez ces étapes pour administrer vos employés de manière efficace et sécurisée :
                  </p>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Accéder à la page centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Allez dans le menu et cliquez sur la section <span className="font-bold">"Centre de formation"</span>.</li>
                        <li>La page affichera toutes les centres de formation existantes.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Créer un nouveau centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Cliquez sur le bouton <span className="font-bold">"Ajouter un centre de formation"</span>.</li>
                        <li>Remplissez les informations requises : nom, email, rôle et mot de passe.</li>
                        <li>Cliquez sur <span className="font-bold">"Enregistrer"</span> pour créer le compte.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Supprimer un centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Dans la liste des centres de formation, trouvez le centre de formation à supprimer.</li>
                        <li>Cliquez sur l’icône <span className="font-bold">"Supprimer"</span>.</li>
                        <li>Confirmez la suppression lorsque le message de confirmation apparaît.</li>
                      </ul>
                    </div>
                  </div>
                </div>

            );
      case "agenda" :
            return (
              <div className="p-4">
                  <h2 className="text-xl font-semibold mb-3">Aide sur le menu centre de formation</h2>

                  <p className="text-gray-600 mb-3">
                    Cette section vous guide dans la gestion des comptes internes de votre organisation. 
                    Vous apprendrez comment créer, modifier et supprimer des employés, ainsi que gérer leurs rôles et permissions.
                  </p>

                  <p className="text-gray-600 mb-6">
                    Suivez ces étapes pour administrer vos employés de manière efficace et sécurisée :
                  </p>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Accéder à la page agenda
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Allez dans le menu et cliquez sur la section <span className="font-bold">"Agenda"</span>.</li>
                        <li>La page affichera toutes les seances existantes sur un calendrier.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Créer un nouveau centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Cliquez sur le bouton <span className="font-bold">"Ajouter un centre de formation"</span>.</li>
                        <li>Remplissez les informations requises : nom, email, rôle et mot de passe.</li>
                        <li>Cliquez sur <span className="font-bold">"Enregistrer"</span> pour créer le compte.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Supprimer un centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Dans la liste des centres de formation, trouvez le centre de formation à supprimer.</li>
                        <li>Cliquez sur l’icône <span className="font-bold">"Supprimer"</span>.</li>
                        <li>Confirmez la suppression lorsque le message de confirmation apparaît.</li>
                      </ul>
                    </div>
                  </div>
                </div>

            );
      case "dossier" :
             return (
              <div className="p-4">
                  <h2 className="text-xl font-semibold mb-3">Aide sur le menu centre de formation</h2>

                  <p className="text-gray-600 mb-3">
                    Cette section vous guide dans la gestion des comptes internes de votre organisation. 
                    Vous apprendrez comment créer, modifier et supprimer des employés, ainsi que gérer leurs rôles et permissions.
                  </p>

                  <p className="text-gray-600 mb-6">
                    Suivez ces étapes pour administrer vos employés de manière efficace et sécurisée :
                  </p>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Accéder à la page Vos dossiers
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Allez dans le menu et cliquez sur la section <span className="font-bold">"Vos dossiers"</span>.</li>
                        <li>La page affichera toutes les dossiers existantes.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Créer un nouveau centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Cliquez sur le bouton <span className="font-bold">"Ajouter un centre de formation"</span>.</li>
                        <li>Remplissez les informations requises : nom, email, rôle et mot de passe.</li>
                        <li>Cliquez sur <span className="font-bold">"Enregistrer"</span> pour créer le compte.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Supprimer un centre de formation
                      </h3>
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                        <li>Dans la liste des centres de formation, trouvez le centre de formation à supprimer.</li>
                        <li>Cliquez sur l’icône <span className="font-bold">"Supprimer"</span>.</li>
                        <li>Confirmez la suppression lorsque le message de confirmation apparaît.</li>
                      </ul>
                    </div>
                  </div>
                </div>

            );
      case "photo" :
           return (
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-3">Aide sur l'ajout de photo</h2>

                <p className="text-gray-600 mb-3">
                  Cette section vous guide pour ajouter des photos dans votre application. 
                  Vous apprendrez comment accéder à la page photo, sélectionner et téléverser une nouvelle photo avec une description.
                </p>

                <p className="text-gray-600 mb-6">
                  Suivez ces étapes pour ajouter vos photos de manière simple et rapide :
                </p>

                <div className="mb-6">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Accéder à la page Photo
                    </h3>
                  </div>
                  <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                      <li>Allez dans le menu et cliquez sur la section <span className="font-bold">"Photo"</span>.</li>
                      <li>La page affichera toutes les photos existantes.</li>
                      <li>Cliquez sur le bouton <span className="font-bold">"Ajouter une photo"</span> pour commencer.</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-lg font-bold shadow-md">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Téléverser une nouvelle photo
                    </h3>
                  </div>
                  <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <ul className="list-disc list-inside text-gray-700 border border-gray-200 rounded-lg p-3 bg-white">
                      <li>Dans la fenêtre d’ajout, remplissez le champ <span className="font-bold">Photo</span> pour sélectionner votre fichier.</li>
                      <li>Remplissez le champ <span className="font-bold">Description</span> pour ajouter des informations sur la photo.</li>
                      <li>Cliquez sur le bouton <span className="font-bold">"Télécharger"</span> pour ajouter la photo à la galerie.</li>
                    </ul>
                  </div>
                </div>
              </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active} setActive={setActive} />

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Aide & Support</h1>

          {/* Barre de recherche */}
          <div className="relative w-full sm:w-64 mt-3 sm:mt-0">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
              />
            </svg>
          </div>
        </div>

        {/* Contenu dynamique */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Help;
