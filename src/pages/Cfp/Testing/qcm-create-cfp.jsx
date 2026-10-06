import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "../../../config/axios";
import AlertMessage from "../../../components/Modals/AlertMessage";
import { Section } from "./section/section-cfp";

export default function CreateQcmCfp() {
  const [questionOpen, setQuestionOpen] = useState(false);
  const SectionContainer = useRef(null);
  const [sectionCount, setSectionCount] = useState(0);
  const [createdSection, setCreatedSection] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  });

  // Champs infos générales
  const [titleQcm, setTitleQcm] = useState("");
  const [description, setDescription] = useState("");
  const [unitaryPrice, setUnitaryPrice] = useState("");
  const [durationTest, setDurationTest] = useState("");
  const [selectedDomaine, setSelectedDomaine] = useState("");

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

    // Infos générales : on utilise directement les useState
    const baseData = {
      intituleQCM: titleQcm,
      descriptionQCM: description,
      duree: durationTest,
      prixUnitaire: unitaryPrice,
      idDomaine: selectedDomaine,
    };

    // Construire les sections/questions/réponses
    const sections = [];

    createdSection.forEach((sectionComponent, sectionIndex) => {
      const sectionData = {
        categorie_id: formData.get(`sections[${sectionIndex}][categorie_id]`),
        questions: [],
      };

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

        // Gestion image
        const imageFile = formData.get(
          `sections[${sectionIndex}][questions][${questionIndex}][image]`
        );
        if (imageFile && imageFile instanceof File) {
          questionData.image = imageFile;
        }

        // Suppression image
        const removeImage = formData.get(
          `sections[${sectionIndex}][questions][${questionIndex}][removeImage]`
        );
        if (removeImage) {
          questionData.removeImage = removeImage;
        }

        // Réponses
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

    const dataToSend = {
      ...baseData,
      sections,
    };

    // Transformer en FormData pour l'envoi (multipart)
    const structuredFormData = new FormData();

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

    appendToFormData(dataToSend);

    try {
      console.log("Data structure:", JSON.stringify(dataToSend, null, 2));

      for (let [key, value] of structuredFormData.entries()) {
        console.log(key, value);
      }

      await axios.post(`/qcm/store`, structuredFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotification({
        type: "success",
        message: "QCM created successfully!",
        show: true,
      });

      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
        navigate("/qcm/index");
      }, 2000);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message
          ? "You are not connected"
          : `Error creating QCM: ${error}`,
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
      <div className="min-h-screen px-6 pt-8  bg-gray-50 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Création QCM
            </h1>
            <Link
              to="/qcm/index"
              className="px-5 py-2 font-medium text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105"
            >
              Retourner
            </Link>
          </div>
          <div class="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md rounded-xl">
            <div class="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 mr-3 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 class="text-xl font-bold text-blue-800">
                Instructions pour créer votre test
              </h2>
            </div>
            <div class="space-y-4 text-gray-700">
              <div>
                <h3 class="mb-2 text-lg font-semibold text-blue-700">
                  1. Informations générales
                </h3>
                <p class="ml-4 text-sm">
                  • Veuillez remplir{" "}
                  <strong>toutes les informations nécessaires</strong>{" "}
                  concernant le test (titre, description, durée, etc.).
                </p>
              </div>
              <div>
                <h3 class="mb-2 text-lg font-semibold text-blue-700">
                  2. Questions &amp; Réponses
                </h3>
                <div class="ml-4 space-y-2 text-sm">
                  <p>
                    • Les questions sont <strong>groupées par section</strong>{" "}
                    (ou catégorie). 👉 Veuillez <strong>ajouter</strong> ou{" "}
                    <strong>utiliser</strong> une section existante avant de
                    créer vos questions.
                  </p>
                  <p>• Les champs requis pour chaque question sont :</p>
                  <div class="ml-6 space-y-1">
                    <p>
                      1. <strong>La question</strong>
                    </p>
                    <p>
                      2. <strong>Le type de question</strong> (QCM ou réponse
                      courte)
                    </p>
                    <p>
                      3. <strong>La ou les réponses</strong> ainsi que{" "}
                      <strong>les points</strong> attribués
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 mb-8 bg-white shadow-lg rounded-xl">
            <form onSubmit={handleSubmit} id="qcm-form" className="space-y-4">
              {/* Étape 1 : Informations générales */}
              {!questionOpen && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Titre (*obligatoire)
                      </label>
                      <input
                        type="text"
                        required
                        name="intituleQCM"
                        value={titleQcm}
                        onChange={(e) => setTitleQcm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Domaine de formation (*obligatoire)
                      </label>
                      <select
                        name="idDomaine"
                        value={selectedDomaine}
                        onChange={(e) => setSelectedDomaine(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      >
                        <option value="">Choisissez un domaine</option>
                        {domaines.map((d) => (
                          <option key={d.idDomaine} value={d.idDomaine}>
                            {d.nomDomaine}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Description (*obligatoire)
                    </label>
                    <textarea
                      name="descriptionQCM"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Prix unitaire (*obligatoire)
                      </label>
                      <input
                        type="number"
                        name="prixUnitaire"
                        value={unitaryPrice}
                        onChange={(e) => setUnitaryPrice(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Durée (minutes)
                      </label>
                      <input
                        type="number"
                        name="duree"
                        value={durationTest}
                        onChange={(e) => setDurationTest(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Bouton Suivant */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setQuestionOpen(true)}
                      className="px-6 py-2 text-white bg-violet-600 rounded-lg"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              )}

              {/* Étape 2 : Questions */}
              {questionOpen && (
                <div className="space-y-6">
                  <div ref={SectionContainer} className="space-y-6">
                    {createdSection}
                  </div>

                  <button
                    type="button"
                    onClick={AddSection}
                    className="w-full py-3 text-white bg-gray-400 rounded-lg"
                  >
                    + Ajouter une section
                  </button>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setQuestionOpen(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-white bg-violet-600 rounded-lg"
                    >
                      Créer QCM
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
