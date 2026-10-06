import { useState } from "react";
import { NewAdresseInvoice } from "../Formulaire/new-adresse-invoice";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "../gestion-compte";
import { MessageModal } from "../message-modal";
import useApi from "../../../../../hooks/Api";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Plus,Pen, Trash2 } from "lucide-react";
export function ListeFacturation({ data, setReload }) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [drawerOpenId, setDrawerOpenId] = useState(null);
  const openDrawer = (id) => setDrawerOpenId(id);
  const closeDrawer = () => setDrawerOpenId(null);
  const { callApi } = useApi();
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const onAction = async (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await callApi(`/companies/${id}`, {
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
      const response = await callApi(`/companies/${id}`, {
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
    <section className="flex flex-col m-4">
      <div className="w-full border-[1px] border-gray-100 bg-white rounded-xl">
        <div className="flex items-center justify-between p-2">
          <h3 className="text-lg font-medium text-gray-600">
            Liste de vos adresses de facturation
          </h3>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700  transition duration-150 border border-gray-500 rounded hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
            <p className="hidden md:block">Nouveau adresse de facturation</p>
          </button>
          {modalOpen && (
            <NewAdresseInvoice
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              setSuccessMsg={setSuccessMsg}
              setType={setType}
              setReload={setReload}
            />
          )}
          {successMsg && <MessageModal message={successMsg} type={type} />}
        </div>
        <hr className="my-2 border border-gray-300" />
        <table className="w-full">
          <thead>
            <tr className="duration-150 border-b border-gray-100 cursor-pointer hover:bg-gray-50">
              {[
                "ID",
                "Nom",
                `${setting?.nif_name}`,
                `${setting?.stat_name}`,
                "Adresse",
                "RCS",
                "Email",
                "Téléphone",
                "Site Web",
                "Action",
              ].map((title) => (
                <th
                  key={title}
                  className="p-2 text-xs font-semibold text-left text-gray-500"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.companies.length === 0 ? (
              <tr>
                <td
                  className="p-2 text-base text-center text-gray-500"
                  colSpan="7"
                >
                  Vous n'avez pas de compte bancaire pour l'instant
                </td>
              </tr>
            ) : (
              data.companies.map((companies, index) => (
                <tr
                  key={companies.id}
                  className="duration-150 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                >
                  <td className="p-2 text-xs text-gray-500">{index + 1}</td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.name}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.nif || "aucun"}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.stat || "aucun"}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.adresse}
                  </td>
                  <td className="p-2 text-xs text-gray-500">{companies.rcs}</td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.mail}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.phone}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {companies.website}
                  </td>
                  <td className="flex justify-end p-2 space-x-1 text-xs text-gray-500">
                    <a
                      onClick={() => openDrawer(companies.id)}
                      className="px-3 py-1 text-xs text-gray-600 transition  rounded hover:bg-gray-200"
                    >
                     <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                    </a>

                    <input type="hidden" name="_token" value="CSRF_TOKEN" />
                    <input type="hidden" name="_method" value="delete" />
                    <button
                      onClick={() => handleDelete(companies.id)}
                      className="px-3 py-1 text-xs text-gray-600 transition  rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-green-600" />
                    </button>
                  </td>
                  <AnimatePresence>
                    {drawerOpenId === companies.id && (
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
                            <form
                              className="space-y-4"
                              onSubmit={(e) => onAction(e, companies.id)}
                            >
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="name"
                                    label="Raison social"
                                    required={true}
                                    obli
                                    defaultValue={companies.name}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="nif"
                                    label={setting?.nif_name}
                                    defaultValue={companies.nif}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="stat"
                                    label={setting?.stat_name}
                                    defaultValue={companies.stat}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="rcs"
                                    label="RCS"
                                    required={true}
                                    obli
                                    defaultValue={companies.rcs}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="adresse"
                                    label="Adresse"
                                    required={true}
                                    obli
                                    defaultValue={companies.adresse}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="email"
                                    name="mail"
                                    label="email"
                                    required={true}
                                    obli
                                    defaultValue={companies.mail}
                                  />
                                </div>

                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="phone"
                                    label="Téléphone"
                                    required={true}
                                    obli
                                    defaultValue={companies.phone}
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <InputField
                                    type="text"
                                    name="website"
                                    label="Site Web"
                                    obli
                                    defaultValue={companies.website}
                                  />
                                </div>
                                <input
                                  type="hidden"
                                  name="idCustomer"
                                  value={user?.id}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
