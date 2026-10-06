import { Link, useNavigate, useParams } from "react-router-dom";
import { FileText, CheckCircle2, Users, User, ArrowRight } from "lucide-react";

const RequestType = () => {
  const { idModule } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 min-h-screen">
      <div className="mx-auto px-4">
        {/* Bouton Retour */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            ← Retour
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Nous sommes ravis que cette formation vous intéresse
            </h1>
            <p className="text-blue-50 text-lg max-w-2xl mx-auto">
              Demandez des informations complémentaires pour la formation
              sélectionnée
            </p>
          </div>

          <div className="px-8 py-10">
            <div className="grid gap-4 mb-10">
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-semibold text-green-900">
                    Aucun engagement
                  </span>{" "}
                  - C'est un premier contact, sans obligation
                </p>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  <span className="font-semibold text-blue-900">
                    Réponse personnalisée
                  </span>{" "}
                  - Quelques questions pour mieux vous connaître
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Choisissez votre type de demande
              </h2>

              <div className="space-y-4">
                <Link
                  to={`/devis/company/${idModule}`}
                  className="group block w-full bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                        <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Formation en entreprise
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pour mettre en place une formation pour vos équipes
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link
                  to={`/devis/individual/${idModule}`}
                  className="group block w-full bg-white border-2 border-cyan-200 hover:border-cyan-500 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-cyan-100 group-hover:bg-cyan-500 rounded-lg flex items-center justify-center transition-colors">
                        <User className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Formation individuelle
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pour une demande de devis à titre personnel
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Vous recevrez une réponse personnalisée sous 48 heures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestType;
