import { AnimatePresence, motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { STORAGE_URL } from "../../../config/env";

export function FolderDrawer({data, onClose}) {
  const { idProjet, doc , nomDossier } = data

  console.log(doc);
  
return (
  <AnimatePresence>
      <>
        {/* Overlay noir semi-transparent */}
        <motion.div
          className="fixed inset-0 backdrop-blur-sm z-40000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panneau de formulaire */}
        <motion.div
          key="dossierPanel"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full bg-white w-[1010px] z-500000 shadow-lg "
        >
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex justify-end">
            <div className="relative w-full max-w-5xl bg-white shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
                <div className="flex items-center gap-4">
                  

                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <FaXmark className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Table des documents */}
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left rounded-lg border border-gray-200">
                  <caption className="text-lg font-semibold mb-4">
                    Documents dans ce dossier
                  </caption>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2"></th>
                      <th className="p-2">Titre</th>
                      <th className="p-2">Section</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Extension</th>
                      <th className="p-2 text-right">Taille</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(doc) &&
                    doc?.length > 0 ? (
                      doc.map((doc, i) => (
                        <tr
                          key={doc.idDocument}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="text-center cursor-pointer text-gray-500 hover:text-purple-600">
                            {i + 1}
                          </td>
                          <td className="p-2 text-gray-600">{doc.titre}</td>
                          <td className="p-2 text-gray-600">
                            {doc.section_document}
                          </td>
                          <td className="p-2 text-gray-600">
                            {doc.type_document}
                          </td>
                          <td className="p-2 text-gray-600">
                            {doc.updated_at}
                          </td>
                          <td className="p-2 text-gray-600">{doc.extension}</td>
                          <td className="p-2 text-right text-gray-600">
                            {doc.taille} Mo
                          </td>
                          <td className="p-2 text-center">
                            <a
                              href={`${STORAGE_URL}/${doc.path}`}
                              download={doc.filename}
                              className="p-2 rounded-full hover:bg-gray-200 inline-flex"
                            >
                              <FaDownload className="w-4 h-4 text-gray-700" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="p-4 text-center text-gray-500"
                        >
                          Aucun document trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </>
  </AnimatePresence>
)
}
