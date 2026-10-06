import { useEffect, useRef, useState } from "react";
import axios from "../../../../config/axios";

export function CreateQuestionCfp({
  container,
  sectionIndex,
  deleteQuestion,
  categoryId,
  questionIndex,
}) {
  const [typeQcm, setTypeQcm] = useState([]);

  const imageInput = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [removeImage, setRemoveImage] = useState("0");
  const [hasImage, setHasImage] = useState(false);
  const [answers, setAnswers] = useState([
    <AnswerInput
      sectionIndex={sectionIndex}
      questionIndex={questionIndex}
      categoryId={categoryId}
    />,
  ]);

  let indiceQuestion = questionIndex + 1;

  const TypeQcmRequest = async () => {
    axios
      .get(`/qcm/create`)
      .then((res) => {
        setTypeQcm(res.data.typeQcms);
      })
      .catch((error) => console.error(error));
  };

  const addAnswerInput = () => {
    setAnswers((prev) => [
      ...prev,
      {
        id: Date.now(),
        component: (
          <AnswerInput
            sectionIndex={sectionIndex}
            questionIndex={questionIndex}
            answerIndex={answers.length}
            categoryId={categoryId}
          />
        ),
      },
    ]);
  };

  const removeAnswerInput = (indexToRemove) => {
    if (answers.length > 1) {
      setAnswers((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setRemoveImage("0");
      };

      reader.readAsDataURL(file);
    } else {
      setImageSrc(null);
      setRemoveImage("1");
    }
  };

  const handleCancelImage = () => {
    setImageSrc(null);
    setRemoveImage("1");
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  useEffect(() => {
    if (container.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      questionIndex = container.current.children.length;
    }
  }, []);

  useEffect(() => {
    TypeQcmRequest();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="p-6 bg-violet-50 rounded-xl">
          <div className="flex items-center gap-4 mb-6">
            <h5 className="text-lg font-semibold text-violet-900">
              Q{indiceQuestion}
            </h5>
            <input
              type="text"
              name={`sections[${sectionIndex}][questions][${questionIndex}][texteQuestion]`}
              placeholder="Entrer votre question"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              required
            />
            <select
              name={`sections[${sectionIndex}][questions][${questionIndex}][idTypeQcmQuestion]`}
              className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              required
            >
              <option value="" disabled>
                Type du question
              </option>
              {typeQcm.map((type) => {
                return (
                  <option value={type.id} key={type.id}>
                    {type.type}
                  </option>
                );
              })}
            </select>

            {!imageSrc ? (
              <label
                className="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-lg cursor-pointer bg-violet-100 hover:bg-violet-200"
                onClick={() => {
                  setHasImage(true);
                }}
                htmlFor="image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </label>
            ) : (
              <div className="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-lg cursor-pointer bg-violet-100 hover:bg-violet-200">
                <div className="relative w-full h-full">
                  <img
                    src={imageSrc}
                    alt="Selected"
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition-colors bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                {/* Bouton pour annuler l'image */}
              </div>
            )}
            <input
              type="file"
              name={`sections[${sectionIndex}][questions][${questionIndex}][image]`}
              onChange={handleImageChange}
              className="hidden"
              id="image"
            />

            <button
              onClick={() => deleteQuestion(questionIndex)}
              className="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-lg cursor-pointer bg-violet-100 hover:bg-violet-200"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          {answers.map((answer, index) => (
            <AnswerInput
              key={answer.id}
              sectionIndex={sectionIndex}
              questionIndex={questionIndex}
              answerIndex={index}
              onDelete={() => removeAnswerInput(index)}
              categoryId={categoryId}
            />
          ))}
          <div className="ml-6 space-y-2 answers-container"></div>
          <button
            type="button"
            onClick={addAnswerInput}
            className="flex items-center font-medium transition-colors duration-200 text-violet-600 hover:text-violet-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Ajouter une réponse
          </button>
        </div>
      </div>
    </>
  );
}
const AnswerInput = ({
  sectionIndex,
  questionIndex,
  answerIndex,
  onDelete,
  categoryId,
}) => {
  return (
    <>
      <div className="space-y-4">
        {/* Réponses existantes */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="grid items-center grid-cols-12 gap-4">
            <div className="col-span-1">
              <input
                type="radio"
                disabled
                className="w-4 h-4 border-gray-300 text-violet-600 focus:ring-violet-500"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                name={`sections[${sectionIndex}][questions][${questionIndex}][reponses][${answerIndex}][texteReponse]`}
                placeholder="Réponse"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                required
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                name={`sections[${sectionIndex}][questions][${questionIndex}][reponses][${answerIndex}][explicationReponse]`}
                placeholder="Explication"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  type="number"
                  name={`sections[${sectionIndex}][questions][${questionIndex}][reponses][${answerIndex}][points]`}
                  placeholder="Points"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  required
                />
                <span className="ml-2 text-sm text-gray-600">Pts</span>
              </div>
            </div>
            <div className="col-span-2">
              <input
                type="hidden"
                name={`sections[${sectionIndex}][questions][${questionIndex}][reponses][${answerIndex}][categorie_id]`}
                className="category-id"
                value={categoryId}
              />
            </div>
            <div className="col-span-1">
              <button
                type="button"
                onClick={() => onDelete(answerIndex)}
                className="text-gray-500 transition-colors duration-200 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
