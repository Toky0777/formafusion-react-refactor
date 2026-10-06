
import React from "react";

const Inacces = () => {
  return (
    <div className="flex-grow  bg-[#f8f7ff]">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {/* Header */}
          <div className="px-6 py-6 text-white bg-gradient-to-r from-purple-600 to-indigo-600 sm:px-8">
            <h1 className="flex items-center text-2xl font-bold">
              <i className="mr-3 fa-solid fa-award"></i>

              <span>Système de Badges de Compétences</span>
            </h1>
            <p className="mt-1 opacity-80">
              Reconnaissance et validation des compétences professionnelles
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center gap-10 md:flex-row">
              {/* Illustration */}
              <div className="flex justify-center flex-shrink-0 w-full md:w-1/3">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center animate-float">
                    <i className="text-indigo-600 fa-solid fa-award text-8xl opacity-80 animate-float-slow"></i>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 sm:text-2xl">
                  Accès réservé aux référents de formation
                </h2>

                <div className="p-4 mb-6 border-l-4 bg-amber-50 border-amber-500">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <i className="fa-solid fa-circle-info text-amber-500 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        La gestion des badges de compétences est actuellement accessible uniquement aux référents des centres de formation professionnelle. Cette fonctionnalité sera étendue aux autres utilisateurs prochainement.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-4 text-gray-600">
                  Notre système de badges de compétences permet de reconnaître et de valoriser les acquis professionnels suite à des formations certifiantes. Ces badges numériques constituent une preuve vérifiable de vos compétences, que vous pourrez partager sur vos réseaux professionnels.
                </p>

                <div className="p-5 mb-6 border border-purple-200 rounded-lg bg-purple-50">
                  <h3 className="mb-2 font-medium text-purple-800">Comment recevoir votre badge ?</h3>
                  <p className="text-purple-700">
                    Après validation de votre formation, vous recevrez automatiquement une notification par e-mail contenant votre badge numérique. Vous pourrez alors le télécharger et le partager sur votre CV ou profil LinkedIn.
                  </p>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="pt-10 mt-16 border-t">
              <h2 className="mb-6 text-xl font-semibold text-center text-gray-800">
                Les avantages des badges de compétences
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-5 transition bg-white border border-gray-200 rounded-lg hover:shadow-md">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full">
                    <i className="text-indigo-600 fa-solid fa-certificate"></i>
                  </div>
                  <h3 className="mb-2 font-medium text-gray-800">Certification numérique</h3>
                  <p className="text-gray-600">
                    Obtenez une preuve numérique vérifiable de vos compétences acquises lors des formations.
                  </p>
                </div>

                <div className="p-5 transition bg-white border border-gray-200 rounded-lg hover:shadow-md">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 rounded-full">
                    <i className="text-purple-600 fa-solid fa-share-nodes"></i>
                  </div>
                  <h3 className="mb-2 font-medium text-gray-800">Visibilité professionnelle</h3>
                  <p className="text-gray-600">
                    Partagez facilement vos réussites et compétences sur vos réseaux professionnels.
                  </p>
                </div>

                <div className="p-5 transition bg-white border border-gray-200 rounded-lg hover:shadow-md">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full">
                    <i className="text-indigo-600 fa-solid fa-shield-halved"></i>
                  </div>
                  <h3 className="mb-2 font-medium text-gray-800">Sécurité et authenticité</h3>
                  <p className="text-gray-600">
                    Chaque badge est unique et peut être vérifié par des tiers pour confirmer son authenticité.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="p-6 mt-12 bg-gray-50 rounded-xl">
              <h3 className="mb-4 text-lg font-medium text-gray-800">Questions fréquentes</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-700">Quand vais-je recevoir mon badge ?</h4>
                  <p className="mt-1 text-gray-600">Les badges sont généralement envoyés dans les 48 heures suivant la validation complète de votre formation.</p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-700">Comment partager mon badge sur LinkedIn ?</h4>
                  <p className="mt-1 text-gray-600">Vous trouverez des instructions détaillées dans l'email de notification qui accompagne votre badge.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Que faire si je n'ai pas reçu mon badge ?</h4>
                  <p className="mt-1 text-gray-600">Contactez votre centre de formation ou notre service support via le formulaire de contact disponible sur notre site.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inacces;
