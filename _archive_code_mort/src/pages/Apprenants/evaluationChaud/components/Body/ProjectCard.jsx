import React, { useState } from 'react';
import { MapPin, Clock, Users, FileText, Star, Eye, MoreVertical, Building } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const [showStudents, setShowStudents] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-blue-500';
      case 'terminé':
        return 'bg-green-500';
      case 'clôturé':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'intra':
        return 'text-blue-700 bg-blue-50';
      case 'inter':
        return 'text-purple-700 bg-purple-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getModalityColor = (modality) => {
    switch (modality.toLowerCase()) {
      case 'présentielle':
        return 'text-cyan-700 bg-cyan-50';
      case 'distanciel':
        return 'text-orange-700 bg-orange-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 group">
      <div className="grid grid-cols-12 gap-6">
        {/* Contenu principal */}
        <div className="col-span-12 lg:col-span-6">
          <div className="space-y-4">
            {/* Titre et référence */}
            <div className="flex items-start gap-3">
              <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 hover:text-violet-600 cursor-pointer transition-colors">
                {project.title}
              </h3>
              {project.reference && (
                <span className="text-sm text-gray-500 italic">
                  Ref: {project.reference}
                </span>
              )}
            </div>

            {/* Dates */}
            <p className="text-gray-600">
              Du <span className="font-semibold text-gray-800">{project.startDate}</span> au{' '}
              <span className="font-semibold text-gray-800">{project.endDate}</span>
            </p>

            {/* Localisation */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="line-clamp-1 hover:underline cursor-pointer">
                {project.location}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 line-clamp-2">{project.description}</p>

            {/* Statistiques */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">{project.duration}</span>
                <span className="text-gray-500">Hrs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">{project.sessions}</span>
                <span className="text-gray-500">Ses</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">{project.documents}</span>
                <span className="text-gray-500">Docs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges et métadonnées */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(project.type)}`}>
                {project.type}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${getModalityColor(project.modality)}`}>
                {project.modality}
              </span>
              <span className="px-3 py-1 text-sm rounded-full text-gray-600 bg-gray-50">
                {project.financing}
              </span>
            </div>

            {/* Participants et formateur */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {project.students.slice(0, 3).map((student, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600"
                      >
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="w-full h-full rounded-full" />
                        ) : (
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    ))}
                    {project.students.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center text-sm font-medium text-white">
                        +{project.students.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {project.instructor && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {project.instructor.avatar ? (
                        <img src={project.instructor.avatar} alt={project.instructor.name} className="w-full h-full rounded-full" />
                      ) : (
                        project.instructor.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dossier client */}
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-sm hover:underline cursor-pointer">
                {project.client.name}
              </span>
            </div>
          </div>
        </div>

        {/* Actions et informations */}
        <div className="col-span-12 lg:col-span-3">
          <div className="space-y-4">
            {/* Évaluation */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(project.rating)}
              </div>
              <span className="text-gray-600 font-medium">{project.rating.toFixed(1)}</span>
              <span className="text-gray-400">({project.reviews} avis)</span>
            </div>

            {/* Statut et actions */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 text-sm rounded-full text-white ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Prix et client */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prix</span>
                <span className="font-bold text-gray-800">{project.price}</span>
              </div>
              <div className="flex justify-end">
                {project.client.logo ? (
                  <img src={project.client.logo} alt={project.client.name} className="h-8 w-auto rounded grayscale hover:grayscale-0 transition-all" />
                ) : (
                  <div className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600">
                    {project.client.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table des étudiants (collapsible) */}
      {showStudents && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">Nom</th>
                  <th className="text-left py-2 text-gray-600">Présence</th>
                  <th className="text-left py-2 text-gray-600">Notation</th>
                  <th className="text-center py-2 text-gray-600">Skills</th>
                </tr>
              </thead>
              <tbody>
                {project.students.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                    </td>
                    <td className="py-2">
                      <div className="flex">{renderStars(4)}</div>
                    </td>
                    <td className="py-2 text-center">--</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};