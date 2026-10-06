import { MapPin, Users, Mail, Phone, Building2, User } from "lucide-react";
import LoadingSpinner from "../ui/loading-spinner";
import T from "../translate/AutoTranslator";
import { IMAGE_URL } from "../../config/env";

export default function ProjectRsvDetails({ rsv, loading }) {
  const imgUrl = IMAGE_URL + "/img/employes";

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
          <h3 className="text-lg font-semibold text-gray-900">
            {" "}
            <T>{title}</T>{" "}
          </h3>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mb-20">
      {/* En-tête du projet */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl text-white overflow-hidden shadow-lg">
        <div className="px-8 py-10">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{rsv.project_module_name}</h1>
            <div className="flex flex-wrap gap-6 text-indigo-100">
              <div>
                <span className="text-xs uppercase tracking-wider opacity-80">
                  <T>Référence</T>
                </span>
                <p className="text-sm font-medium">{rsv.project_reference}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider opacity-80">
                  <T>Type</T>
                </span>
                <p className="text-sm font-medium">{rsv.project_type}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider opacity-80">
                  <T>Période</T>
                </span>
                <p className="text-sm font-medium">
                  {rsv.project_start_date} - {rsv.project_end_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations entreprise */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900"></h2>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {rsv.etp_name || rsv.cfp_name || <T>Non renseigné</T>}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  <T>Email</T>
                </p>
                <p className="text-sm text-gray-900">
                  {rsv.etp_email || rsv.cfp_email || <T>Non renseigné</T>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  <T>Téléphone</T>
                </p>
                <p className="text-sm text-gray-900">
                  {rsv.etp_phone || rsv.cfp_phone || <T>Non renseigné</T>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  <T>Adresse</T>
                </p>
                <p className="text-sm text-gray-900">
                  {rsv.etp_addr_lot || <T>Non renseigné</T>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apprenants et Référents */}
      <div className="grid lg:grid-cols-2 gap-6">
        <InfoCard title="Apprenants" icon={Users}>
          {rsv?.apprenants && rsv.apprenants.length > 0 ? (
            <div className="space-y-3">
              {rsv.apprenants.map((apprenant, index) => (
                <div
                  key={apprenant.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {apprenant.prenom} {apprenant.nom}
                    </p>
                    <p className="text-sm text-gray-600">
                      {apprenant.fonction}
                    </p>
                    <p className="text-xs text-gray-500">{apprenant.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                <T>Aucun apprenant assigné</T>
              </p>
            </div>
          )}
        </InfoCard>

        <InfoCard title="Référent" icon={User}>
          {rsv?.referent && rsv.referent.length > 0 ? (
            <div className="space-y-4">
              {rsv.referent.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-green-50 border border-green-200 p-4 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {ref.prenom} {ref.nom}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {ref.fonction}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700">{ref.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700">{ref.telephone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                <T>Aucun référent assigné</T>
              </p>
            </div>
          )}
        </InfoCard>
      </div>
    </div>
  );
}
