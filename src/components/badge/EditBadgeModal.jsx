import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTimesCircle } from 'react-icons/fa';
import axios from '../../config/axios';
import toastr from 'toastr';
import { IMAGE_URL } from "../../config/env";

const EditBadgeModal = ({ isOpen, closeModal, badge }) => {
  const [editedBadge, setEditedBadge] = useState(badge || {});
  const [newCompetence, setNewCompetence] = useState('');
  const [newCritere, setNewCritere] = useState('');
  const [modules, setModules] = useState([]);

  useEffect(() => {
    setEditedBadge(badge || {});
  }, [badge]);

  useEffect(() => {
    if (!isOpen) return;

    if (badge?.idBadge) {
      axios.get(`/cfp/badge/${badge.idBadge}/edit`)
        .then(response => {
          if (response.data.status === 200) {
            const updatedBadge = {
              ...response.data.badge,
              criteres: response.data.criteres,
              competences: response.data.competences,
              idModule: response.data.badge.idModule
            };

            setEditedBadge(updatedBadge);
            setModules(response.data.modules || []);
          }
        })
        .catch(error => {
          console.error("Erreur API:", error);
        });
    }
  }, [badge, isOpen]);

  // ✅ On retourne null APRÈS les hooks
  if (!isOpen) return null;



  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBadge(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditedBadge(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddCritere = () => {
    if (newCritere.trim() === '') return;
    setEditedBadge(prev => ({
      ...prev,
      criteres: [...(prev.criteres || []), {
        texte_critere: newCritere.trim(),
        idCritere: null
      }]
    }));
    setNewCritere('');
  };

  const handleRemoveCritere = (index) => {
    const critere = editedBadge.criteres[index];
    setEditedBadge(prev => {
      const newCriteres = [...prev.criteres];
      newCriteres.splice(index, 1);

      // Si le critère avait un ID, on l'ajoute à la liste des suppressions
      const criteresToDelete = [...(prev.criteresToDelete || [])];
      if (critere.idCritere) {
        criteresToDelete.push(critere.idCritere);
      }

      return {
        ...prev,
        criteres: newCriteres,
        criteresToDelete
      };
    });
  };

  const handleAddCompetence = () => {
    if (newCompetence.trim() === '') return;
    setEditedBadge(prev => ({
      ...prev,
      competences: [...(prev.competences || []), {
        nom_competence: newCompetence.trim(),
        idCompetence: null
      }]
    }));
    setNewCompetence('');
  };

  const handleRemoveCompetence = (index) => {
    const competence = editedBadge.competences[index];
    setEditedBadge(prev => {
      const newCompetences = [...prev.competences];
      newCompetences.splice(index, 1);


      const competencesToDelete = [...(prev.competencesToDelete || [])];
      if (competence.idCompetence) {
        competencesToDelete.push(competence.idCompetence);
      }

      return {
        ...prev,
        competences: newCompetences,
        competencesToDelete
      };
    });
  };

  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: 6000,
    progressBar: true,
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Champs de base
      formData.append('idModule', editedBadge.idModule || '');
      formData.append('titre', editedBadge.titre || '');
      formData.append('sous_titre', editedBadge.sous_titre || '');
      formData.append('description', editedBadge.description || '');
      formData.append('a_propos', editedBadge.a_propos || '');

      // Image
      if (editedBadge.image instanceof File) {
        formData.append('image', editedBadge.image);
      }

      // Compétences
      editedBadge.competences?.forEach((comp, index) => {
        formData.append(`competences[${index}]`, comp.nom_competence);
        if (comp.idCompetence) {
          formData.append(`competences_id[${index}]`, comp.idCompetence);
        }
      });

      // Critères
      editedBadge.criteres?.forEach((critere, index) => {
        formData.append(`criteres[${index}]`, critere.texte_critere);
        if (critere.idCritere) {
          formData.append(`criteres_id[${index}]`, critere.idCritere);
        }
      });

      // Éléments à supprimer
      if (editedBadge.competencesToDelete?.length) {
        editedBadge.competencesToDelete.forEach((id, index) => {
          formData.append(`competences_to_delete[${index}]`, id);
        });
      }

      if (editedBadge.criteresToDelete?.length) {
        editedBadge.criteresToDelete.forEach((id, index) => {
          formData.append(`criteres_to_delete[${index}]`, id);
        });
      }


      // console.log('Données envoyées:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `/cfp/badge/${editedBadge.idBadge}/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        closeModal(true);
        toastr.success(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);

      }
    } catch (error) {
      if (error.response?.status === 422) {
        console.error("Erreurs de validation:", error.response.data.errors);

        const errors = error.response.data.errors;

        Object.values(errors).forEach(messages => {
          messages.forEach(message => {
            toastr.error(message);
          });
        });

      } else {
        console.error("Erreur:", error);
        toastr.error("Une erreur est survenue.");
      }
    }
  }

  const endpoint = IMAGE_URL;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

      <div
        className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        onClick={closeModal}
      ></div>


      <div className="relative z-10 w-full max-w-3xl mx-auto my-10 overflow-y-auto bg-white rounded-lg shadow-xl max-h-[90vh] p-6">

        <button
          type="button"
          className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
          onClick={closeModal}
        >
          <FaTimes className="text-2xl" />
        </button>

        <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Modifier le Badge</h3>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="badge_id" value={editedBadge?.idBadge || ''} />

          <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Titre du Badge</label>
                <input
                  type="text"
                  name="titre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ex: Développeur Full-Stack"
                  value={editedBadge.titre || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Sous titre du Badge</label>
                <input
                  type="text"
                  name="sous_titre"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ex: Niveau avancé"
                  value={editedBadge.sous_titre || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Formation</label>
                <select
                  name="idModule"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={editedBadge.idModule || ''}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une formation</option>
                  {modules.map(module => (
                    <option key={module.idModule} value={module.idModule}>{module.titre}</option>
                  ))}
                </select>
              </div>
            </div>


            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Description du Badge</label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Ce badge certifie la maîtrise des technologies..."
                value={editedBadge.description || ''}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Critères d'obtention */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Critères d'Obtention</label>
              <div className="space-y-2">
                {(editedBadge.criteres || []).map((critere, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                    <span>{critere.texte_critere}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCritere(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newCritere}
                  onChange={(e) => setNewCritere(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ajouter un critère..."
                />
                <button
                  type="button"
                  onClick={handleAddCritere}
                  className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Compétences */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Compétences & Technologies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editedBadge.competences || []).map((competence, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                    <span>{competence.nom_competence}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetence(index)}
                      className="ml-2 text-purple-500 hover:text-purple-700"
                    >
                      <FaTimesCircle />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newCompetence}
                  onChange={(e) => setNewCompetence(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Ajouter une technologie..."
                />
                <button
                  type="button"
                  onClick={handleAddCompetence}
                  className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
                >
                  <FaPlus />
                </button>
              </div>
            </div>


            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">À propos de cette certification</label>
              <textarea
                name="a_propos"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Cette certification atteste de la maîtrise des compétences..."
                value={editedBadge.a_propos || ''}
                onChange={handleChange}
              ></textarea>
            </div>


            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Image actuelle</label>
              <div className="w-16 h-16 overflow-hidden bg-gray-100 rounded-md">
                <img
                  className="object-cover w-full h-full"
                  src={editedBadge.image_path ? `${endpoint}/${editedBadge.image_path}` : ''}
                  alt="Badge"
                />
              </div>
            </div>

            {/* Nouvelle image */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nouvelle image (optionnel)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>


          <div className="mt-6 text-right">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 mr-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default EditBadgeModal;