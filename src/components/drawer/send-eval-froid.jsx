import { useState } from "react";
import DrawerParent from "./drawer-parent";
import axios from "../../config/axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { Loader2, Save } from "lucide-react";
import { IMAGE_URL } from "../../config/env";

export default function DrawerSendEvalFroid({
  isOpen,
  onClose,
  data,
  isLoading,
}) {
  const [submitting, setIsSubmitting] = useState(false);

  const handleSendEval = async (idProjet) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/cfp/evaluations/froids/${idProjet}`);
      if (res.data.status === 200) {
        toastr.success(res.data.message);
        onClose();
      } else {
        toastr.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSend = () => {
    if (!data || data.length === 0) return;
    const idProjet = data[0].idProjet;
    handleSendEval(idProjet);
  };

  const imgUrl = IMAGE_URL + "/img/employes";
  return (
    <div>
      <DrawerParent
        title="Liste des apprenants"
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="p-2 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-20">
            {isLoading ? (
              <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500">Chargement...</p>
                </div>
              </div>
            ) : data?.length === 0 ? (
              <div className="flex items-center justify-center h-[60vh]">
                Aucun apprenants
              </div>
            ) : (
              data?.map((learner) => (
                <div
                  key={learner.idEmploye}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-indigo-300 mb-3"
                >
                  {/* PHOTO */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-inner">
                    {learner.emp_photo ? (
                      <img
                        src={`${imgUrl}/${learner.emp_photo}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold bg-indigo-400 w-full h-full flex items-center justify-center">
                        {learner.emp_name?.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-[15px]">
                      {learner.emp_name} {learner.emp_firstname}
                    </p>

                    <p className="text-sm text-gray-500">
                      {learner.emp_email || (
                        <span className="italic text-gray-400">
                          Aucun email
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {data?.length !== 0 && (
            <div className="sticky bottom-0 left-0 bg-white p-3 flex justify-end">
              <button
                onClick={onSend}
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                <span className="ml-2">
                  {submitting ? "Envoye..." : "Envoyer l'évaluation"}
                </span>
              </button>
            </div>
          )}
        </div>
      </DrawerParent>
    </div>
  );
}
