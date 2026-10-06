import React, { useState } from "react";
import { projectService } from "../../../services/projectService";
import { modalityService } from "../../../services/modalityService";
import { purchaseOrderService } from "../../../services/purchase-order-service";
import { courseService } from "../../../services/courseService";

export function ProjectInformationDrawer(onClose, project) {
  const [courses, setCourses] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [modality, setModality] = useState([]);

  const detailProject = async () => {
    const { allModality, allOrders, allCourses } = await Promise.all(
      modalityService.getAllModality(),
      purchaseOrderService.getAllOrder(),
      courseService.getAllCourse()
    );

    setModality(allModality);
    setPurchaseOrders(allOrders);
    setCourses(allCourses);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose}
      />
      <motion.div
        className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-4xl overflow-hidden bg-white shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Modifier les informations générales
                  </h2>
                </div>
                <button
                  onClick={() => setShowPageInformation(false)}
                  className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                <div className="flex flex-col gap-4 h-full w-full min-w-[400px] overflow-x-scroll overflow-y-auto">
                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label
                        htmlFor="project_reference_edit"
                        className="text-slate-700"
                      >
                        Référence du projet (Numéro BC)
                      </label>
                      <p className="text-sm italic text-slate-500"></p>
                    </span>

                    {bc.length > 0 ? (
                      <div className="relative inline-flex w-full">
                        <select
                          id="project_reference_edit"
                          value={reference}
                          onChange={(e) => {
                            const selectedBc = bc.find(
                              (item) => item.numero_bc === e.target.value
                            );
                            setReference(e.target.value);
                            setidBc(selectedBc ? selectedBc.idBC : "");
                          }}
                          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Sélectionnez un numéro BC</option>
                          {bc.map((item, i) => (
                            <option key={i} value={item.numero_bc}>
                              {item.numero_bc}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="relative inline-flex w-full">
                        <input
                          id="project_reference_edit"
                          value={reference}
                          onChange={(e) => {
                            setReference(e.target.value);
                          }}
                          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label
                        htmlFor="project_title_edit"
                        className="text-slate-700"
                      >
                        Titre du projet
                      </label>
                      <p className="text-sm italic text-slate-500"></p>
                    </span>
                    <div className="relative inline-flex w-full">
                      <input
                        type="text"
                        id="project_title_edit"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        name="project_title_edit"
                        placeholder=""
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <span className="inline-flex items-center w-full gap-2">
                      <label
                        htmlFor="project_description_edit"
                        className="text-slate-700"
                      >
                        Description
                      </label>
                      <p className="text-sm italic text-slate-500"></p>
                    </span>
                    <textarea
                      value={description}
                      name="project_description_edit"
                      cols="30"
                      rows="6"
                      id="project_description_edit"
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                      style={{ height: "35px" }}
                    ></textarea>
                  </div>

                  <div className="flex grid flex-col w-full grid-cols-2 gap-4">
                    <div className="grid col-span-2 grid-cols-subgrid">
                      <label className="w-full">
                        <div className="label">
                          <span className="label-text">
                            Choisir la formation
                          </span>
                        </div>
                        <select
                          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={idModule}
                          onChange={(e) => setIdModule(e.target.value)}
                        >
                          <option value="">Selectionner une formation</option>
                          {tousModules?.modules
                            ?.slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((m, i) => (
                              <option key={i} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 col-span-2 gap-2">
                      <div className="grid col-span-1">
                        <label className="w-full">
                          <div className="label">
                            <span className="label-text">Début</span>
                          </div>
                          <input
                            className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={(e) => setDateDebut(e.target.value)}
                            value={projet.projet.dateDebut}
                            type="date"
                          />
                        </label>
                      </div>
                      <div className="grid col-span-1">
                        <label className="w-full">
                          <div className="label">
                            <span className="label-text">Echéance</span>
                          </div>
                          <input
                            className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onChange={(e) => setDateFin(e.target.value)}
                            value={projet.projet.dateFin}
                            type="date"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid col-span-2 grid-cols-subgrid">
                      <label className="w-full">
                        <div className="label">
                          <span className="label-text">Modalité</span>
                        </div>
                        <select
                          onChange={(e) => setIModalite(e.target.value)}
                          value={idModalite}
                          className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Selectionner une modalité</option>

                          {tousModalites?.modalites?.map((m, i) => (
                            <option key={i} value={m.idModalite}>
                              {m.modalite}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="inline-flex items-end justify-end w-full gap-4 pt-3 mb-14">
                    {/* Bouton Annuler */}
                    <button
                      type="button"
                      onClick={() => setShowPageInformation(false)}
                      className="px-6 py-3 font-medium text-gray-700 transition-all duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    >
                      Annuler
                    </button>

                    {/* Bouton Sauvegarder */}
                    <button
                      type="button"
                      onClick={() => updateProjet(id)}
                      className="relative px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-200 transform border border-purple-500 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:scale-105 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                    >
                      <span className="relative z-10">
                        Sauvegarder les modifications
                      </span>

                      {/* Effet de brillance au survol */}
                      <div className="absolute inset-0 transition-transform duration-700 ease-out -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:translate-x-full"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
