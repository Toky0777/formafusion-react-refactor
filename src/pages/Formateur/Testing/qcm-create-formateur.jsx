import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "../../../config/axios";
import AlertMessage from "../../../components/Modals/AlertMessage";
import { Section } from "./section/section-formateur";

export default function CreateQcmFormateur() {
  const { t } = useTranslation();
  const [questionOpen, setQuestionOpen] = useState(false);
  const SectionContainer = useRef(null);
  const [sectionCount, setSectionCount] = useState(0);
  const [createdSection, setCreatedSection] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  });

  //** Fin Domaine */

  //** Titre Qcm */

  const [titleQcm, setTitleQcm] = useState("");

  // pourque les champs n'est pas vide
  const validateAndSet = (title, desc, price, duration) => {
    if (title.trim() !== "" && desc.trim() !== "" && price !== "" && duration !== "") {
      setCanProceed(true);
    } else {
      setCanProceed(false);
    }
  };
  const handleTitleQcmChange = (e) => {
    const newTitle = e.target.value;
    setTitleQcm(newTitle);
    validateAndSet(newTitle, description, unitaryPrice, durationTest);
  };
  //** Fin Titre Qcm */

  //** Domaines */

  const [description, setDescription] = useState("");

  const handleDescritpionChange = (e) => {
    const newDesc = e.target.value;
    setDescription(newDesc);
    validateAndSet(titleQcm, newDesc, unitaryPrice, durationTest);
  };
  //** Fin Domaine */

  //** Domaines */

  const [unitaryPrice, setUnitaryPrice] = useState("");

  const handleUnitaryPriceChange = (e) => {
    const newPrice = e.target.value;
    setUnitaryPrice(newPrice);
    validateAndSet(titleQcm, description, newPrice, durationTest);
  };

  //** Fin Domaine */

  //** Domaines */

  const [durationTest, setDurationTest] = useState("");

  const handleDurationTestChange = (e) => {
    const newDuration = e.target.value;
    setDurationTest(newDuration);
    validateAndSet(titleQcm, description, unitaryPrice, newDuration);
  };

  //** Fin Domaine */

  //----------------------

  const handleClickQuestionButton = () => {
    setQuestionOpen(true);
  };

  const handeClickInfoButton = () => {
    setQuestionOpen(false);
  };

  const AddSection = () => {
    setCreatedSection((prev) => [
      ...prev,
      <Section
        key={sectionCount}
        sectionCount={sectionCount}
        onDeleteSection={handleDeleteSection}
      />,
    ]);
    setSectionCount((prev) => prev + 1);
  };

  const handleDeleteSection = (sectionToDelete) => {
    setCreatedSection((prev) =>
      prev.filter((section) => section.props.sectionCount !== sectionToDelete)
    );
  };

  const DataRequest = async () => {
    try {
      const { data } = await axios.get(`/qcm/create`, {});
      setDomaines(data.all_domaines);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = document.getElementById("qcm-form");
    const formData = new FormData(form);

    // Extraire les données de base (informations générales)
    const baseData = {
      intituleQCM: formData.get("intituleQCM"),
      descriptionQCM: formData.get("descriptionQCM"),
      duree: formData.get("duree"),
      prixUnitaire: formData.get("prixUnitaire"),
      idDomaine: formData.get("idDomaine"),
    };

    // Construire le tableau des sections à partir des composants créés
    const sections = [];

    // Parcourir les sections créées et extraire les données
    createdSection.forEach((sectionComponent, sectionIndex) => {
      const sectionData = {
        categorie_id: formData.get(`sections[${sectionIndex}][categorie_id]`),
        questions: [],
      };

      // Compter le nombre de questions dans cette section
      let questionIndex = 0;
      while (
        formData.has(
          `sections[${sectionIndex}][questions][${questionIndex}][texteQuestion]`
        )
      ) {
        const questionData = {
          texteQuestion: formData.get(
            `sections[${sectionIndex}][questions][${questionIndex}][texteQuestion]`
          ),
          idTypeQcmQuestion: formData.get(
            `sections[${sectionIndex}][questions][${questionIndex}][idTypeQcmQuestion]`
          ),
          reponses: [],
        };

        // Gérer l'image de la question si elle existe
        const imageFile = formData.get(
          `sections[${sectionIndex}][questions][${questionIndex}][image]`
        );
        if (imageFile && imageFile instanceof File) {
          questionData.image = imageFile;
        }

        // Gérer la suppression d'image
        const removeImage = formData.get(
          `sections[${sectionIndex}][questions][${questionIndex}][removeImage]`
        );
        if (removeImage) {
          questionData.removeImage = removeImage;
        }

        // Compter le nombre de réponses pour cette question
        let reponseIndex = 0;
        while (
          formData.has(
            `sections[${sectionIndex}][questions][${questionIndex}][reponses][${reponseIndex}][texteReponse]`
          )
        ) {
          const reponseData = {
            texteReponse: formData.get(
              `sections[${sectionIndex}][questions][${questionIndex}][reponses][${reponseIndex}][texteReponse]`
            ),
            explicationReponse: formData.get(
              `sections[${sectionIndex}][questions][${questionIndex}][reponses][${reponseIndex}][explicationReponse]`
            ),
            points: formData.get(
              `sections[${sectionIndex}][questions][${questionIndex}][reponses][${reponseIndex}][points]`
            ),
            categorie_id: formData.get(
              `sections[${sectionIndex}][questions][${questionIndex}][reponses][${reponseIndex}][categorie_id]`
            ),
          };

          questionData.reponses.push(reponseData);
          reponseIndex++;
        }

        sectionData.questions.push(questionData);
        questionIndex++;
      }

      sections.push(sectionData);
    });

    // Créer un objet JavaScript avec la structure correcte
    const dataToSend = {
      ...baseData,
      sections: sections,
    };

    // Créer une nouvelle FormData avec la structure correcte
    const structuredFormData = new FormData();

    // Fonction récursive pour ajouter les données imbriquées à FormData
    const appendToFormData = (data, parentKey = "") => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          const formKey = parentKey ? `${parentKey}[${key}]` : key;

          if (value instanceof File) {
            structuredFormData.append(formKey, value);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              appendToFormData(item, `${formKey}[${index}]`);
            });
          } else if (typeof value === "object" && value !== null) {
            appendToFormData(value, formKey);
          } else if (value !== null && value !== undefined) {
            structuredFormData.append(formKey, value);
          }
        }
      }
    };

    // Ajouter toutes les données à FormData
    appendToFormData(dataToSend);

    try {
      // Debug : voir ce qui est envoyé
      console.log("Data structure:", JSON.stringify(dataToSend, null, 2));

      for (let [key, value] of structuredFormData.entries()) {
        console.log(key, value);
      }

      await axios.post(`/qcm/store`, structuredFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotification({
        type: "success",
        message: t("QCM created successfully!"),
        show: true,
      });
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
        navigate("/formateur/testing");
      }, 2000);
    } catch (error) {
      console.log(error)
      if (error.message)
        setNotification({
          type: "error",
          message: error.message,
          show: true,
        });
      else
        setNotification({
          type: "error",
          message: `${t("Error creating QCM")} : ${error}`,
          show: true,
        });
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
      }, 2000);
    }
  };

  useEffect(() => {
    DataRequest();
  }, []);

  return (
    <>
      <AlertMessage
        type={notification.type}
        message={notification.message}
        visible={notification.show}
      />
      <div className="min-h-screen px-3 pt-3 mt-3 bg-gray-50 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl  text-gray-700">
              {t("QCM Creation")}
            </h1>
            <Link
              to="/formateur/testing"
              className="px-5 py-2 font-medium text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105"
            >
              {t("Go Back")}
            </Link>
          </div>
          <div className="p-6 mb-8 overflow-hidden bg-white shadow-lg rounded-xl">
            <div className="flex justify-center p-6 mb-4 border-b border-violet-100">
              <button
                onClick={handeClickInfoButton}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${!questionOpen
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("General Information")}
              </button>

              <div className="w-8"></div>

              <button
                onClick={handleClickQuestionButton}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${questionOpen
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("Questions-Answers")}
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              method="POST"
              id="qcm-form"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div
                id="generalSection"
                className={`space-y-6 ${questionOpen ? "hidden" : ""}`}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("Title")}
                    </label>
                    <input
                      type="text"
                      name="intituleQCM"
                      value={titleQcm}
                      onChange={handleTitleQcmChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("Training Domain")}
                    </label>
                    <select
                      name="idDomaine"
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="" disabled selected>
                        {t("Please choose the domain")}
                      </option>
                      {domaines.map((domaine, index) => (
                        <option value={domaine.idDomaine} key={index}>
                          {domaine.nomDomaine}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    {t("Description")}
                  </label>
                  <textarea
                    name="descriptionQCM"
                    rows={4}
                    className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    value={description}
                    onChange={handleDescritpionChange}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("Unit Price")}
                    </label>
                    <input
                      type="number"
                      name="prixUnitaire"
                      value={unitaryPrice}
                      onChange={handleUnitaryPriceChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {t("Duration (minutes)")}
                    </label>
                    <input
                      type="number"
                      name="duree"
                      value={durationTest}
                      onChange={handleDurationTestChange}
                      className="w-full px-4 py-2 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
              <div className={!questionOpen ? "hidden" : ""}>
                <div ref={SectionContainer} className="space-y-6">
                  {createdSection}
                </div>
                <button
                  type="button"
                  id="add-section"
                  onClick={AddSection}
                  className="w-full bg-[#c7c7ce] hover:bg-[#b0b0b8] text-white font-medium py-3 px-4 rounded-lg shadow-md transition duration-300 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H5a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {t("Add new section")}
                </button>
              </div>
              <div className="flex justify-end mt-8">
                {/* Rendu conditionnel des boutons */}
                {questionOpen ? (
                  // Bouton 'Mettre à jour' visible sur l'onglet 'Questions-Réponses'
                  <button
                    type="submit"
                    className="px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-200 bg-violet-600 hover:bg-violet-700"
                   
                  >
                    Create Question
                  </button>
                ) : (
                  // Bouton 'Suivant' visible sur l'onglet 'Informations générales'
                  <button
                    type="button" // Important: `type="button"` pour éviter la soumission du formulaire
                    onClick={handleClickQuestionButton}
                    className="px-6 py-3 font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-md transition-all duration-200"
                  >
                    Suivant
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
