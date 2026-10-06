import { useEffect, useState } from 'react';
import { X, User, Mail, Phone, GraduationCap, Briefcase, Award, Languages, Star } from 'lucide-react';
import axios from '../../../../../../config/axios';
import { IMAGE_URL } from "../../../../../../config/env";

const TrainerProfileDrawer = ({ idTrainer, onClose }) => {
  const [ trainer, setTrainer ] = useState({})
  const [ experiences, setExperiences ] = useState([])
  const [ competences, setCompetences ] = useState([])
  const [ diplomes, setDiplomes ] = useState([])
  const [ langues, setLangues ] = useState([])
  const [ specialities, setSpecialities ] = useState({})
  
  const DataRequest = async() => {
    try {
      const { data } = await axios.get(`employes/projets/${idTrainer}/mini-cv`, {
      })
      console.log(data);
      setTrainer(data.form)
      setExperiences(data.experiences)
      setCompetences(data.competences)
      setDiplomes(data.diplomes)
      setLangues(data.langues)
      setSpecialities(data.specialities)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    DataRequest();
  }, [])

  const trainerData = {
    name: "Formateurs tests",
    title: "",
    avatar: `${IMAGE_URL}/img/formateurs/67fd0bb7914c9.webp`,
    email: "formateurstests4@gmail.com",
    phone: "0332902428",
    experiences: [],
    formations: [],
    competences: [],
    langues: []
  };

  const InfoCard = ({ icon: Icon, title, children, iconColor = "text-blue-600", bgColor = "bg-blue-50" }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className={`${bgColor} px-6 py-4 border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-white rounded-lg shadow-sm`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const EmptyState = ({ message, icon: Icon }) => (
    <div className="text-center py-6">
      <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">À propos du formateur</h2>
                <p className="text-emerald-100 text-sm">Profil et compétences</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            >
              <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Trainer Profile Header */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={`${IMAGE_URL}/img/formateurs/${trainer.photo}`} 
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-700 rounded-full border-4 border-white flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {trainer.name}
                  </h3>
                  {trainer.firstName && (
                    <p className="text-lg text-gray-600 mb-4">
                      {trainer.firstName}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Formateur actif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <InfoCard 
              icon={Mail} 
              title="Informations de contact"
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-semibold">{trainer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Téléphone</p>
                    <p className="text-gray-900 font-semibold">{trainer.phone}</p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Experience and Education */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoCard 
                icon={Briefcase} 
                title="Expériences professionnelles"
                iconColor="text-purple-600"
                bgColor="bg-purple-50"
              >
                {experiences.length === 0 ? (
                  <EmptyState 
                    message="Aucune expérience renseignée"
                    icon={Briefcase}
                  />
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 font-medium">{exp}</p>
                      </div>
                    ))}
                  </div>
                )}
              </InfoCard>

              <InfoCard 
                icon={GraduationCap} 
                title="Formations et diplômes"
                iconColor="text-indigo-600"
                bgColor="bg-indigo-50"
              >
                {diplomes.length === 0 ? (
                  <EmptyState 
                    message="Aucun diplôme renseigné"
                    icon={GraduationCap}
                  />
                ) : (
                  <div className="space-y-3">
                    {diplomes.map((formation, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 font-medium">{formation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Skills and Languages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InfoCard 
                icon={Award} 
                title="Compétences"
                iconColor="text-orange-600"
                bgColor="bg-orange-50"
              >
                {competences.length === 0 ? (
                  <EmptyState 
                    message="Aucune compétence renseignée"
                    icon={Award}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {competences.map((competence, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {competence}
                      </span>
                    ))}
                  </div>
                )}
              </InfoCard>

              <InfoCard 
                icon={Languages} 
                title="Compétences linguistiques"
                iconColor="text-teal-600"
                bgColor="bg-teal-50"
              >
                {langues.length === 0 ? (
                  <EmptyState 
                    message="Aucune compétence linguistique renseignée"
                    icon={Languages}
                  />
                ) : (
                  <div className="space-y-3">
                    {langues.map((langue, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-900 font-medium">{langue.name}</span>
                        <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                          {langue.level}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfileDrawer;