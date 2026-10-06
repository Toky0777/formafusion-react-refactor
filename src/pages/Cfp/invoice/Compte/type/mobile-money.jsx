import React, { useState } from "react";
import { NewMobileMoney } from "../Formulaire/new-mobile-money";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "../gestion-compte";
import { MessageModal } from "../message-modal";
import useApi from "../../../../../hooks/Api";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Pen, Plus, Trash2 } from "lucide-react";
export function MobileMoney({ data, setReload }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [drawerOpenId, setDrawerOpenId] = useState(null);
  const openDrawer = (id) => setDrawerOpenId(id);
  const closeDrawer = () => setDrawerOpenId(null);
  const [message, setMessage] = useState("");
  const { callApi } = useApi();
  const [type, setType] = useState(null);
  const { user } = useAuth();
  const onAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      //   for (let [key, value] of formData.entries()) {
      //     console.log(`${key}:`, value);
      //   }

      const response = await callApi(`/cfp/mobilemoneyAcount/update`, {
        method: "PUT",
        body: payload,
      });

      if (response.status === 200) {
        setMessage(response.message);
        closeDrawer();
        setTimeout(() => {
          setReload((u) => u + 1);
        }, 1000);
      } else {
        console.log("❌ Erreur :", response.message);
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await callApi(`/cfp/mobilemoneyAcount/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        console.log("✅ Succès :", response.message);
        setType("error");
        setSuccessMsg(response.message);
        setTimeout(() => {
          setReload((u) => u + 1);
        }, 1000);
      } else {
        console.log("❌ Erreur :", response.message);
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
    }
  };
  return (
    <>
      <section className="flex flex-col m-4">
        <div className="w-full border-[1px] border-gray-100 bg-white rounded-xl">
          <div className="flex items-center justify-between p-2">
            <h3 className="text-lg font-medium text-gray-600">
              Liste de vos compte mobile money
            </h3>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300  rounded hover:bg-gray-100 transition duration-150"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <p className="hidden md:block text-gray-700">
                Nouveau comptes mobile money
              </p>
            </button>
            {modalOpen && (
              <NewMobileMoney
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                setSuccessMsg={setSuccessMsg}
                setType={setType}
                setReload={setReload}
              />
            )}
            {successMsg && <MessageModal message={successMsg} type={type} />}
          </div>
          <hr className="border-[1px] border-gray-300 my-2"></hr>

          <table className="w-full">
            <thead>
              <tr className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer">
                <th className="p-2 font-semibold text-xs text-gray-500">#</th>
                <th className="p-2 font-semibold text-xs text-gray-500">
                  Titulaire
                </th>
                <th className="p-2 font-semibold text-xs text-gray-500">
                  Opérateur
                </th>
                <th className="p-2 font-semibold text-xs text-gray-500 text-end">
                  Téléphone
                </th>
                <th className="p-2 font-semibold text-xs text-gray-500 text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.mobile_money.length === 0 ? (
                <tr>
                  <td
                    className="p-2 text-xs text-gray-500 text-center"
                    colSpan="7"
                  >
                    Vous n'avez pas de compte mobile money pour l'instant
                  </td>
                </tr>
              ) : (
                data?.mobile_money.map((money, index) => (
                  <React.Fragment key={money.id}>
                    <tr className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer">
                      <td className="p-2 text-xs text-gray-500">{index + 1}</td>
                      <td className="p-2 text-xs text-gray-500">
                        {money.mm_titulaire}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {money.mm_operateur}
                      </td>
                      <td className="p-2 text-xs text-gray-500 text-end">
                        {money.mm_phone}
                      </td>
                      <td className="p-2 text-xs text-gray-500 flex justify-end space-x-1">
                        <div
                          onClick={() => openDrawer(money.id)}
                          className="text-xs text-gray-600 px-3 py-1 hover:bg-gray-200  rounded transition"
                        >
                          <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </div>
                        <button
                          onClick={() => handleDelete(money.id)}
                          className="text-xs text-gray-600 px-3 py-1 hover:bg-gray-200  rounded transition"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </button>
                      </td>
                      <AnimatePresence>
                        {drawerOpenId === money.id && (
                          <>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.4 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="fixed inset-0 bg-black"
                              onClick={closeDrawer}
                            />
                            <motion.div
                              initial={{ x: "100%" }}
                              animate={{ x: 0 }}
                              exit={{ x: "100%" }}
                              transition={{ duration: 0.3 }}
                              className="fixed top-0 right-0 z-50 h-screen w-[45em] max-w-full bg-white shadow-2xl overflow-y-auto"
                            >
                              <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                                <h2 className="text-lg font-medium text-gray-700">
                                  Éditer mon compte bancaire
                                </h2>
                                <button
                                  onClick={closeDrawer}
                                  className="text-gray-600 hover:bg-gray-200 p-2 rounded"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="p-4 space-y-4">
                                <form className="space-y-4" onSubmit={onAction}>
                                  <div className="flex flex-col justify-start w-full gap-2">
                                    <div className="flex flex-col w-full gap-1">
                                      <InputField
                                        type="text"
                                        name="mm_titulaire"
                                        label="Titulaire du compte"
                                        required={true}
                                        obli={true}
                                        defaultValue={money.mm_titulaire}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <InputField
                                        type="text"
                                        name="mm_operateur"
                                        label="Nom de votre operateur"
                                        required={true}
                                        obli={true}
                                        defaultValue={money.mm_operateur}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <InputField
                                        type="text"
                                        name="mm_phone"
                                        label="Numero téléphone de votre compte"
                                        required={true}
                                        obli={true}
                                        defaultValue={money.mm_phone}
                                      />
                                    </div>
                                    <input
                                      type="hidden"
                                      name="mm_idCustomer"
                                      value={user?.id}
                                    />
                                    <input
                                      type="hidden"
                                      value={money.id}
                                      name="id"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={closeDrawer}
                                      className="px-4 py-2 border rounded hover:bg-gray-100"
                                    >
                                      Annuler
                                    </button>
                                    <button
                                      type="submit"
                                      className="bg-[#A462A4] text-white hover:bg-[#8a4f8c] px-4 py-2 rounded font-semibold"
                                    >
                                      Modifier
                                    </button>
                                  </div>
                                </form>
                                {message && (
                                  <p className="text-green-600">{message}</p>
                                )}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
