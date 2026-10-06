import { useState, useEffect } from "react";
import axios from "../../../config/axios";
import codePostal from "../../../components/codePostal/codePostal";
import { useOutletContext } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Trash,
  Users,
  Building,
  Plus,
  Pencil,
  RotateCcw,
  Save,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ModalModificationLieuEtSalle from "../../../components/Modals/place/ModalModificationLieuEtSalle";
import ModalDelete from "../../../components/Modals/place/ModalDelete";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../../components/ui/loading-spinner";
export default function Place() {
  const {
    lieux,
    searchTerm,
    setLieux,
    filterType,
    filterPostal,
    filterRegion,
  } = useOutletContext();

  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("grid");
  const [isFormOpenUpdate, setIsFormOpenUpdate] = useState(false);
  const [selectedLieuSalle, setSelectedLieuSalle] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  // État local pour les salles
  const [showInput, setShowInput] = useState(false);
  const [showInputLieuId, setShowInputLieuId] = useState(null);
  const [newSalleName, setNewSalleName] = useState("");
  const [editingSalleId, setEditingSalleId] = useState(null);
  const [editingSalleValue, setEditingSalleValue] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (lieuId, section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [lieuId]: {
        ...prev[lieuId],
        [section]: !prev[lieuId]?.[section], // inverse uniquement la section du lieu concerné
      },
    }));
  };

  // Pour l'ajout d'un nouveau contact
  const [showInputContact, setShowInputContact] = useState(null);
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Pour l'édition d'un contact existant
  const [editingContactPerson, setEditingContactPerson] = useState("");
  const [editingContactEmail, setEditingContactEmail] = useState("");
  const [editingContactPhone, setEditingContactPhone] = useState("");

  // État local pour les lieux
  const [currentpage, setCurrentpage] = useState(1);
  const [data, setData] = useState([]);

  // Fonction pour obtenir le nom de la région
  const getRegionName = (regionCode) => {
    switch (regionCode) {
      case "1":
        return "Antananarivo";
      case "2":
        return "Antsirabe";
      case "3":
        return "Fianarantsoa";
      case "4":
        return "Mahajanga";
      case "5":
        return "Toamasina";
      case "6":
        return "Toliary";
      default:
        return "Région inconnue";
    }
  };

  const detectType = (lieu) => {
    switch (Number(lieu.idLieuType)) {
      case 2:
        return {
          label: "Privée",
          color: "bg-blue-100 text-blue-800",
          infoColor: "text-green-500",
          info: lieu.customerName || "Numerika",
        };
      case 3:
        return {
          label: "Location",
          color: "bg-green-100 text-green-800",
          infoColor: "text-blue-500",
          info: lieu.cfpName || "",
        };
      default:
        return {
          label: "Public",
          color: "bg-purple-100 text-purple-800",
          infoColor: "text-orange-500",
          info: "Client",
        };
    }
  };

  // Fonction pour récupérer les contacts
  const fetchContact = async () => {
    try {
      const response = await axios.get(`/cfp/contacts`);
      return response.data.contacts;
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts :", error);
      return [];
    }
  };

  // Fonction pour récupérer les salles
  const fetchSalles = async () => {
    try {
      const response = await axios.get("/cfp/salles");
      return response.data.salles;
    } catch (error) {
      console.error("Erreur lors de la récupération des salles", error);
      return [];
    }
  };

  // Fonction principale pour récupérer les données
  const fetchData = async (filtre = ["0"]) => {
    setLoading(true);
    try {
      const url = "/cfp/lieux";

      // Paramètres dynamiques
      let params = {};
      if (filterType.length > 0) {
        params.type = filterType.join(",");
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const [fetchedContacts, salles] = await Promise.all([
        fetchContact(),
        fetchSalles(),
      ]);

      const lieuxRes = await axios.get(url);

      const lieux = lieuxRes.data.lieux_addSalle || [];
      const lieuxSalle = lieuxRes.data.lieux_salles || [];
      const type = lieuxRes.data.lieu_types || [];
      const lieuxAvecSalles = lieux.map((lieu) => {
        const sallesAssocies = salles.filter(
          (salle) =>
            salle.lieu_name?.trim().toLowerCase() ===
            lieu.li_name?.trim().toLowerCase()
        );

        const contactsAssocies = fetchedContacts.filter(
          (c) => c.idLieu === lieu.idLieu
        );

        const codePostalInfo = codePostal.find(
          (c) => Number(c.code) === Number(lieu.vi_code_postal)
        );
        const region = codePostalInfo
          ? getRegionName(codePostalInfo.region)
          : "Région inconnue";

        return {
          ...lieu,
          salles: sallesAssocies,
          contacts: contactsAssocies,
          villeRegion: region,
        };
      });

      setLieux(lieuxAvecSalles);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    if (updatedData) {
      setLieux((prevLieux) =>
        prevLieux.map((lieu) =>
          lieu.idLieu === updatedData.idLieu ? updatedData : lieu
        )
      );
    } else {
      // Rafraîchissement complet des données
      const typeParam = filterType.length > 0 ? filterType : ["0"];
      fetchData(typeParam);
    }
  };

  //suppression lieu
  const handleLocalDeleteLieu = (id) => {
    setLieux((prev) => prev.filter((lieu) => lieu.idLieu !== id));
  };

  //ajout salle
  const handleAddSalle = async (lieu) => {
    if (!newSalleName.trim()) return;
    try {
      const response = await axios.post("/cfp/salles", {
        salle_name: newSalleName,
        idLieu: lieu.idLieu,
      });

      const newSalle = {
        idSalle: response.data, // retourne l'ID du backend
        salle_name: newSalleName,
      };

      // Met à jour la liste des lieux avec la nouvelle salle
      setLieux((prevLieux) =>
        prevLieux.map((l) =>
          l.idLieu === lieu.idLieu
            ? { ...l, salles: [...(l.salles || []), newSalle] }
            : l
        )
      );

      setNewSalleName("");
      setShowInput(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la salle :", err);
    }
  };
  //suppression salle
  const handleDeleteSalle = async (idSalle) => {
    try {
      const response = await axios.delete(`/cfp/salles/${idSalle}`);
      if (response.data.status === 200) {
        setLieux((prevLieux) =>
          prevLieux.map((lieu) => ({
            ...lieu,
            salles: lieu.salles?.filter((salle) => salle.idSalle !== idSalle),
          }))
        );
      } else {
      }
    } catch (error) {}
  };
  //modification salle
  const handleSubmitUpdateSalle = async (idSalle) => {
    if (!editingSalleValue.trim()) {
      toast.error("Le nom de la salle ne peut pas être vide");
      return;
    }

    try {
      const response = await axios.post(`/cfp/updateNameSalle/${idSalle}`, {
        salle_name: editingSalleValue,
      });

      if (response.status === 200) {
        // Mise à jour immédiate du state React
        setLieux((prevLieux) =>
          prevLieux.map((lieu) => ({
            ...lieu,
            salles: lieu.salles?.map((salle) =>
              salle.idSalle === idSalle
                ? { ...salle, salle_name: editingSalleValue } // Mise à jour instantanée
                : salle
            ),
          }))
        );
        setEditingSalleId(null);
        setEditingSalleValue("");
      } else {
        console.error("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la salle :", err);
    }
  };

  //ajout contact
  // const handleContact = async (lieu) => {
  //     if (!newContactPerson.trim() || !newContactEmail.trim() || !newContactPhone.trim()) {
  //         toast.error("Veuillez remplir tous les champs !");
  //         return;
  //     }

  //     try {
  //         const formData = new FormData();
  //         formData.append("idLieu", lieu.idLieu);
  //         formData.append("name", newContactPerson);
  //         formData.append("email", newContactEmail);
  //         formData.append("phone", newContactPhone);

  //         const response = await axios.post(`/cfp/contacts`, formData);

  //         if (response.data.status === 200) {
  //             const newContact = {
  //                 idContact: response.data.contactId,
  //                 contact_name: newContactPerson,
  //                 contact_email: newContactEmail,
  //                 contact_tel: newContactPhone,
  //                 idLieu: lieu.idLieu
  //             };

  //             setLieux(prevLieux =>
  //                 prevLieux.map(l =>
  //                     l.idLieu === lieu.idLieu
  //                         ? { ...l, contacts: [...(l.contacts || []), newContact] }
  //                         : l
  //                 )
  //             );
  //             setNewContactPerson("");
  //             setNewContactEmail("");
  //             setNewContactPhone("");

  //             toast.success("Contact ajouté avec succès !");
  //         } else {
  //             console.log(response.data.message );
  //         }
  //     } catch (error) {
  //         console.error(error);
  //         toast.error("Erreur lors de l'ajout du contact");
  //     }
  // };

  const handleContact = async (lieu) => {
    if (
      !newContactPerson.trim() ||
      !newContactEmail.trim() ||
      !newContactPhone.trim()
    ) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("idLieu", lieu.idLieu);
      formData.append("name", newContactPerson);
      formData.append("email", newContactEmail);
      formData.append("phone", newContactPhone);

      const response = await axios.post(`/cfp/contacts`, formData);

      if (response.data.status === 200) {
        const newContact = {
          idContact: response.data.contactId,
          contact_name: newContactPerson,
          contact_email: newContactEmail,
          contact_tel: newContactPhone,
          idLieu: lieu.idLieu,
        };

        // Mise à jour instantanée
        setLieux((prevLieux) =>
          prevLieux.map((l) =>
            l.idLieu === lieu.idLieu
              ? { ...l, contacts: [...(l.contacts || []), newContact] }
              : l
          )
        );

        // Réinitialiser les champs
        setNewContactPerson("");
        setNewContactEmail("");
        setNewContactPhone("");

        toast.success("Contact ajouté avec succès !");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du contact");
    }
  };

  //modification contact
  const handleUpdate = async (idContact, lieu) => {
    try {
      const response = await axios.patch(`/cfp/contacts/${idContact}/update`, {
        name: editingContactPerson,
        email: editingContactEmail,
        phone: editingContactPhone,
      });

      if (response.data.success) {
        setLieux((prevLieux) =>
          prevLieux.map((l) =>
            l.idLieu === lieu.idLieu
              ? {
                  ...l,
                  contacts: l.contacts.map((c) =>
                    c.idContact === idContact
                      ? {
                          ...c,
                          contact_name: editingContactPerson,
                          contact_email: editingContactEmail,
                          contact_tel: editingContactPhone,
                        }
                      : c
                  ),
                }
              : l
          )
        );

        setEditingSalleId(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du contact");
    }
  };

  //suprpession contact
  const handleDeleteContact = async (idContact, idLieu) => {
    if (!idContact) {
      return;
    }
    try {
      const response = await axios.delete(`/cfp/contacts/${idContact}/delete`);

      if (response.data.status) {
        toast.success(response.data.message);

        // Supprimer le contact du state React immédiatement
        setLieux((prevLieux) =>
          prevLieux.map((lieu) =>
            lieu.idLieu === idLieu
              ? {
                  ...lieu,
                  contacts: lieu.contacts.filter(
                    (c) => c.idContact !== idContact
                  ),
                }
              : lieu
          )
        );

        // Réinitialiser les states liés au formulaire/édition
        setEditingSalleId(null);
        setNewContactPerson("");
        setNewContactEmail("");
        setNewContactPhone("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du contact");
    }
  };

  // Effet pour charger les données initiales et quand le filtre change
  useEffect(() => {
    const typeParam = filterType.length > 0 ? filterType : ["0"];
    fetchData(typeParam);
    setCurrentpage(1);
  }, [filterType]);

  //Filtrage local par searchTerm
  // const filteredLieux = Array.isArray(lieux)
  //     ? lieux
  //         .filter(lieu => lieu && lieu.li_name)
  //         .filter(lieu =>
  //             lieu.li_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //             lieu.li_name.toLowerCase() !== 'default'
  //         )
  //         .filter(lieu =>
  //             filterPostal
  //                 ? String(lieu.vi_code_postal).includes(filterPostal)
  //                 : true
  //         )
  //         .filter(lieu =>
  //             filterRegion
  //                 ? lieu.villeRegion?.toLowerCase().includes(filterRegion.toLowerCase())
  //                 : true
  //         )
  //     : [];
  const filteredLieux = Array.isArray(lieux)
    ? lieux.filter(
        (lieu) =>
          lieu.li_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          lieu.li_name.toLowerCase() !== "default" &&
          (!filterPostal ||
            String(lieu.vi_code_postal).includes(filterPostal)) &&
          (!filterRegion ||
            lieu.villeRegion
              ?.toLowerCase()
              .includes(filterRegion.toLowerCase()))
      )
    : [];

  // Pagination
  const [itemsperPage] = useState(5); // afficher 5 lieux par page
  const totalPage = Math.ceil(filteredLieux.length / itemsperPage);
  const indexOfLastItem = currentpage * itemsperPage;
  const indexOfFirstItem = indexOfLastItem - itemsperPage;
  const currentLieux = filteredLieux.slice(indexOfFirstItem, indexOfLastItem);
  if (loading)
    return (
      <div className="text-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="p-3">
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {currentLieux.length === 0 ? (
            <p className="text-2xl font-bold text-gray-600 mb-2">
              Aucun lieu et salle trouvé
            </p>
          ) : (
            currentLieux.map((lieu) => {
              const type = detectType(lieu);

              return (
                <div
                  key={`lieu-${lieu.idLieu}`} // clé unique pour chaque lieu
                  className={`relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-700 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Container principal */}
                  <div
                    className={`${
                      viewMode === "list" ? "w-full" : ""
                    } relative`}
                  >
                    {/* Zone d'en-tête minimaliste */}
                    <div className="bg-slate-100 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-4 py-1 rounded-full text-[10px]  ${type.color} shadow-sm`}
                        >
                          {type.label}
                        </span>
                        <p
                          className={`text-[10px]  ${type.infoColor} bg-white px-3 py-1 rounded-lg shadow-sm`}
                        >
                          {type.info}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className=" mb-3">
                            <h3 className="text-[14px]  text-gray-800 ">
                              {lieu.li_name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-600" />
                            <span className="text-sm  text-gray-600">
                              {lieu.li_quartier}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              {lieu.vi_code_postal} - {lieu.villeRegion}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-2 gap-2">
                        <button
                          onClick={() => {
                            const codePostalInfo = codePostal.find(
                              (c) =>
                                Number(c.code) === Number(lieu.vi_code_postal)
                            );
                            setIsFormOpenUpdate(true);
                            setSelectedLieuSalle({
                              ...lieu,
                              region: codePostalInfo?.region || "",
                              code: codePostalInfo?.code || "",
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-500 " />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(lieu.idLieu);
                            setIsDelete(true);
                          }}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="p-8">
                      <div
                        className={`${
                          viewMode === "list" ? "flex gap-12" : "space-y-10"
                        }`}
                      >
                        {/* Salles */}
                        <div
                          className="mb-6"
                          onClick={() => toggleSection(lieu.idLieu, "salles")}
                        >
                          <div className="inline-flex items-center gap-3 mb-4">
                            <h4 className="text-[16px] text-gray-800">
                              Salles
                            </h4>
                            <span className="px-3 py-1 bg-slate-100 text-gray-700 rounded-full text-xs ">
                              {lieu.salles?.length || 0}
                            </span>
                            <button
                              className="text-[12px] text-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowInputLieuId(
                                  showInputLieuId === lieu.idLieu
                                    ? null
                                    : lieu.idLieu
                                );
                              }}
                            >
                              <Plus className="w-4 h-4 text-gray-800" />
                            </button>

                            {lieu.salles &&
                              lieu.salles.length > 0 &&
                              (expandedSections[lieu.idLieu]?.salles ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              ))}
                          </div>

                          {/* Input dynamique */}
                          {showInputLieuId === lieu.idLieu && (
                            <div className="mb-4 flex gap-2">
                              <input
                                type="text"
                                placeholder="Nom de la salle"
                                value={newSalleName}
                                onChange={(e) =>
                                  setNewSalleName(e.target.value)
                                }
                                className="border rounded-xl p-2 flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddSalle(lieu)}
                              >
                                <Plus className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          )}

                          {/* Liste des salles */}
                          {lieu.salles && lieu.salles.length > 0 ? (
                            expandedSections[lieu.idLieu]?.salles && (
                              <div className="space-y-2">
                                {lieu.salles.map((salle) => (
                                  <div className="flex items-center justify-between w-full">
                                    {editingSalleId === salle.idSalle ? (
                                      // Input de modification inline
                                      <div
                                        className="flex gap-2 w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <input
                                          type="text"
                                          value={editingSalleValue}
                                          onChange={(e) =>
                                            setEditingSalleValue(e.target.value)
                                          }
                                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        />
                                        <button
                                          onClick={() =>
                                            handleSubmitUpdateSalle(
                                              salle.idSalle
                                            )
                                          }
                                          className="text-green-600 px-2"
                                        >
                                          <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="text-gray-500 px-2"
                                          onClick={() =>
                                            setEditingSalleId(null)
                                          }
                                        >
                                          <RotateCcw className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      // Texte normal avec boutons
                                      <>
                                        <div className="p-3 bg-slate-200 rounded-xl border flex items-center justify-between">
                                          <span className="text-gray-500">
                                            {" "}
                                            {salle.salle_name}
                                          </span>
                                          <div
                                            className="flex items-center space-x-1"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <button
                                              className="text-gray-500  transition p-1"
                                              onClick={() => {
                                                setEditingSalleId(
                                                  salle.idSalle
                                                );
                                                setEditingSalleValue(
                                                  salle.salle_name
                                                ); // Pré-remplir l'input
                                              }}
                                            >
                                              <Pencil className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                              className=" transition p-1"
                                              onClick={() =>
                                                handleDeleteSalle(salle.idSalle)
                                              }
                                            >
                                              <Trash className="w-4  h-4 text-red-500" />
                                            </button>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )
                          ) : (
                            <div
                              className="text-center py-1 px-1 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border-2 border-dashed border-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="text-[14px]  text-gray-500">
                                Aucun Salle
                              </p>
                            </div>
                          )}
                        </div>

                        {/*  Contacts  */}
                        <div className={`${viewMode === "list" ? "w-96" : ""}`}>
                          <div className="mb-6">
                            <div className="inline-flex items-center gap-3 mb-4">
                              <h4 className="text-[16px] text-gray-800">
                                Contacts
                              </h4>

                              <button
                                onClick={() =>
                                  setShowInputContact(
                                    showInputContact === lieu.idLieu
                                      ? null
                                      : lieu.idLieu
                                  )
                                }
                              >
                                <Plus className="w-4 h-4 text-gray-800" />
                              </button>
                            </div>
                          </div>

                          {/* Input dynamique */}
                          {showInputContact === lieu.idLieu && (
                            <div className="mb-4 flex flex-col gap-2 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                              <input
                                type="text"
                                placeholder="Nom du contact"
                                value={newContactPerson}
                                onChange={(e) =>
                                  setNewContactPerson(e.target.value)
                                }
                                className="border rounded-xl p-2"
                              />
                              <input
                                type="email"
                                placeholder="Adresse e-mail"
                                value={newContactEmail}
                                onChange={(e) =>
                                  setNewContactEmail(e.target.value)
                                }
                                className="border rounded-xl p-2"
                              />
                              <input
                                type="text"
                                placeholder="Téléphone"
                                value={newContactPhone}
                                onChange={(e) =>
                                  setNewContactPhone(e.target.value)
                                }
                                className="border rounded-xl p-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleContact(lieu)}
                                className="text-white bg-gradient-to-r bg-slate-200 rounded-md"
                              >
                                <span className="text-sm text-gray-500">
                                  Ajouter
                                </span>
                              </button>
                            </div>
                          )}

                          {/* Liste des contacts */}
                          {lieu.contacts && lieu.contacts.length > 0 ? (
                            <div className="space-y-2">
                              {lieu.contacts.map((contact) => (
                                <div
                                  key={contact.idContact}
                                  className="flex items-center justify-between w-full"
                                >
                                  {editingSalleId === contact.idContact ? (
                                    // Mode édition
                                    <div className="flex flex-col gap-2 w-full bg-slate-200 p-3 rounded-xl border">
                                      <input
                                        type="text"
                                        value={editingContactPerson}
                                        onChange={(e) =>
                                          setEditingContactPerson(
                                            e.target.value
                                          )
                                        }
                                        className="border rounded-xl p-2 text-gray-500"
                                      />
                                      <input
                                        type="email"
                                        value={editingContactEmail}
                                        onChange={(e) =>
                                          setEditingContactEmail(e.target.value)
                                        }
                                        className="border rounded-xl p-2 text-gray-500"
                                      />
                                      <input
                                        type="text"
                                        value={editingContactPhone}
                                        onChange={(e) =>
                                          setEditingContactPhone(e.target.value)
                                        }
                                        className="border rounded-xl p-2 text-gray-500"
                                      />
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={() =>
                                            handleUpdate(
                                              contact.idContact,
                                              lieu
                                            )
                                          }
                                          className="text-green-600 px-2"
                                        >
                                          <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                          className="text-gray-500 px-2"
                                          onClick={() =>
                                            setEditingSalleId(null)
                                          }
                                        >
                                          <RotateCcw className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // Mode lecture
                                    <div className="p-3 bg-slate-200 rounded-xl border border-slate-200  w-full">
                                      <div>
                                        <p className=" flex items-center gap-2 text-gray-500 text-[12px]">
                                          <Users className="w-3 h-3 text-gray-500" />{" "}
                                          {contact.contact_name}
                                        </p>
                                        <p className=" flex items-center gap-2 text-gray-500 text-[12px]">
                                          <Mail className="w-3 h-3 text-gray-500" />
                                          {contact.contact_email}
                                        </p>
                                        <p className=" flex items-center gap-2 text-gray-500 text-[12px]">
                                          <Phone className="w-3 h-3 text-gray-500" />
                                          {contact.contact_tel}
                                        </p>
                                      </div>
                                      <div className="flex items-center justify-end ">
                                        <button
                                          className="text-gray-500 transition p-1"
                                          onClick={() => {
                                            setEditingSalleId(
                                              contact.idContact
                                            );
                                            setEditingContactPerson(
                                              contact.contact_name
                                            );
                                            setEditingContactEmail(
                                              contact.contact_email
                                            );
                                            setEditingContactPhone(
                                              contact.contact_tel
                                            );
                                          }}
                                        >
                                          <Pencil className="w-4 h-4 text-blue-500" />
                                        </button>
                                        <button
                                          className="transition p-1"
                                          onClick={() =>
                                            handleDeleteContact(
                                              contact.idContact,
                                              lieu.idLieu
                                            )
                                          }
                                        >
                                          <Trash className="w-4 h-4 text-red-500" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-1 px-1 bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl border-2 border-dashed border-gray-300">
                              <p className="text-[14px]  text-gray-500">
                                Aucun contact enregistré
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 border-t bg-gray-50">
        <button
          onClick={() => setCurrentpage((prev) => Math.max(prev - 1, 1))}
          disabled={currentpage === 1}
          className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          ← Précédent
        </button>
        <div className="space-x-1">
          {[...Array(totalPage)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentpage(i + 1)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentpage === i + 1
                  ? "bg-violet-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() =>
            setCurrentpage((prev) => Math.min(prev + 1, totalPage))
          }
          disabled={currentpage === totalPage}
          className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
        >
          Suivant →
        </button>
      </div>

      <ModalModificationLieuEtSalle
        showUpdateLieuEtSalle={isFormOpenUpdate}
        handleCloseUpdateLieuEtSalle={() => setIsFormOpenUpdate(false)}
        data={selectedLieuSalle}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <ModalDelete
        showDelete={isDelete}
        handleCloseDelete={() => setIsDelete(false)}
        idLieu={deleteId}
        onDeleteSuccess={() => fetchData({ type: filterType })}
        onDeleteLieu={handleLocalDeleteLieu}
      />
    </>
  );
}
