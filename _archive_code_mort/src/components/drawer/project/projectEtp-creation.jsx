
import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowRight, FaBookmark,
         FaTimes, FaInfoCircle, FaFolderPlus, 
         FaFolder,  } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { useAuth } from '../../../contexts/AuthContext';
import SuccessAlert from '../../ui/alert-success';
import axios from '../../../config/axios';



const ProjetEtpCreation = ({ setShowPage }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertCours, setShowAlertCours] = useState(false);
  const [showAlertDossier, setShowAlertDossier] = useState(false);
  const [showAlertProjet, setShowAlertProjet] = useState(false);
  const [activeTab, setActiveTab] = useState('intra');
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setProjectType] = useState('intra');
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [errors, setErrors] = useState({});
  const [entreprises, setEntreprises] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [tousDossier, setTousDossier] = useState([]);
  const [tousModalite, setTousModalite] = useState([]);
  const [tousVille, setTousVille] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [modalites, setModalites] = useState([]);
  const [modalite, setModalite] = useState([]);
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [projetCreate, setProjetCreate] = useState([]);
  const [cours, setCours] = useState([]);
  const [etpAjoute, setEtpAjoute] = useState([]);
  const [idProjet, setIdProjet] = useState(null);
  const currentYear = new Date().getFullYear();
  const { token } = useAuth();

  const fecthProjet = async () => {
    try{
        //  etp
         const projetRes = await axios.get(`http://localhost:8000/api/cfp/projets/entreprises/all`)     

         const projetResData = await projetRes.data;

         console.log("tous les etp :",projetResData);

         setProjetCreate(projetResData);
         setErrors(null);

        //  cours

        const coursRes = await axios.get(`http://localhost:8000/api/cfp/projet/module-first`)

        const coursResData = await coursRes.data;

        console.log("tous le cours:", coursResData);

        setCours(coursResData);
        setErrors(null);

        // etp projet

        const etpAjoute = await axios.get(`http://localhost:8000/api/cfp/projets/${idProjet}/etp/assign`)

        const etpAjouteData = await etpAjoute.data;

        console.log("etp ajoute:", etpAjouteData);

        setEtpAjoute(etpAjouteData);

        // tous les dossier

        const dossierRes = await axios.get(`http://localhost:8000/api/cfp/projet/folder-first/year/${currentYear}`)

        const dossierResData = await dossierRes.data;

        console.log(dossierResData);

        setTousDossier(dossierResData);


        // modalite 

        
        const ModaliteRes = await axios.get(`http://localhost:8000/api/cfp/projets/getModalite`)

        const ModaliteResData = await ModaliteRes.data;

        console.log(ModaliteResData);

        setTousModalite(ModaliteResData);


        // ville


        const VilleRes = await axios.get(`http://localhost:8000/api/cfp/projets/getVille`)

        const VilleResData = await VilleRes.json();

        console.log(VilleResData);

        setTousVille(VilleResData);



    }catch(error){
      console.error("Détails de l'erreur :", error);
      setLoading(false);
      setErrors("Impossible de charger le projet. Veuillez réessayer.");
    }

  };

  const [projectData, setProjectData] = useState({
    reference: '',
    title: '',
    description: '',
    idTypeProjet: 1,
    dateDebut: '',
    dateFin: '',
  });
  
  const handleInputChanger = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!projectData.title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/api/cfp/projets', {
        title: projectData.title,
        reference: projectData.reference,
        description: projectData.description,
        idTypeProjet: 1,
      });

  
      const data = await response.data.catch(() => null);
  
      if (response.status != 200 && data) {
        console.log('Projet créé, nextStep disponible?', typeof nextStep); // Doit afficher "function"
  
        const idprojet = data.idProjet;
  
        // D'abord, mets à jour l'état local
        setIdProjet(idprojet);
  
        nextStep();
  
        console.log(data);
      } else {
        const message = data?.message || 'Une erreur est survenue.';
        console.error('Erreur serveur:', data);
        alert('❌ Erreur: ' + message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('❌ Erreur réseau ou CORS. Voir la console pour plus de détails.');
    }
  
    setIsLoading(false);
  };

  const manageEtp = async (method, idProjet, idEtp) => {
    
    if (method === "patch") {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/cfp/projets/${idProjet}/${idEtp}/etp/assign`,
        );
  
        if (!response.status != 200) {
          throw new Error("Erreur lors de l'ajout ");
        }
          
        await fecthProjet();

        setShowAlert(true);
        
        console.log("entrprise ajouté avec succès");
      } catch (error) {
        console.error("Erreur de l'ajout de 'entreprise:", error);
      }
    }
  };

  const manageCours = async (method, idProjet, idModule) => {
    
    if (method === "patch") {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/cfp/projets/${idProjet}/${idModule}/module/assign`,
        );
  
        if (!response.status != 200) {
          throw new Error("Erreur lors de l'ajout ");
        }
          
        await fecthProjet();

        setShowAlertCours(true);
        
        console.log("cours ajouté avec succès");
      } catch (error) {
        console.error("Erreur de l'ajout de cours:", error);
      }
    }
  };

  const manageDossier = async (method, idProjet, idDossier) => {
    
    if (method === "post") {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/cfp/projet/folder-first/document/${idDossier}/${idProjet}`,
        );
  
        if (!response.status != 200) {
          throw new Error("Erreur lors de l'ajout ");
        }
          
        await fecthProjet();

        setShowAlertDossier(true);

        
        console.log("dossier ajouté avec succès");
      } catch (error) {
        console.error("Erreur de l'ajout de dossier:", error);
      }
    }
  };

  const updateDateProjet = async (method, idProjet) => {
    
    if (method === "patch") {
      try {
      const response = await axios.patch(
        `http://localhost:8000/api/cfp/projets/${idProjet}/update-date`,
        {
          dateDebut: projectData.dateDebut,
          dateFin: projectData.dateFin,
        }
      );

  
        if (!response.status != 200) {
          throw new Error("Erreur lors de l'ajout de date ");
        }
          
        await fecthProjet();

        setShowAlertProjet(true);
        // setShowPage(false);

        console.log("Données envoyées :", projectData);


        // console.log("Dates envoyées :", {
        //   dateDebut: dateProjet.dateDebut,
        //   dateFin: dateProjet.dateFin,
        // }); 
       
      } catch (error) {
        console.error("Erreur de l'ajout de date:", error);
      }
    }

    
  };

  const handleModaliteChange = async (e, idProjet) => {
    const newModalite = e.target.value;
    setModalite(newModalite);

    try {
        const response = await axios.patch(
        `http://localhost:8000/api/cfp/projets/${idProjet}/update/modalite`,
        {
          modalite: newModalite,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        }
      );


      if (!response.status != 200) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const result = await response.data;
      console.log('Succès :', result.message);
    } catch (error) {
      console.error('Erreur :', error.message);
    }
  };

  const etpAssign = (etp) => {
    setSelectedEntreprise(etp);
  };


  useEffect(() => {
    fecthProjet();
    const idType = projectType === 'intra' ? 1 : 2;
    setProjectData((prevData) => ({
      ...prevData,
      idTypeProjet: idType,
    }));
  }, [projectType]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!projectData.title) newErrors.title = 'Le titre du projet est obligatoire';
    }
    
    // if (step === 2 && projectType === 'intra') {
    //   if (!selectedEntreprise) newErrors.entreprise = 'Veuillez sélectionner une entreprise';
    // }
    
    // if ((step === 2 && projectType === 'inter') || (step === 3 && projectType === 'intra')) {
    //   if (!selectedModule) newErrors.module = 'Veuillez sélectionner un module';
    // }
    
    if (step === 5) {
      if (!projectData.dateDebut) newErrors.dateDebut = 'La date de début est obligatoire';
      if (!projectData.modalite) newErrors.modalite = 'Veuillez sélectionner une modalité';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleProjectCreated = (id) => {
    console.log('✅ Projet créé avec ID:', id);
    setIdProjet(id); 
  };
  

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmite = async () => {
    if (!validateStep(5)) return;
  
    try {
       const response = await axios.post(
          'http://localhost:8000/api/cfp/projets',
          projectData
        );

  
      const data = await response.data;
      console.log('Projet enregistré avec succès :', data);

      alert('Projet enregistré avec succès');
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du projet :", error);
    }
  };
  
  

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full h-full flex flex-col gap-4 mt-4 items-center">
           
      
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="reference" className="text-slate-700 text-[13px]">Référence du projet</label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={projectData.reference}
                onChange={handleInputChanger}
                className="input input-bordered w-full border-1 border-gray-200 p-2 rounded-md"
              />
            </div>
      
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="title" className="text-slate-700 text-[13px] after:content-['*'] after:ml-0.5 after:text-red-500">
                Titre du projet
              </label>
              <p className="text-sm italic text-slate-500 text-[13px]">Ce champ est obligatoire !</p>
              <input
                type="text"
                id="title"
                name="title"
                value={projectData.title}
                onChange={handleInputChanger}
                className="input input-bordered w-full border-1 border-gray-200 p-2 rounded-md"
                required
              />
              {/* {errors.title && <div className="text-sm text-red-500">{errors.title}</div>} */}
            </div>

            <div className="inline-flex items-center gap-2 py-2">
                    <label className="text-base font-normal text-blue-600">Présentielle</label>
                    
                    <div className="group relative top-0 cursor-pointer">
                        <div className="absolute bottom-[calc(100%+0.5rem)] top-full shadow-lg left-[50%] -translate-x-[50%] hidden group-hover:block w-auto transition-all duration-300 ease-in-out">
                        <div className="bottom-full rounded bg-gray-700 px-3 py-1 text-base text-white whitespace-nowrap">
                            Modalité
                            <svg className="absolute left-0 top-full h-2 w-full text-gray-700" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
                            </svg>
                        </div>
                        </div>

                        <div className="flex flex-row justify-between toggle">
                        <label htmlFor="modalite_project_inter" className="flex items-center cursor-pointer">
                            <div className="relative">
                            <input type="checkbox" name="activation" id="modalite_project_inter" className="hidden checkbox peer" />
                            <div className="block border-[1px] border-blue-600 bg-blue-100 peer-checked:border-purple-900 peer-checked:bg-purple-400 w-9 h-4 rounded-full"></div>
                            <div className="absolute top-0 w-4 h-4 transition bg-blue-600 rounded-full dot peer-checked:translate-x-5 peer-checked:bg-purple-900"></div>
                            </div>
                        </label>
                        </div>
                    </div>

                    <label className="text-base font-normal text-purple-900">En ligne</label>
                    </div>

      
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="description" className="text-slate-700 text-[13px]">Description</label>
              <textarea
                name="description"
                id="description"
                value={projectData.description}
                onChange={handleInputChanger}
                className="textarea textarea-bordered border-1 border-gray-200 p-2 rounded-md"
                rows="1"
              />
            </div>
      
            <div className="mt-2 w-full flex justify-end">

    
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative rotate-button bg-[#a462a4] text-white rounded-md w-48 h-10 overflow-hidden"
              >
                  <span
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                   className="rotate-button-face flex gap-2 items-center justify-center p-2">
                    Suivant <FaArrowRight />
                  </span>
                  <span
                     style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                   className="rotate-button-face-back text-sm font-medium">
                    Sélectionner un dossier
                  </span>
            </button>     

            </div>
          </div>
        );

      case 2:
        if (projectType === 'intra') {
          return (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex  min-w-[500px]  w-full">
                <div className="flex flex-col items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
                  <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
                    <div className="w-1 h-6 bg-red-400"></div>
                    <label className="text-gray-500 text-[13px] font-normal">Liste de tous les entreprises clients</label>
                  </div>
                  <div className="w-full mt-2 bg-gray-50 space-y-2">
                    <span className="inline-flex items-center w-full gap-4">
                      <button className="btn btn-outline btn-primary border-1 border-purple-300 p-1 w-[60%] rounded-md text-purple-300">
                        <span className="inline-flex items-center gap-2 text-[13px]">
                          <FaPlus /> Nouvelle entreprise
                        </span>
                      </button>
                      <input 
                        id="search_client" 
                        placeholder="Chercher un client" 
                        className="input input-bordered w-full input-primary p-1 border-1 border-gray-300 rounded-md"
                      />
                    </span>
                    <div className=" mt-2 p-4 overflow-x-auto !h-[35rem] overflow-y-auto">
                        <ul className="space-y-4 ">
                          {projetCreate.etps?.map((e, i) => (
                            <li key={i} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="w-24 h-16 rounded-xl bg-slate-200 flex items-center justify-center">
                                    <span className="text-[13px] uppercase text-slate-600">
                                        <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/${e.etp_logo}`} alt="Avatar" class="w-20 h-10 rounded-lg mr-4 object-cover"/>
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold uppercase text-[13px]">{e.etp_name}</div>
                                  <div className="text-[13px] text-slate-500">
                                        {e.etp_email}
                                  </div>
                                </div>
                              </div>
                               {showAlert && <SuccessAlert message="✔Entreprise ajoutée avec succès !" />}
                              <button
                                onClick={() => manageEtp("patch", idProjet, e.idEtp)}
                                className="text-[13px] p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                              >
                                <FaPlus />
                              </button>
                            </li>
                          ))}
                        </ul>


                    </div>
                      
                  </div>
                </div>

                <div className="flex flex-col items-start w-1/2 h-full">
                  <div className="inline-flex items-center w-max gap-2">
                    <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
                      <div className="w-1 h-6 bg-green-400"></div>
                      <label className="text-gray-500 text-[13px] font-normal">Le client sélectionné pour ce projet</label>
                    </div>
                  </div>
                  <div className="w-full h-full mt-2">
                     <div className="overflow-x-auto mt-2 p-4">
                     {Array.isArray(etpAjoute?.entreprise) && etpAjoute.entreprise.map((e, i) => (
                        <li key={i} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-24 h-16 rounded-xl bg-slate-200 flex items-center justify-center">
                                <span className="text-[13px] uppercase text-slate-600">
                                  {e.initial_name}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold uppercase text-[13px]">{e.etp_name}</div>
                              <div className="text-[13px] text-slate-500">
                                {e.etp_email}
                              </div>
                            </div>
                          </div>                                    
                        </li>
                      ))}

                  
                      </div>
                  </div>
                  <div className="w-full flex gap-4 justify-end ">
                <button 
                  onClick={prevStep}
                  className="px-3 bg-gray-300 py-2 rounded-md text-gray-600 hover:bg-gray-300/80 transition duration-200 text-sm"
                >
                  Revenir
                </button>
                <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative rotate-button bg-[#a462a4] text-white rounded-md w-48 h-10 overflow-hidden"
              >
                  <span
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                   className="rotate-button-face flex gap-2 items-center justify-center p-2">
                    Suivant <FaArrowRight />
                  </span>
                  <span
                     style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                   className="rotate-button-face-back text-sm font-medium">
                    Sélectionner un dossier
                  </span>
              </button> 
              </div>
                </div>                
              </div>

              

             
            </div>
          );
        } else {
          return renderModuleSelection();
      }

      case 3:
        if (projectType === 'intra') {
        
        } else {
          return (
            <div className="w-full flex flex-col gap-4 mt-4 items-center">
              <div className="w-full flex flex-col items-start">
                <p className="text-lg text-left text-gray-400">
                  Où se fera ce projet de formation inter-entreprise ?
                </p>
              </div>
              <div className="flex flex-col justify-start w-full gap-3">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="lieu" className="text-gray-600">Lieu de formation</label>
                  <select 
                    name="lieu" 
                    id="lieu"                   
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Sélectionnez un lieu</option>
                    {tousVille.villes.map((v, i) => (
                      <option key={i} >{v.ville}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 w-full inline-flex items-center gap-2 justify-end">
                <button 
                  onClick={prevStep}
                  className="px-3 bg-gray-300 py-2 rounded-md text-gray-600 hover:bg-gray-300/80 transition duration-200 text-sm"
                >
                  Revenir
                </button>
                <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative rotate-button bg-[#a462a4] text-white rounded-md w-48 h-10 overflow-hidden"
              >
                  <span
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                   className="rotate-button-face flex gap-2 items-center justify-center p-2">
                    Suivant <FaArrowRight />
                  </span>
                  <span
                     style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                   className="rotate-button-face-back text-sm font-medium">
                    Sélectionner un dossier
                  </span>
              </button> 
              </div>
            </div>
          );
      }

      case 4:
        return (
          <div className="flex flex-col gap-4 w-full">
            <div role="alert" className="alert bg-blue-100 mt-2 flex items-center gap-2 p-1">
              <FaInfoCircle className="text-blue-500" />
              <span className="text-lg">
                Veuillez assigné ce projet à un dossier pour mieux le retrouver à l'avenir.
              </span>
            </div>
            <div className="flex min-w-[500px]  w-full">
              <div className="w-full grid grid-cols-2 h-[33rem] gap-3 justify-start">
                <div className="grid col-span-2 h-max">
                  <button className="border-[#a462a4] border-1 rounded-md p-1 text-[#a462a4] flex gap-2 items-center btn btn-sm btn-outline btn-primary w-max">
                    <FaFolderPlus /> Nouveau dossier
                  </button>
                </div>
                <div className="grid col-span-1 h-[37rem] overflow-y-auto">
                  <table className="table bg-white h-max">
                    <thead>
                      <tr className="bg-gray-100">
                        <th>Nom du dossier</th>
                        <th className="text-right">Document</th>
                        <th className="text-right">Projet</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        {dossiers.length > 0 ? (
                          tousDossier.dossiers.map((d, i) => (
                            <tr
                              key={i}

                            >
                              <td className="flex items-center gap-3 text-[14px] font-medium text-slate-700 py-3 px-4">
                                <FaFolder className="text-yellow-200"></FaFolder>
                                {d.nomDossier}
                              </td>
                              <td className="text-right text-[13px] text-slate-500 py-3 px-4">
                               
                              </td>
                              <td className="text-right text-[13px] text-slate-500 py-3 px-4">
                               
                              </td>
                              <td className="py-3 px-4">
                                     {showAlertDossier && <SuccessAlert message="✔ Dossiers ajoutée avec succès !" />}
                                     <button
                                        onClick={() => manageDossier("post", idProjet, d.idDossier)}
                                        className="w-8 h-8 rounded-full bg-green-100 text-green-500 hover:bg-green-200 flex items-center justify-center"
                                      >
                                        <FaPlus size={12} />
                                      </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-gray-400 text-sm py-4">
                              Aucun dossier trouvé.
                            </td>
                          </tr>
                        )}
                      </tbody>
                  </table>
                </div>

                <div className="grid col-span-1 h-[37rem] overflow-y-auto">
                  <table className="table bg-white h-max">
                    <thead>
                      <tr className="bg-gray-100">
                        <th>Nom du dossier</th>
                        <th className="text-right">Document</th>
                        <th className="text-right">Projet</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDossier && (
                        <tr className="">
                          <td className="flex items-center gap-3"><FaFolder className="text-yellow-200"></FaFolder>{selectedDossier}</td>
                          <td className="text-right">{selectedDossier.documents}</td>
                          <td className="text-right">{selectedDossier.projets}</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                    <div className="mt-3 w-full inline-flex items-center gap-2 justify-end">
                <button 
                  onClick={prevStep}
                  className="px-3 bg-gray-300 py-2 rounded-md text-gray-600 hover:bg-gray-300/80 transition duration-200 text-sm"
                >
                  Revenir
                </button>
                <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="relative rotate-button bg-[#a462a4] text-white rounded-md w-48 h-10 overflow-hidden"
              >
                  <span
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                   className="rotate-button-face flex gap-2 items-center justify-center p-2">
                    Suivant <FaArrowRight />
                  </span>
                  <span
                     style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                   className="rotate-button-face-back text-sm font-medium">
                    Sélectionner un dossier
                  </span>
               </button> 
                  </div>
                  </table>
                 
            
                </div>
              </div>
            </div>

            
          </div>
        );

      case 5:
        return (
          <div className="w-full flex flex-col gap-4 mt-4 items-center">
            <div className="inline-flex items-center w-full gap-8">
              <div className="form-control w-52">
                <label className="label cursor-pointer border-1 border-gray-400 p-3 ">
                  <span className="label-text">Réserver ce projet</span>
                  <input 
                    type="checkbox" 
                    name="reservation"
                    checked={projectData.reservation}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      reservation: e.target.checked
                    }))}
                    className="toggle toggle-primary ml-2"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col w-full gap-1">
              <label htmlFor="modalite" className="text-gray-600">Modalité</label>
              <select 
                name="modalite" 
                id="modalite"
                value={projectData.modalite}
                onChange={handleModaliteChange}
                className="select select-bordered w-full border-1 border-gray-400 p-1 rounded-md "
              >
                <option value="">Sélectionnez une modalité</option>
                {tousModalite?.modalites.map((m, i) => (
                  <option key={i} >{m.modalite}</option>
                ))}
              </select>
              
            </div>

            <div className="w-full flex flex-col items-start">
              <p className="text-lg text-left text-gray-400">
                Entre quel date vous voulez programmer ce projet ? Vous pouvez modifier
                la date à l'avenir en fonction de votre disponibilité.
              </p>
            </div>
            <div className="flex flex-col justify-start w-full gap-3">
              <div className="inline-flex items-center gap-2">
                <div className="flex flex-col w-full gap-1">
                  <span className="inline-flex items-center w-full gap-2">
                    <label htmlFor="dateDebut" className="text-slate-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                      Début du projet
                    </label>
                    <p className="text-sm italic text-slate-500">Ce champ est obligatoire !</p>
                  </span>
                  <input
                    type="date"
                    id="dateDebut"
                    name="dateDebut"
                    value={projectData.dateDebut}
                    onChange={handleInputChange}
                    className="input input-bordered w-full border-1 border-gray-400 p-1 rounded-md"
                    required
                  />
                 
                </div>
                <div className="flex flex-col w-full gap-1">
                  <span className="inline-flex items-center w-full gap-2">
                    <label htmlFor="dateFin" className="text-slate-700">Fin du projet</label>
                  </span>
                  <input
                    type="date"
                    id="dateFin"
                    name="dateFin"
                    value={projectData.dateFin}
                    onChange={handleInputChange}
                    className="input input-bordered w-full border-1 border-gray-400 p-1 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 w-full inline-flex items-center gap-2 justify-end">
              <button 
                onClick={prevStep}
                className="btn btn-ghost"
              >
                Revenir
              </button>
               {showAlertProjet && <SuccessAlert message="✔ Projet crée avec succès !" />}
              <button 
                onClick={() => updateDateProjet("patch", idProjet)}
                className="btn btn-primary hover:text-white bg-[#a462a4] flex items-center gap-2 rounded-md text-gray-200 p-1"
              >
                <FaBookmark /> Terminé
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderModuleSelection = () => {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex h-full min-w-[500px]  w-full">
          <div className="flex flex-col !h-[40rem] overflow-y-auto items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
            <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
              <div className="w-1 h-6 bg-red-400"></div>
              <label className="text-gray-500 text-xl font-normal">Liste de tous les cours</label>
            </div>
            <div className="w-full h-full mt-2 bg-gray-50">
            <ul className="list-none p-2 flex flex-col gap-2">
                        {cours.modules?.map((m, i) => (
                          <li
                            key={i}
                            className="grid grid-cols-5 gap-2 px-3 py-2 border border-gray-100 rounded-md bg-white hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="col-span-4 flex items-center gap-3">
                              <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${m.module_image}`} alt="logo_module" className="w-10 h-10 rounded-full mr-4 object-cover"/>
 
                              <div>
                                <p className="text-sm text-gray-500 lowercase">
                                  {m.module_name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-center">
                            {showAlertCours && <SuccessAlert message="✔ Cours ajoutée avec succès !" />}
                              <button
                                onClick={() => manageCours("patch", idProjet, m.idModule)}
                                className="w-8 h-8 rounded-full bg-green-100 text-green-500 hover:bg-green-200 flex items-center justify-center"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                          </li>
                        ))}
                  </ul>
            </div>
          </div>

          <div className="flex flex-col items-start w-1/2 h-full">
            <div className="inline-flex items-center w-max gap-2">
              <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
                <div className="w-1 h-6 bg-green-400"></div>
                <label className="text-gray-500 text-xl font-normal">Le cours sélectionné pour ce projet</label>
              </div>
            </div>
            <div className="w-full h-full mt-2">
              {selectedModule && (
                <div className="p-2 border rounded bg-purple-100 border-purple-500">
                  {selectedModule.nom}
                </div>
              )}
            </div>
            <div className="mt-3 w-full inline-flex items-center gap-2 justify-end">
                         <button 
                           onClick={prevStep}
                           className="px-3 bg-gray-300 py-2 rounded-md text-gray-600 hover:bg-gray-300/80 transition duration-200 text-sm"
                         >
                           Revenir
                         </button>
                         <button
                          onClick={handleSubmit}
                          disabled={isLoading}
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                          className="relative rotate-button bg-[#a462a4] text-white rounded-md w-48 h-10 overflow-hidden"
                        >
                            <span
                                style={{
                                  backfaceVisibility: "hidden",
                                  transform: "rotateY(0deg)",
                                }}
                            className="rotate-button-face flex gap-2 items-center justify-center p-2">
                              Suivant <FaArrowRight />
                            </span>
                            <span
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                              }}
                            className="rotate-button-face-back text-sm font-medium">
                              Sélectionner un dossier
                            </span>
                      </button> 
                    </div>

          </div>
        </div>

       
      </div>
    );
  };

  return (
    <div className="offcanvas offcanvas-end w-[100%] show" tabIndex="-1" id="offcanvasAddProject" aria-labelledby="offcanvasAddProject" aria-modal="true" role="dialog">
      <div className="flex flex-col w-full h-full">
        <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
          <p className="text-[13px] font-medium text-gray-500">Créer un nouveau projet</p>
          <button onClick={() => setShowPage(false)} className="text-sm">✕</button>
        </div>
        <div className="w-full h-full">
          <div className="h-full p-3 mt-2  modal-body">
            <div className="w-full">
              <div id="erreurProjet" className="mb-2"></div>
              <div className="tab-content bg-white rounded-box p-2 !h-[48rem]">                   
                <div className="sw sw-justified sw-theme-arrows">
                <ul className="flex items-center w-full text-white text-sm font-medium">
                          {[1, 2, 3, 4].map((step, index) => (
                            <li key={step} className="relative flex-1">
                              <button
                                className={`w-full h-12 flex items-center justify-center
                                  ${currentStep === step ? 'bg-[#a462a4]' : 'bg-gray-300'}
                                  relative
                                `}
                                onClick={() => currentStep > step && setCurrentStep(step)}
                              >
                                <span>{getStepLabel(step, projectType)}</span>

                                {/* Flèche droite (Triangle) */}
                                {index < 4 && (
                                  <div className={`absolute top-0 right-0 w-0 h-0 border-t-[24px] border-b-[24px] border-l-[24px] 
                                    ${currentStep === step ? 'border-l-[#a462a4]' : 'border-l-gray-300'}
                                    z-10`}>
                                  </div>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>



                  <div className="tab-content !h-[20rem]">
                    {renderStepContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStepLabel = (step, projectType) => {
  if (step === 1) return 'Nouveau';
  if (step === 2) return  'Cours'
  if (step === 3) return  'Date'
  if (step === 4) return 'Lieu de formation';
 
  return '';
};

export default ProjetEtpCreation;  