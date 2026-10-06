import { useState, useEffect } from 'react';
import axios from '../../../config/axios';
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';

const CreateBadge = ({ initialErrors = [] }) => {

  const [formData, setFormData] = useState({
    idModule: '',
    titre: '',
    sous_titre: '',
    description: '',
    a_propos: '',
    image: null
  });

  const navigate = useNavigate();
  const [criteres, setCriteres] = useState(['']);
  const [competences, setCompetences] = useState([]);
  const [newCompetence, setNewCompetence] = useState('');

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('/cfp/badge/getModules');
        if (response.data.status === 200) {
          setModules(response.data.modules);
        } else {
          setErrors(['Aucun module disponible']);
        }
      } catch (error) {
        setErrors(['Erreur lors du chargement des modules']);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };


  const handleAddCritere = () => setCriteres([...criteres, '']);
  const handleRemoveCritere = (index) => {
    setCriteres(criteres.filter((_, i) => i !== index));
  };
  const handleCritereChange = (value, index) => {
    const updated = [...criteres];
    updated[index] = value;
    setCriteres(updated);
  };


  const handleAddCompetence = () => {
    if (newCompetence.trim() !== '') {
      setCompetences([...competences, newCompetence.trim()]);
      setNewCompetence('');
    }
  };

  toastr.options = {
    positionClass: "toast-top-center", // ou "toast-bottom-left"
    timeOut: 6000,
    progressBar: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const data = new FormData();
      data.append('idModule', formData.idModule);
      data.append('titre', formData.titre);
      data.append('sous_titre', formData.sous_titre);
      data.append('description', formData.description);
      data.append('a_propos', formData.a_propos);
      data.append('image', formData.image);

      criteres.forEach(critere => {
        data.append('criteres[]', critere);
      });

      competences.forEach(competence => {
        data.append('competences[]', competence);
      });

      const response = await axios.post('/cfp/badge', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        setSuccessMessage('Badge créé avec succès !');

        toastr.success("Badge créé avec succès !");
        setTimeout(() => {
          navigate('/cfp/badge');
        }, 1200);

        setFormData({
          idModule: '',
          titre: '',
          sous_titre: '',
          description: '',
          a_propos: '',
          image: null
        });
        setCriteres(['']);
        setCompetences([]);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors(Object.values(error.response.data.errors).flat());
        } else {
          setErrors([error.response.data.message || 'Une erreur est survenue']);
        }
      } else {
        setErrors(['Erreur de connexion au serveur']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow px-4 py-6 bg-gray-100 animate-fadeIn">
      <div className="mx-auto max-w-7xl">

        <div className="px-6 py-6 text-white bg-gradient-to-r from-fuchsia-900 to-purple-700 sm:px-8 rounded-xl">
          <h2 className="flex items-center text-2xl font-bold">
            <i className="mr-3 fa-solid fa-award"></i> Créer un Nouveau Badge
          </h2>
          <p className="mt-1 ">Concevez une certification numérique professionnelle</p>
        </div>

        {/* Messages d'erreur */}
        {errors.length > 0 && (
          <div className="p-4 mt-4 mb-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
            <ul className="pl-5 space-y-1 list-disc">
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          </div>
        )}

        {/* Message de succès */}
        {successMessage && (
          <div className="p-4 mt-4 mb-4 text-green-800 bg-green-100 border border-green-300 rounded-lg">
            {successMessage}
          </div>
        )}


        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="p-6 mb-8 bg-white shadow-xl rounded-2xl">
            <h2 className="flex items-center mb-6 text-xl font-bold text-gray-800">
              <i className="mr-2 text-indigo-600 fa-solid fa-pencil"></i> Informations du Badge
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Titre du Badge*</label>
                  <input
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Ex: Développeur Full-Stack"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Sous titre du Badge*</label>
                  <input
                    name="sous_titre"
                    value={formData.sous_titre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                    placeholder="Ex: Expert React & Laravel"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Formation*</label>
                  <select
                    name="idModule"
                    value={formData.idModule}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                    required
                  >
                    <option value="">{loadingModules ? "Chargement..." : "Sélectionnez un module"}</option>
                    {modules.map((module) => (
                      <option key={module.idModule} value={module.idModule}>
                        {module.moduleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description du Badge*</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Ce badge certifie la maîtrise..."
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Critères d'Obtention*</label>
                <div className="space-y-2">
                  {criteres.map((critere, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        name="criteres[]"
                        value={critere}
                        onChange={(e) => handleCritereChange(e.target.value, index)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                        placeholder="Ex: Réalisation d'un projet..."
                        required
                      />
                      {criteres.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveCritere(index)}
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center mt-2 text-indigo-600 hover:text-indigo-800"
                  onClick={handleAddCritere}
                >
                  <i className="mr-1 fas fa-plus-circle"></i> Ajouter un critère
                </button>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Compétences & Technologies</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {competences.map((comp, index) => (
                    <span key={index} className="px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded-full">
                      {comp}
                      <button
                        type="button"
                        className="ml-1 text-indigo-500 hover:text-indigo-800"
                        onClick={() => setCompetences(competences.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newCompetence}
                    onChange={(e) => setNewCompetence(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm"
                    placeholder="Ajouter une technologie..."
                  />
                  <button
                    type="button"
                    onClick={handleAddCompetence}
                    className="px-4 py-3 text-white rounded-r-lg bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:bg-indigo-700"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Image du Badge*</label>
                <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                    <div className="flex items-center">
                      <label htmlFor="image" className="font-bold text-indigo-600 cursor-pointer hover:text-indigo-800">
                        Télécharger un fichier
                      </label>
                      <p className="pl-1 text-gray-600">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, SVG jusqu'à 2MB
                    </p>
                    {formData.image && (
                      <p className="mt-2 text-sm text-gray-600">
                        Fichier sélectionné: {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mb-8 bg-white border-t border-gray-300 shadow-md rounded-xl">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-800">
              <i className="mr-2 text-indigo-600 fas fa-info-circle"></i>
              <span>À propos de cette certification</span>
            </h3>
            <textarea
              name="a_propos"
              rows="4"
              value={formData.a_propos}
              onChange={handleInputChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Cette certification atteste de la maîtrise des compétences en développement web full-stack selon les standards de l'industrie..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="reset"
              className="px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => {
                setFormData({
                  idModule: '',
                  titre: '',
                  sous_titre: '',
                  description: '',
                  a_propos: '',
                  image: null
                });
                setCriteres(['']);
                setCompetences([]);
                setErrors([]);
              }}
            >
              Réinitialiser le formulaire
            </button>
            <button
              type="submit"
              className="px-6 py-3 font-medium text-white transition-shadow duration-300 rounded-lg bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="mr-2 fas fa-spinner fa-spin"></i>En cours...
                </>
              ) : (
                <>
                  <i className="mr-2 fas fa-save"></i>Enregistrer le Badge
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateBadge;