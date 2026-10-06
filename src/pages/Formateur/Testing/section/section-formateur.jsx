import React, { useRef, useState } from "react";
import { CreateQuestionFormateur } from "./create-question-formateur";
import SearchCategoryFormateur from "./search-category-formateur";

export function Section({ sectionCount, onDeleteSection }) {
  const [createdQuestion, setCreatedQuestion] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  let sectionIndex = sectionCount;
  const ContainerQuestionRef = useRef();
  const [nextId, setNextId] = useState(0); // ID unique qui s'incrémente

  const AddQuestion = () => {
    const currentQuestionIndex = createdQuestion.length;
    const uniqueId = nextId;

    setCreatedQuestion((prev) => [
      ...prev,
      {
        id: uniqueId, // ID unique permanent
        questionIndex: currentQuestionIndex, // Index pour l'affichage
        element: (
          <CreateQuestionFormateur
            sectionIndex={sectionIndex}
            questionIndex={currentQuestionIndex}
            container={ContainerQuestionRef}
            categoryId={categoryId}
            deleteQuestion={() => handleDeleteQuestion(uniqueId)}
          />
        ),
      },
    ]);

    setNextId(nextId + 1); // Incrémente l'ID unique
  };

  const handleDeleteQuestion = (idToDelete) => {
    setCreatedQuestion((prev) => {
      // Filtre la question à supprimer par son ID unique
      const filteredQuestions = prev.filter((q) => q.id !== idToDelete);

      // Remet à jour les questionIndex pour qu'ils soient séquentiels
      return filteredQuestions.map((question, index) => ({
        ...question,
        questionIndex: index,
        element: React.cloneElement(question.element, {
          questionIndex: index,
          deleteQuestion: () => handleDeleteQuestion(question.id), // Garde l'ID unique
        }),
      }));
    });
  };

  const handleCategoryIdUpdate = (sectionIdx, catId) => {
    setCategoryId(catId);
  };

  return (
    <>
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <SearchCategoryFormateur
              sectionIndex={sectionIndex}
              updateCategoryIdInAnswers={handleCategoryIdUpdate}
            />
          </div>
          <button
            type="button"
            className="delete-section text-[#c7c7ce] hover:text-[#64748b] p-2"
            onClick={() => onDeleteSection(sectionCount)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
        {createdQuestion.map(({ id, element, questionIndex }) =>
          React.cloneElement(element, { key: id, categoryId })
        )}
        <button
          type="button"
          onClick={AddQuestion}
          className="add-question w-full bg-[#c7c7ce] text-white hover:bg-[#64748b] font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter une question
        </button>
      </div>
    </>
  );
}
