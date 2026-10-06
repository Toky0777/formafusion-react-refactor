import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { NavBar } from "../../../components/Navbar/NavBar"
import axios from "axios"
import { useStateContext } from "../../Context/ContextProvider"
import AlertMessage from "../../../components/Body/AlertMessage"
import { LoadingScreen } from "../../../components/Body/LoadingScreen"
// import AnswerInput from "../../components/Body/CreateAnswer."

// Composant pour gérer l'upload et l'affichage des images
const ImageUploadSection = ({ questionId, existingImage = null, onImageUpload, onImageDelete, onImageChange }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [currentImage, setCurrentImage] = useState(existingImage)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await onImageUpload(questionId, file)

      if (result.success) {

        setCurrentImage({
          id: result.imageId,
          url: result.urls[0]
        })
      }
    } catch (error) {
      console.error('Erreur upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async () => {
    if (!currentImage || !confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return

    try {
      const success = await onImageDelete(currentImage.id)
      if (success) {
        setCurrentImage(null)
      }
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentImage) return

    setIsUploading(true)
    try {
      const result = await onImageChange(currentImage.id, file)
      if (result.success) {
        setCurrentImage(prev => ({ ...prev, url: result.urls[0] }))
      }

    } catch (error) {
      console.error('Erreur changement:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (currentImage) {
    return (
      <div className="relative flex-shrink-0 image-preview-container">
        <img 
          src={currentImage.url} 
          alt="Image question" 
          className={`w-12 h-12 object-cover rounded ${isUploading ? 'opacity-50' : ''}`}
        />
        {isUploading && (
          <div className="absolute w-6 h-6 border-t-2 border-b-2 border-gray-900 rounded-full top-3 left-3 animate-spin"></div>
        )}
        <button 
          type="button" 
          onClick={handleImageDelete}
          className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-white bg-red-500 rounded-full hover:bg-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          type="button" 
          onClick={() => document.getElementById(`change-image-${questionId}`).click()}
          className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <input 
          id={`change-image-${questionId}`}
          type="file" 
          className="hidden" 
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
    )
  }

  return (
    <label className="flex items-center justify-center flex-shrink-0 w-12 h-12 p-2 text-gray-600 transition bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
      {isUploading ? (
        <div className="w-6 h-6 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )}
      <input 
        type="file" 
        className="hidden" 
        onChange={handleFileChange}
        accept="image/*"
      />
    </label>
  )
}

// Composant pour une question éditable
const EditableQuestion = ({ 
  question, 
  questionIndex, 
  typeQcms, 
  categories,
  onQuestionUpdate, 
  onQuestionDelete, 
  onResponseAdd, 
  onResponseUpdate, 
  onResponseDelete,
  onImageUpload,
  onImageDelete,
  onImageChange
}) => {
  const [responses, setResponses] = useState(question.reponses_questions || [])
  
  const handleQuestionChange = (field, value) => {
    onQuestionUpdate(question.idQuestion, { ...question, [field]: value })
  }

  const handleAddResponse = () => {
    const newResponse = {
      idReponse: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID plus unique
      idQuestion: question.idQuestion,
      categorie_id: '',
      texteReponse: '',
      explicationReponse: '',
      points: '',
    }
    setResponses(prev => [...prev, newResponse])
    onResponseAdd(question.idQuestion, newResponse)
  }

  const handleUpdateResponse = (responseId, updatedResponse) => {
    setResponses(prev => 
      prev.map(r => r.idReponse === responseId ? updatedResponse : r)
    )
    onResponseUpdate(question.idQuestion, responseId, updatedResponse)
  }

  const handleDeleteResponse = (responseId) => {
    setResponses(prev => prev.filter(r => r.idReponse !== responseId)) // CORRIGÉ : utiliser idReponse
    onResponseDelete(question.idQuestion, responseId)
  }

  return (
    <div className="p-6 bg-violet-50 rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <h5 className="text-lg font-semibold text-violet-900">Q{questionIndex + 1} :</h5>
        <input
          type="text"
          name={`questions[${question.idQuestion}][texteQuestion]`}
          value={question.texteQuestion || ''}
          onChange={(e) => handleQuestionChange('texteQuestion', e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
        <select
          name={`questions[${question.idQuestion}][idTypeQcmQuestion]`}
          value={question.idTypeQcmQuestion || ''}
          onChange={(e) => handleQuestionChange('idTypeQcmQuestion', e.target.value)}
          className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        >
          <option value="">Type du question</option>
          {typeQcms.map(type => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>
        
        <ImageUploadSection
          questionId={question.idQuestion}
          existingImage={question.image}
          onImageUpload={onImageUpload}
          onImageDelete={onImageDelete}
          onImageChange={onImageChange}
        />
        
        <button 
          type="button" 
          onClick={() => onQuestionDelete(question.idQuestion)}
          className="text-gray-500 transition-colors duration-200 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {responses.map((response) => (
          <EditableResponse
            key={response.idReponse}
            questionId={question.idQuestion}
            response={{...response, idReponse: response.idReponse}}
            categories={categories}
            onUpdate={handleUpdateResponse}
            onDelete={handleDeleteResponse}
          />
        ))}
        
        <button 
          type="button" 
          onClick={handleAddResponse}
          className="flex items-center font-medium transition-colors duration-200 text-violet-600 hover:text-violet-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Ajouter une réponse
        </button>
      </div>
    </div>
  )
}

// Composant pour une réponse éditable
const EditableResponse = ({ 
  questionId, 
  response, 
  categories, 
  onDelete, 
  onUpdate 
}) => {
  const handleChange = (field, value) => {
    onUpdate(response.idReponse, { ...response, [field]: value })
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="grid items-center grid-cols-12 gap-4">
        <div className="col-span-1">
          <input type="radio" value={questionId} name={`questions[${questionId}][responses][${response.id}][idQuestion]`} disabled className="w-4 h-4 border-gray-300 text-violet-600 focus:ring-violet-500" />
        </div>
        <div className="col-span-3">
          <input
            type="text"
            name={`questions[${questionId}][responses][${response.id}][texteReponse]`}
            value={response.texteReponse || ''}
            onChange={(e) => handleChange('texteReponse', e.target.value)}
            placeholder="Réponse"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div className="col-span-3">
          <input
            type="text"
            name={`questions[${questionId}][responses][${response.id}][explicationReponse]`}
            value={response.explicationReponse || ''}
            onChange={(e) => handleChange('explicationReponse', e.target.value)}
            placeholder="Explication"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="number"
              name={`questions[${questionId}][responses][${response.id}][points]`}
              value={response.points ?? ''}
              onChange={(e) => handleChange('points', e.target.value)}
              placeholder="Points"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
            <span className="ml-2 text-sm text-gray-600">Pts</span>
          </div>
        </div>
        <div className="col-span-2">
          <select
            name={`questions[${questionId}][responses][${response.id}][categorie_id]`}
            value={response.categorie_id || ''}
            onChange={(e) => handleChange('categorie_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="">Sans catégorie</option>
              {categories.map((category) => (
                <option key={category.idCategorie} value={category.idCategorie}>
                  {category.nomCategorie}
                </option>
              ))}
          </select>
        </div>
        <div className="col-span-1">
          <button 
            type="button" 
            onClick={() => onDelete(response.idReponse)} // CORRIGÉ : passer idReponse au lieu de response.id
            className="text-gray-500 transition-colors duration-200 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}


export default function EditQcm() {
  const { id } = useParams()
  const { token, api_base_url } = useStateContext()
  const [questionOpen, setQuestionOpen] = useState(false)
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [typeQcms, setTypeQcms] = useState([])
  const [qcmData, setQcmData] = useState({})
  const [ domaines, setDomaines ] = useState([])
  const [ qcmTitle, setQcmTitle ] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate()

  // Fonction générique pour gérer les changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQcmData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonctions pour la gestion des images
  const handleImageUpload = async (questionId, file) => {
    const formData = new FormData()
    formData.append("myFile[]", file)

    try {
      const response = await axios.post(`${api_base_url}qcm/question/${questionId}/upload-image`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      console.error('Erreur upload image:', error)
      throw error
    }
  }

  const handleImageDelete = async (imageId) => {
    try {
      const {data} = await axios.delete(`${api_base_url}qcm/question-image/${imageId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return data.success
    } catch (error) {
      console.error('Erreur suppression image:', error)
      throw error
    }
  }

  const handleImageChange = async (imageId, file) => {
    const formData = new FormData()
    formData.append("myFile[]", file)

    try {
      await axios.post(`${api_base_url}qcm/question-image/${imageId}/replace`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      console.error('Erreur changement image:', error)
      throw error
    }
  }

  // Fonctions pour la gestion des questions
  const handleAddNewQuestion = () => {
    const newQuestion = {
      idQuestion: `new_${Date.now()}`,
      texteQuestion: '',
      idTypeQcmQuestion: '',
      reponses_questions: []
    }
    setQuestions(prev => [...prev, newQuestion])
  }

  const handleQuestionUpdate = (questionId, updatedQuestion) => {
    setQuestions(prev =>
      prev.map(q => q.idQuestion === questionId ? updatedQuestion : q)
    )
  }

  const handleQuestionDelete = (questionId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      setQuestions(prev => prev.filter(q => q.idQuestion !== questionId))
    }
  }

  // Fonctions pour la gestion des réponses - CORRIGÉES
 const handleResponseAdd = (questionId, newResponse) => {
  setQuestions(prevQuestions => 
    prevQuestions.map(question => 
      question.idQuestion === questionId
        ? {
            ...question,
            reponses_questions: [
              ...(question.reponses_questions || []), newResponse
            ]
          }
        : question
    )
  );
};

  const handleResponseUpdate = (questionId, responseId, updatedResponse) => {
  setQuestions(prevQuestions => 
    prevQuestions.map(question => 
      question.idQuestion === questionId
        ? {
            ...question,
            reponses_questions: (question.reponses_questions || []).map(response =>
              response.idReponse === responseId // CORRECTION : utiliser idReponse
                ? {
                    ...response,
                    ...updatedResponse, // CORRECTION : spread tout l'objet mis à jour
                    updatedAt: new Date().toISOString()
                  }
                : response
            )
          }
        : question
    )
  );
};

const handleResponseDelete = (questionId, responseId) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) { // Ajout de confirmation
    setQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question.idQuestion === questionId
          ? {
              ...question,
              reponses_questions: (question.reponses_questions || []).filter(
                response => response.idReponse !== responseId // DÉJÀ CORRECT
              )
            }
          : question
      )
    );
  }
};

  const DataRequest = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`${api_base_url}qcm/${id}/edit`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setQuestions(data.qcm.questions_qcm)
      setCategories(data.all_categories_reponses)
      setQcmData(data.qcm)
      setDomaines(data.all_domaines)
      // Supposons que les types de QCM sont aussi dans la réponse
      setTypeQcms(data.typeQcms)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    DataRequest()
  }, [])

  const handleClickInfoButton = () => {
    setQuestionOpen(false)
  }

  const handleClickQuestionButton = () => {
    setQuestionOpen(true)
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  setIsLoading(true);
  
  try {
    // Préparation des données à envoyer
    const formData = {
      intituleQCM: qcmData.intituleQCM,
      descriptionQCM: qcmData.descriptionQCM,
      idDomaine: qcmData.idDomaine,
      prixUnitaire: qcmData.prixUnitaire,
      duree: qcmData.duree,
      points: qcmData.points,
      questions: questions.map(question => ({
        idQuestion: question.idQuestion,
        texteQuestion: question.texteQuestion,
        idTypeQcmQuestion: question.idTypeQcmQuestion,
        reponses_questions: (
          question.reponses_questions || 
          question.responses || 
          []
        ).map(response => ({
          idReponse: response.idReponse,
          idQuestion: response.idQuestion,
          categorie_id: response.categorie_id,
          texteReponse: response.texteReponse,
          explicationReponse: response.explicationReponse,
          points: response.points,
        }))
      })),
      updatedAt: new Date().toISOString()
    };

    // Validation des données avant envoi
    if (!formData.intituleQCM || !formData.intituleQCM.trim()) {
      throw new Error('Le titre du QCM est requis');
    }
    
    if (formData.questions.length === 0) {
      throw new Error('Au moins une question est requise');
    }

    // Vérification que chaque question a au moins une réponse
    for (const question of formData.questions) {
      if (!question.texteQuestion || !question.texteQuestion.trim()) {
        throw new Error('Toutes les questions doivent avoir un texte');
      }
      
      if (question.reponses_questions.length === 0) {
        throw new Error(`La question "${question.texteQuestion}" doit avoir au moins une réponse`);
      }
    }

    // Envoi de la requête
    await axios.post(`${api_base_url}qcm/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // ✅ SUCCESS - Structure correcte
    setNotification({
      type: 'success', 
      message: 'Test modifié avec succès!', 
      show: true
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
    
    navigate('/qcm/index');

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    
    // ✅ GESTION D'ERREURS CORRIGÉE
    let errorMessage = 'Une erreur inattendue est survenue.';
    
    if (error.response) {
      // Erreur de réponse du serveur
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data?.error;
      
      switch (status) {
        case 400:
          errorMessage = `Données invalides: ${serverMessage || 'Vérifiez vos données'}`;
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorMessage = 'QCM non trouvé.';
          break;
        case 422:
          errorMessage = `Erreur de validation: ${serverMessage || 'Données incorrectes'}`;
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${status}: ${serverMessage || 'Une erreur est survenue'}`;
      }
    } else if (error.request) {
      // Erreur de connexion
      errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
    } else if (error.message) {
      // Erreur de validation locale
      errorMessage = error.message;
    }

    // ✅ AFFICHAGE D'ERREUR UNIFORME
    setNotification({
      type: 'error', 
      message: errorMessage, 
      show: true
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
    
  } finally {
    setIsLoading(false);
  }
};
  
  return (
    <>
      <NavBar />
      <AlertMessage type={notification.type} message={notification.message} visible={notification.show}/>
      {isLoading && <LoadingScreen />}
      <div className="pt-20 mt-4 bg-gradient-to-b from-violet-50 to-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between mb-8 sm:flex-row">
            <h1 className="mb-4 text-3xl font-bold text-violet-900 sm:mb-0">Éditer le QCM</h1>
            
            <div className="flex gap-3">
              <Link to="/qcm/index" className="px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Retour en arrière
              </Link>
            </div>
          </div>

          <div className="mb-8 overflow-hidden bg-white shadow-lg rounded-xl">
            <div className="flex justify-center p-4 border-b border-violet-100">
              <button
                onClick={handleClickInfoButton}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  !questionOpen 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informations générales
              </button>
              
              <div className="w-8"></div>
              
              <button
                onClick={handleClickQuestionButton}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  questionOpen 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions-Réponses
              </button>
            </div>

            <form onSubmit={handleSubmit} method="POST" className="p-6" encType="multipart/form-data">
              <div id="generalSection" className={`space-y-6 ${questionOpen ? 'hidden' : ''}`}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Titre</label>
                    <input
                      type="text"
                      name="intituleQCM"
                      value={qcmData.intituleQCM ?? ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Domaine de Formation</label>
                    <select
                      name="idDomaine"
                      value={qcmData.idDomaine ?? ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      {domaines.map(domaine => {
                        return <option value={domaine.idDomaine}>{domaine.nomDomaine}</option>
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="descriptionQCM"
                    rows={4}
                    value={qcmData.descriptionQCM ?? ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Prix Unitaire</label>
                    <input
                      type="number"
                      name="prixUnitaire"
                      value={qcmData.prixUnitaire ?? ""}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Durée (secondes)</label>
                    <input
                      type="number"
                      name="duree"
                      value={qcmData.duree ?? ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>

              <div id="qaSection" className={!questionOpen ? 'hidden' : ''}>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <EditableQuestion
                      key={question.idQuestion}
                      question={question}
                      questionIndex={index}
                      typeQcms={typeQcms}
                      categories={categories}
                      onQuestionUpdate={handleQuestionUpdate}
                      onQuestionDelete={handleQuestionDelete}
                      onResponseAdd={handleResponseAdd}
                      onResponseUpdate={handleResponseUpdate}
                      onResponseDelete={handleResponseDelete}
                      onImageUpload={handleImageUpload}
                      onImageDelete={handleImageDelete}
                      onImageChange={handleImageChange}
                    />
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={handleAddNewQuestion}
                  className="flex items-center mt-6 font-medium transition-colors duration-200 text-violet-600 hover:text-violet-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Ajouter une nouvelle question
                </button>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="px-6 py-3 font-semibold text-white transition-all duration-200 rounded-lg shadow-sm bg-violet-600 hover:bg-violet-700"
                >
                  Mettre à jour le QCM
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}