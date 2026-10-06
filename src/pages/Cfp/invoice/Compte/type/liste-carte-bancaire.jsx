import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "../gestion-compte";
import axios from "../../../../../config/axios";
import { NewCarteBancaire } from "../Formulaire/new-carte-bancaire";
import useApi from "../../../../../hooks/Api";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Pen, Plus, Trash2 } from "lucide-react";

export function ListeCarteBancaire({ data, setReload }) {
  const [drawerOpenId, setDrawerOpenId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const openDrawer = (id) => setDrawerOpenId(id);
  const closeDrawer = () => setDrawerOpenId(null);
  const [successMsg, setSuccessMsg] = useState(""); // 🆕 message
  const { callApi } = useApi();
  const { user } = useAuth();
  const handleDelete = async (id) => {
    try {
      const response = await callApi(`/cfp/bankAccount/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        console.log("✅ Succès :", response.message);
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

  const onAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    console.log(payload);
    try {
      // Utilisation de l'instance axios configurée
      const res = await axios.put(
        `/cfp/bankAccount/${payload.id}`,
        payload
      );

      if (res.data.status === 200) {
        setMessage(res.data.message);
        closeDrawer(); // Ferme le drawer après succès
        setReload((u) => u + 1);
      } else {
        console.warn("Mise à jour échouée :", res.data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };
  return (
    <>
      <section className="flex flex-col m-4">
        <div className="w-full border-[1px] border-gray-100 bg-white rounded-xl">
          <div className="flex items-center justify-between p-2">
            <h3 className="text-lg font-medium text-gray-600">
              Liste de vos compte bancaire
            </h3>
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-700 transition duration-150 border border-purple-500  rounded hover:bg-gray-100"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <p className="hidden md:block">Nouveau comptes bancaires</p>
            </button>
            {modalOpen && (
              <NewCarteBancaire
                data={data}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                setSuccessMsg={setSuccessMsg}
                setReload={setReload}
              />
            )}
            {successMsg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-2xl animate-fade-in">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold text-green-600">
                    {successMsg}
                  </h2>
                </div>
              </div>
            )}
          </div>
          <hr className="border-[1px] border-gray-300 my-2" />
          <table className="w-full">
            <thead>
              <tr className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer">
                <th className="p-2 text-xs font-semibold text-gray-500">#</th>
                <th className="p-2 text-xs font-semibold text-gray-500">
                  Titulaire
                </th>
                <th className="p-2 text-xs font-semibold text-gray-500">
                  Banque
                </th>
                <th className="p-2 text-xs font-semibold text-gray-500">
                  Quartier
                </th>
                <th className="p-2 text-xs font-semibold text-gray-500">
                  Code Postal
                </th>
                <th className="p-2 text-xs font-semibold text-gray-500 text-end">
                  Numéro de compte
                </th>
                <th className="p-2 text-xs font-semibold text-gray-500 text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.bankacounts.length === 0 ? (
                <tr>
                  <td
                    className="p-2 text-base text-center text-gray-500"
                    colSpan="7"
                  >
                    Vous n'avez pas de compte bancaire pour l'instant
                  </td>
                </tr>
              ) : (
                data.bankacounts.map((account, index) => (
                  <React.Fragment key={account.idAcount}>
                    <tr className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer">
                      <td className="p-2 text-xs text-gray-500">{index + 1}</td>
                      <td className="p-2 text-xs text-gray-500">
                        {account.ba_titulaire}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {account.ba_name}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {account.ba_quartier}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {account.vi_code_postal}-{account.ville_name}
                      </td>
                      <td className="p-2 text-xs text-gray-500 text-end">
                        {account.ba_account_number}
                      </td>
                      <td className="flex justify-end p-2 space-x-1 text-xs text-gray-500">
                        <div
                          onClick={() => openDrawer(account.idAcount)}
                          className="px-3 py-1 text-xs text-gray-600 transition   rounded hover:bg-gray-200"
                        >
                          <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </div>
                        <button
                          onClick={() => handleDelete(account.idAcount)}
                          className="px-3 py-1 text-xs text-gray-600 transition   rounded hover:bg-gray-200"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-green-600" />
                        </button>
                      </td>
                    </tr>

                    <AnimatePresence>
                      {drawerOpenId === account.idAcount && (
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
                                className="p-2 text-gray-600 rounded hover:bg-gray-200"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="p-4 space-y-4">
                              <form className="space-y-4" onSubmit={onAction}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={account.idAcount}
                                />
                                <InputField
                                  name="ba_titulaire"
                                  label="Titulaire du compte"
                                  obli
                                  defaultValue={account.ba_titulaire}
                                />
                                <InputField
                                  name="ba_name"
                                  label="Banque"
                                  obli
                                  defaultValue={account.ba_name}
                                />
                                <InputField
                                  name="ba_quartier"
                                  label="Quartier"
                                  obli
                                  defaultValue={account.ba_quartier}
                                />
                                <div>
                                  <label className="block mb-1 text-base">
                                    Code postal{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <select
                                    name="ba_idPostal"
                                    defaultValue={account.ba_idPostal}
                                    className="w-full border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#A462A4]"
                                  >
                                    {data.ville_codeds.map((ville) => (
                                      <option key={ville.id} value={ville.id}>
                                        {ville.ville_name} -{" "}
                                        {ville.vi_code_postal}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <InputField
                                  name="ba_account_number"
                                  label="Numéro de compte"
                                  defaultValue={account.ba_account_number}
                                />
                                <input
                                  type="hidden"
                                  name="ba_idCustomer"
                                  value={user?.id}
                                />

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
