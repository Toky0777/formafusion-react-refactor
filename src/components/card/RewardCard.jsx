import {
  BookOpen,
  Calendar,
  Gift,
  Sparkles,
  Trash,
  Mail,
  Phone,
} from "lucide-react";
import { formatMonetaire } from "../../utils/global";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DeleteConfirmationModal from "../Modals/delete-modal";
import T from "../translate/AutoTranslator";

export default function RewardCard({ code, reward, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const { symbol } = useAuth();

  const handleConfirmDelete = async (reward) => {
    try {
      await onDelete(reward.id);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const cfpSection = (
    <div className="px-3 py-2 mt-4 border border-blue-100 text-md md:flex-row rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
      <p className="mb-2 font-semibold text-gray-500 text-md">
        Contacter le centre de formation pour utiliser ta récompense :
      </p>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-4">
        <p className="font-semibold text-blue-700">{reward.cfp_name}</p>

        <div className="flex items-center gap-2 justify-end text-blue-600">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{reward.cfp_email}</span>
          </div>
          <span>-</span>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{reward.cfp_phone_number}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group">
      <div className="relative overflow-hidden transition-all duration-300 border border-yellow-200 shadow bg-gradient-to-br from-white via-yellow-50 to-pink-50 rounded-2xl">
        <div className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-r from-yellow-400/10 via-pink-400/10 to-purple-400/10 opacity-80 group-hover:opacity-100"></div>
        {code === "cfp" && (
          <div className="absolute top-2 right-2 z-20 cursor-pointer">
            {/* <button className="p-2 text-gray-400  rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-200 ">
              <Pencil size={20} />
            </button> */}
            <button
              onClick={() => setShowModal(true)}
              className="p-2 text-gray-400  rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-200"
            >
              <Trash size={20} />
            </button>
          </div>
        )}

        <div className="absolute top-0 left-0 z-10">
          <div className="flex items-center gap-2 px-4 py-2 text-white shadow bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-br-xl rounded-tl-xl">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-base font-bold tracking-wider drop-shadow-lg">
              {reward.reward_type_name === "Gratuit" ? (
                <T>gratuites</T>
              ) : (
                <span>- {reward.reward_reduction}%</span>
              )}
            </span>
          </div>
        </div>

        <div className="relative p-4 pt-12">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 shadow bg-gradient-to-br from-yellow-400 to-pink-500 rounded-xl">
                <Gift className="text-white w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 mb-3 md:flex-row">
            <div className="flex-1 text-center md:text-right">
              <p className="mb-0.5 text-md text-gray-500">
                <T>Prix normal</T>
              </p>
              <p className="text-base font-semibold text-gray-400 line-through">
                {formatMonetaire(reward.normal_price_per_place)} {symbol}{" "}
                <T>/place</T>
              </p>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="mb-0.5 text-md font-bold tracking-wider text-yellow-600 uppercase">
                <T>Économie</T>
              </p>
              <p className="text-xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text drop-shadow-lg">
                {formatMonetaire(reward.price_with_reduction)} {symbol}
              </p>
            </div>
          </div>

          <div className="mb-2 text-center">
            <h4 className="mb-1 text-lg font-bold text-gray-800">
              <span className="text-transparent bg-gradient-to-r from-yellow-600 to-pink-600 bg-clip-text">
                {reward.reward_place_number}{" "}
                {reward.reward_place_number > 1 ? <T>places</T> : <T>place</T>}
              </span>
              <span className="ml-2 text-lg font-semibold text-gray-700">
                {reward.reward_reduction !== 0 ? (
                  <>-{reward.reward_reduction}%</>
                ) : (
                  <T>GRATUIT</T>
                )}
              </span>
            </h4>
            <p className="text-sm font-semibold text-gray-500">
              {reward.etp_name}
            </p>
          </div>

          <div className="px-3 py-2 mb-2 italic text-gray-700 border-l-4 border-yellow-400 rounded-r-lg text-md bg-gradient-to-r from-gray-50 to-gray-100">
            "{reward.reward_description}"
          </div>

          <div className="flex flex-col gap-2 mb-2 md:flex-row">
            <div className="flex items-center flex-1 p-2 rounded-lg bg-blue-50">
              <div className="flex items-center justify-center mr-2 bg-blue-500 rounded-full w-7 h-7">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="mb-0 font-semibold tracking-wide text-blue-600 uppercase text-md">
                  <T>Début</T>
                </p>
                <p className="mb-0 font-bold text-blue-800 text-md">
                  {reward.start_date}
                </p>
              </div>
            </div>
            <div className="flex items-center flex-1 p-2 rounded-lg bg-blue-50">
              <div className="flex items-center justify-center mr-2 bg-blue-500 rounded-full w-7 h-7">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="mb-0 font-semibold tracking-wide text-blue-600 uppercase text-md">
                  <T>Expiration</T>
                </p>
                <p className="mb-0 font-bold text-blue-800 text-md">
                  {reward.expired_date}
                </p>
              </div>
            </div>
            <div className="flex items-start flex-1 p-2 rounded-lg bg-green-50">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-md font-semibold tracking-wide text-green-600 uppercase mb-0.5">
                  <T>Cours inclus</T>
                </p>
                {reward.id_reward_scope === 1 ? (
                  <div className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-green-500" />
                    <span className="font-bold text-green-700 text-md">
                      <T> Tous les cours</T>
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-green-700 text-md mb-0.5">
                      {reward.reward_scope_description}
                    </p>
                    <div className="space-y-1">
                      {reward.reward_catalogue_contents.map((course, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 mr-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                          <span className="font-medium text-green-800 text-md">
                            {course.module_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {code == "etp" && cfpSection}
        </div>
      </div>
      {showModal && (
        <DeleteConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleConfirmDelete(reward)}
        />
      )}
    </div>
  );
}
