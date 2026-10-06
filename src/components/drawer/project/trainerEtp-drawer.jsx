import { AnimatePresence, motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import StarRating from "../../ui/StarRating";
import { IMAGE_URL } from "../../../config/env";

/**
 * Drawer formateur partagé (Etp + Formateur).
 * `scrollable` : limite la hauteur du bloc d'en-tête (variante Formateur).
 */
export function TrainerDrawer({ data , onClose, scrollable = false }) {
  const { idFormateur, idProjet, formateur = [] , formateurDetail } = data;

  console.log(formateurDetail);
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[40000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full max-w-4xl bg-white shadow-xl overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between w-full px-4 py-4 bg-gray-100 border-b">
              <h2 className="text-xl font-semibold text-gray-700">
                À propos du formateur
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                >
                  <FaXmark className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-6">
              {/* Section Profil */}
              <div className={`w-full p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl ${scrollable ? "max-h-[60vh] overflow-y-auto" : ""}`}>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-lg">
                    <img
                      src={
                        formateurDetail?.form?.photo
                          ? `${IMAGE_URL}/img/formateurs/${formateurDetail.form.photo}`
                          : "/api/placeholder/128/128"
                      }
                      alt={`${formateurDetail?.form?.firstName || ""} ${formateurDetail?.form?.name || ""}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-3xl font-bold text-gray-800">
                      {formateurDetail?.form?.firstName} {formateurDetail?.form?.name}
                    </h3>
                    <p className="text-lg text-gray-600">Formateur Expert</p>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h4 className="mb-4 text-xl font-semibold text-gray-800">
                  Informations de contact
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Email :</span>
                    <span className="text-gray-500">{formateurDetail?.form?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-600">Téléphone :</span>
                    <span className="text-gray-500">{formateurDetail?.form?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Expériences et Formations */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Expériences */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-xl font-semibold text-gray-800">Expériences</h4>
                  {formateurDetail?.form_has?.experiences?.length > 0 ? (
                    formateurDetail.form_has?.experiences.map((exp, index) => (
                      <div key={index} className="py-2 pl-4 border-l-4 border-blue-500">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-700">{exp.Fonction}</h5>
                            <p className="text-gray-500">{exp.Lieu_de_stage}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-400">
                            {exp.Date_debut} - {exp.Date_fin}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-400">Aucune expérience renseignée</p>
                  )}
                </div>

                {/* Formations */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-xl font-semibold text-gray-800">Formations</h4>
                  {formateurDetail?.form_has?.diplomes?.length > 0 ? (
                    formateurDetail.form_has?.diplomes.map((diplome, index) => (
                      <div key={index} className="py-2 pl-4 border-l-4 border-green-500">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h5 className="font-semibold text-gray-700">{diplome.Diplome}</h5>
                            <p className="text-gray-500">{diplome.Ecole}</p>
                          </div>
                          <span className="text-sm font-medium text-gray-400">
                            {diplome.Date_debut} - {diplome.Date_fin}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-400">Aucune formation renseignée</p>
                  )}
                </div>
              </div>

              {/* Compétences et Langues */}
              <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                {/* Compétences */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-xl font-semibold text-gray-800">Compétences</h4>
                  {formateurDetail?.form_has?.competences?.length > 0 ? (
                    formateurDetail.form_has?.competences.map((comp, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{comp.Competence}</span>
                        <StarRating rating={comp.note} />
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-400">Aucune compétence renseignée</p>
                  )}
                </div>

                {/* Langues */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-xl font-semibold text-gray-800">Langues</h4>
                  {formateurDetail?.form_has?.langues?.length > 0 ? (
                    formateurDetail.form_has?.langues.map((langue, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{langue.Langue}</span>
                        <StarRating rating={langue.note} />
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-400">Aucune langue renseignée</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
