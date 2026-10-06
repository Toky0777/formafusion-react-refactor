import { FaCircleInfo } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "../../../../config/axios";
import useApi from "../../../../hooks/Api";
import InputField from "../../../../components/Dropdown/input-field";

export function AjoutClient({ idEtp, setIdEtp, isEdit, data }) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [showSearch, setShowSearch] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [clients, setClients] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  // Contacts liés au client sélectionné
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [contactForm, setContactForm] = useState({ contact_name: "", contact_mail: "", contact_phone: "" });
  const clientResultsRef = useRef(null);
  const { callApi } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callApi("/cfp/factures/allEtps");
        setClients(res.clients || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    if (isEdit) {
      setShowSearch(true);
      setShowDetails(true);
      setIdEtp(data.entreprise.idEtp);
      setSelectedClient({
        etp_addr_lot: data.entreprise.etp_addr_lot,
        etp_addr_quartier: data.entreprise.etp_quartier,
        etp_email: data.entreprise.etp_email,
        etp_name: data.entreprise.etp_name,
        etp_nif: data.entreprise.etp_nif,
        etp_phone: data.entreprise.etp_phone,
        etp_rcs: data.entreprise.etp_rcs,
        etp_stat: data.entreprise.etp_stat,
        etp_ville: data.entreprise.etp_ville,
        idEtp: data.entreprise.idEtp,
        idTypeClient: data.invoice.idTypeClient,
      });
      // Charger tous les contacts du client sélectionné
      fetchContacts(data.entreprise.idEtp).then(() => {
        setSelectedContact(data.invoice.idContact || "");
      });

    }
  }, [callApi, isEdit]);

  useEffect(() => {
    if (clients) {
      const filtered = clients.filter(
        (client) =>
          client.etp_name &&
          client.etp_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleClientSelect = (client) => {
    setShowDetails(true);
    setSelectedClient(client);
    setShowSearchBar(false);
    setIdEtp(client.idEtp);
    // Charger les contacts du client sélectionné
    fetchContacts(client.idEtp);
    setSelectedContact("");
  };

  // Récupérer les contacts du client
  const fetchContacts = async (idEtp) => {
    try {
      const res = await axios.get(`/invoice-contacts/getContact/${idEtp}`);
      setContacts(res.data);
    } catch (error) {
      setContacts([]);
    }
  };

  const handleClickOutside = (event) => {
    if (
      clientResultsRef.current &&
      !clientResultsRef.current.contains(event.target)
    ) {
      setFilteredClients([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddClient = () => {
    setShowSearchBar(true);
    setShowSearch(true);
  };

  const handleChooseAnother = () => {
    setShowDetails(false);
    setShowSearchBar(true);
    setSearchTerm("");
    setContacts([]);
    setSelectedContact("");
  };

  // ...existing code...
  return (
    <>
      <div className="w-full">
        {!showSearch && (
          <button
            type="button"
            onClick={handleAddClient}
            className="inline-flex items-center gap-4 p-20 border rounded"
          >
            <i
              className="text-4xl text-gray-600 fa-solid fa-user-plus"
              aria-hidden="true"
            ></i>
            <h1 className="text-xl font-semibold text-gray-600">
              Ajouter un client
            </h1>
          </button>
        )}
        {showSearchBar && (
          <div id="client-search-container">
            <div className="relative flex items-center gap-4">
              <div className="relative w-[400px]">
                <InputField
                  type="search"
                  id="client-search"
                  className="p-3 pl-10 w-[40vh] text-base text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-purple-500 focus:ring-1"
                  placeholder="Rechercher un client"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute px-4 py-2 text-sm font-normal text-white bg-gray-700 rounded-lg cursor-pointer right-2 bottom-3 hover:bg-gray-700/90">
                  Chercher
                </div>
                <ul
                  className={`absolute left-0 z-50 w-full p-2 bg-white border rounded cursor-pointer hover:bg-gray-50 ${searchTerm === "" ? "hidden" : ""
                    }`}
                  ref={clientResultsRef}
                >
                  {filteredClients.length === 0 ? (
                    <li
                      className="p-2 font-semibold text-gray-100 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                      onClick={() => { }}
                    >
                      Aucun client ne correspond à ce nom.
                    </li>
                  ) : (
                    filteredClients.map((client) => (
                      <li
                        key={client.idEtp}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleClientSelect(client)}
                      >
                        {client.etp_name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 text-gray-500 bg-transparent text-md"
                >
                  <FaCircleInfo className="text-lg text-gray-700" />
                </button>
                <div className="flex-col gap-1 list-group p-2 bg-white border rounded-lg shadow-md transform scale-0 group-hover:scale-100 absolute z-[999] transition duration-300 ease-in-out origin-top w-96">
                  <p className="text-base font-semibold text-gray-700">
                    Information
                  </p>
                  <p className="text-sm text-justify text-gray-400">
                    Pour ajouter un nouveau client, veuillez effectuer une
                    recherche dans le champ dédié...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDetails && (
          <div id="client-details">
            <h2 className="text-base font-semibold text-gray-500">
              Facture à{" "}
            </h2>
            <p className="text-base font-semibold capitalize">
              {selectedClient.etp_name}
            </p>
            <div className="font-medium">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Adresse :</p>
                <p className="text-base">
                  {" "}
                  {selectedClient.etp_addr_lot || "Adresse inconnue"}{" "}
                  {selectedClient.etp_addr_quartier || "quartier inconnu"}
                </p>
              </div>
              {/* <div className="flex items-center gap-2">
                                <p className="text-base"> </p>
                                </div> */}
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Code Postal :</p>
                <p className="text-base">
                  {selectedClient.etp_addr_code_postal || "code postal inconnu"}{" "}
                  {selectedClient.etp_ville || "ville inconnu"},Madagascar
                </p>
              </div>
              <br />
              <div className="flex items-center gap-2">
                <p className="text-base">
                  {" "}
                  {setting?.nif_name} :{" "}
                  {selectedClient.etp_nif || "NIF inconnu"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base">
                  {" "}
                  {setting?.stat_name} :{" "}
                  {selectedClient.etp_stat || "STAT inconnu"}{" "}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 cursor-pointer">
              <div
                onClick={handleChooseAnother}
                className="text-lg font-medium text-purple-500 hover:text-purple-600"
              >
                Choisissez un autre client
              </div>
            </div>
            {/* Sélecteur de contact lié au client */}
            <hr className="my-4" />
            <div className="flex flex-col gap-2 mt-4 w-[400px]">
              <label htmlFor="idContact" className="text-base font-semibold text-gray-500">Personne à contacter :</label>
              <select
                id="idContact"
                name="idContact"
                value={selectedContact}
                onChange={e => setSelectedContact(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1"
              >
                <option value="">Sélectionner un contact</option>
                {contacts.map((c) => (
                  <option key={c.idContact} value={c.idContact}>
                    {c.contact_name} ({c.contact_phone} - {c.contact_mail})
                  </option>
                ))}
              </select>

              <div
                className="text-lg font-medium text-purple-500 cursor-pointer hover:text-purple-600"
                onClick={() => setShowContactDrawer(true)}
                disabled={!selectedClient?.idEtp}
              >
                Nouveau contact
              </div>
            </div>
            <InputField
              type="hidden"
              id="idEtp"
              name="idEntreprise"
              value={selectedClient.idEtp}
              readOnly
            />
            <InputField
              type="hidden"
              id="idTypeClient"
              name="idTypeClient"
              value={selectedClient.idTypeClient}
              readOnly
            />
          </div>
        )}
      </div>
      {/* Drawer pour ajouter un nouveau contact */}
      {showContactDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
            <button className="absolute text-gray-500 top-2 right-2 hover:text-gray-700" onClick={() => setShowContactDrawer(false)}>&times;</button>
            <h2 className="mb-4 text-lg font-semibold">Ajouter un contact</h2>
            <form>
              <div className="mb-2">
                <label className="block text-sm font-medium">Nom *</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  required
                  value={contactForm.contact_name}
                  onChange={e => setContactForm(f => ({ ...f, contact_name: e.target.value }))}
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  value={contactForm.contact_mail}
                  onChange={e => setContactForm(f => ({ ...f, contact_mail: e.target.value }))}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Téléphone</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={contactForm.contact_phone}
                  onChange={e => setContactForm(f => ({ ...f, contact_phone: e.target.value }))}
                />
              </div>
              <button
                type="button"
                className="w-full py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
                onClick={async () => {
                  try {
                    const res = await axios.post("/invoice-contacts", {
                      ...contactForm,
                      idEtp: selectedClient.idEtp,
                    });
                    setShowContactDrawer(false);
                    setContactForm({ contact_name: "", contact_mail: "", contact_phone: "" });
                    fetchContacts(selectedClient.idEtp);
                    setSelectedContact(res.data.idContact);
                  } catch (err) {
                    console.log("Erreur lors de l'ajout du contact", err);
                  }
                }}
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

