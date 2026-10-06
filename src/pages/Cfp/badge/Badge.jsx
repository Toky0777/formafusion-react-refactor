
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaAward, FaCheckSquare, FaSearch, FaSync, FaPlus, FaTrash, FaEye, FaEdit } from "react-icons/fa";
import axios from '../../../config/axios';
import EditBadgeModal from '../../../components/badge/EditBadgeModal';
import toastr from 'toastr';
import Swal from 'sweetalert2';
import ViewBadgeModal from '../../../components/badge/ViewBadgeModal';
import { IMAGE_URL } from "../../../config/env";

function Badge() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewedBadge, setViewedBadge] = useState(null);

  const [badges, setBadges] = useState([]);
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);
  const [error, setError] = useState('');
  const endpoint = IMAGE_URL;


  useEffect(() => {
    setIsLoading(true);
    axios.get("/cfp/badge")
      .then((response) => {
        const { status, badges, modules } = response.data;
        // console.log(response.data);


        if (status === 200) {
          setBadges(badges);
          setModules(modules);
        } else {
          setError("Aucun badge trouvé.");
        }
      })
      .catch((err) => {
        console.error(err);


        if (err.response && err.response.status === 404) {
          setBadges([]);
          setModules([]);
          setError(null);
        } else {
          setError("Erreur lors du chargement des badges.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: 6000,
    progressBar: true,
  };

  const handleDelete = async (idBadge) => {

    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded mr-2',
        cancelButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded'
      },
      buttonsStyling: false



    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.post(`/cfp/badge/${idBadge}/delete`);

      if (response.data.status === 200) {

        toastr.success(response.data.message);


        setTimeout(() => {
          window.location.reload();
        }, 1800);


        setBadges(prev => prev.filter(b => b.idBadge !== idBadge));

      } else {
        alert(response.data.message || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const openViewModal = (badgeId) => {
    const badge = badges.find(b => b.idBadge === badgeId);
    if (!badge) {
      console.error("Badge non trouvé avec l'ID:", badgeId);
      return;
    }
    setViewedBadge(badge);
    setIsViewModalOpen(true);
  };

  if (error) return <p>{error}</p>;

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = searchTerm === '' ||
      badge.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.module_titre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule = !selectedModule || selectedModule === '' || badge.idModule.toString() === selectedModule;

    return matchesSearch && matchesModule;
  });



  const openEditModal = (badgeId) => {
    const badge = badges.find(b => b.idBadge === badgeId);
    if (!badge) {
      console.error("Badge non trouvé avec l'ID:", badgeId);
      return;
    }
    // console.log("Badge sélectionné:", badge); 
    setCurrentBadge(badge);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBadge(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] font-['Poppins']">
      <div className="py-6 mx-auto max-w-7xl">
        <div className="overflow-hidden bg-white rounded-lg shadow">

          <div className="px-6 py-6 text-white bg-gradient-to-r from-fuchsia-900 to-purple-700 sm:px-8">

            <h2 className="flex items-center text-2xl font-bold">
              <FaAward className="mr-3" />
              <span>Gestion des badges</span>
            </h2>
            <ul className="mt-1 ml-3 ">
              <li><FaCheckSquare className="inline mr-3" />Consultez tous vos badges existants.</li>
              <li><FaCheckSquare className="inline mr-3" />Utilisez les filtres pour trouver rapidement un badge spécifique.</li>
              <li><FaCheckSquare className="inline mr-3" />Modifiez ou supprimez vos badges au besoin.</li>
            </ul>
          </div>


          <div className="p-6">
            {/* Recherche et Filtres */}
            {badges.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                  <div className="relative sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Rechercher un badge..."
                      className="block w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute text-gray-400 left-3 top-3" />
                  </div>
                  <div className="sm:col-span-1">
                    <select
                      className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                    >
                      <option value="">Tous les modules</option>
                      {modules.map(module => (
                        <option key={module.idModule} value={module.idModule}>{module.moduleName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Liste  */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={badges.length === 0 ? 'hidden' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Badge</th>
                    <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell">Module</th>
                    <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell">Description</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBadges.length > 0 ? (
                    filteredBadges.map(badge => (
                      <tr key={badge.idBadge} className="transition-colors hover:bg-gray-50 group" data-module-id={badge.idModule}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="object-cover w-10 h-10 rounded-full"
                                src={`${endpoint}/${badge.image_path}`}
                                alt={badge.titre}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{badge.titre}</div>
                              <div className="text-sm text-gray-500">{badge.sous_titre}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                          <div className="text-sm text-gray-900">{badge.module_titre}</div>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <div className="text-sm text-gray-500 line-clamp-2">{badge.description}</div>
                          <div className="flex justify-center mt-2">
                            <button
                              className="text-purple-500 hover:text-blue-900"
                              onClick={() => openViewModal(badge.idBadge)}
                              title="Description"
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex justify-center space-x-3 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() =>
                                openEditModal(badge.idBadge)
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete(badge.idBadge)}
                            >
                              <FaTrash />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : badges.length > 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FaSearch className="mb-2 text-4xl text-gray-300" />
                          <p className="font-medium">Aucun badge ne correspond à votre recherche</p>
                          <p className="mt-1">Essayez avec d'autres termes ou critères</p>
                          <button
                            className="flex items-center px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            onClick={() => {
                              setSearchTerm('');
                              setSelectedModule('');
                            }}
                          >
                            <FaSync className="mr-2" />
                            <span>Réinitialiser la recherche</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FaAward className="mb-2 text-4xl text-gray-300" />
                          <p className="font-medium">Aucun badge disponible</p>
                          <p className="mt-1">Commencez par créer votre premier badge</p>
                          <button className="flex items-center px-4 py-2 mt-4 text-white rounded-md bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:bg-indigo-700">
                            <FaPlus className="mr-2" />
                            <Link to="/cfp/badge/creer">Créer un badge</Link>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>




      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50  bg-opacity-70 backdrop-blur-[2px]">
          <div className="px-8 py-5 rounded-3xl ">
            <div className="flex flex-col items-center">

              <div class="flex-col gap-4 w-full flex items-center justify-center">
                <div class="w-28 h-28 border-8 text-fuchsia-800 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-fuchsia-700 rounded-full">
                  <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <EditBadgeModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        badge={currentBadge}
      />

      <ViewBadgeModal
        isOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
        badge={viewedBadge}
      />


    </div>


  );
}

export default Badge;