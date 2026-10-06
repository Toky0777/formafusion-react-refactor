import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Calendar,
  MessageSquare,
  Users,
  Send,
  Search,
  X,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { Spinner } from "../../../../components/ui/spinner";
import AlertMessage from "../../../../components/Modals/AlertMessage";
import axios from "../../../../config/axios";

export default function CreateInvitationFormateur() {
  const [qcms, setQcms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apprenants, setApprenants] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [filteredApprenants, setFilteredApprenants] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  });
  const navigate = useNavigate();

  //formulaire pour l'invitation

  //** Variable et Fonction pour le QCM */

  const [selectedQcm, setSelectedQcm] = useState(""); // selected qcm

  const handleSelectedQcmChange = (e) => {
    setSelectedQcm(Number(e.target.value));
  };

  //** ------------FIN QCM------------ */

  //** Variable et fonction pour la date */

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const now = new Date();

  const [selectedDateFrom, setSelectedDateFrom] = useState(
    formatDateTimeLocal(now)
  );
  const [selectedDateUntil, setSelectedDateUntil] = useState(
    formatDateTimeLocal(addDays(now, 1))
  );

  const handleSelectedDateFromChange = (e) => {
    setSelectedDateFrom(e.target.value);
  };

  const handleSelectedDateUntilChange = (e) => {
    setSelectedDateUntil(e.target.value);
  };

  //** ------------FIN DATE-------------- */

  //** Variable et fonction pour le message */

  const [message, setMessage] = useState("");

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  //** -----------FIN MESSAGE-------------- */

  //** Envoie du formulaire */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      idQCM: selectedQcm,
      valid_from: selectedDateFrom,
      valid_until: selectedDateUntil,
      custom_message: message,
      idEmploye: selectedRecipients.map((emp) => emp.idEmploye),
    };

    setIsLoading(true);
    try {
      console.log(payload);
      const res = await axios.post(`/qcm/invitations/cfp`, payload);

      if (res.data.status === 200) {
        setNotification({
          message: "Invitation envoyée avec succès !",
          type: "success",
          show: true,
        });
        setTimeout(() => {
          navigate("/formateur/testing/qcm/invitations-index");
        }, 2000);
      } else if (res.data.status === 400) {
        setNotification({
          message: "Erreur : données invalides ou requête incorrecte.",
          type: "error",
          show: true,
        });
        setTimeout(() => {
          setNotification({ message: ``, type: "", show: false });
        }, 3000);
      }
    } catch (error) {
      setNotification({
        message: `Erreur lors de l'envoi du mail !`,
        type: "error",
        show: true,
      });
      setTimeout(() => {
        setNotification({ message: ``, type: "", show: false });
      }, 3000);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  //----------------------------

  const DataRequest = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/qcm/invitation/cfp/create`);
      setQcms(data.qcms);
      setApprenants(data.employees);
      setIsLoading(false);
    } catch (error) {
      alert("Erreur lors du chargement des données");
      console.log(error);
    }
  };

  useEffect(() => {
    DataRequest();
  }, []);

  const handleSearch = useCallback(
    debounce((value) => {
      const term = value.toLowerCase();
      if (term.length < 2) {
        setShowResults(false);
        setFilteredApprenants([]);
        return;
      }

      const results = apprenants.filter(
        (emp) =>
          (emp.emp_email && emp.emp_email.toLowerCase().includes(term)) ||
          (emp.emp_name && emp.emp_name.toLowerCase().includes(term)) ||
          (emp.emp_firstname && emp.emp_firstname.toLowerCase().includes(term))
      );

      setFilteredApprenants(results);
      setShowResults(true);
    }, 300),
    [apprenants]
  );

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    handleSearch(value);
  };

  const handleAddRecipient = (employee) => {
    if (selectedEmails.has(employee.idEmploye)) return;

    const updatedSet = new Set(selectedEmails);
    updatedSet.add(employee.idEmploye);
    setSelectedEmails(updatedSet);
    setSelectedRecipients((prev) => [...prev, employee]);
    setSearchEmail("");
    setShowResults(false);
  };

  const handleRemoveRecipient = (id) => {
    const updatedSet = new Set(selectedEmails);
    updatedSet.delete(id);
    setSelectedEmails(updatedSet);
    setSelectedRecipients((prev) => prev.filter((emp) => emp.idEmploye !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {isLoading && <Spinner />}
      <AlertMessage
        type={notification.type}
        message={notification.message}
        visible={notification.show}
      />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-300 to-indigo-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 rounded-full bg-white/50 backdrop-blur-sm">
              <Mail className="w-4 h-4 mr-2" />
              Gestion des Invitations
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Nouvelle Invitation QCM
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-purple-100">
              Créez et envoyez des invitations personnalisées pour vos
              évaluations
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute rounded-full top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 blur-3xl"></div>
        <div className="absolute rounded-full bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative pb-20 mb-20 -mt-10">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white border shadow-xl rounded-2xl border-white/50">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-purple-100 rounded-xl">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Formulaire d'Invitation
                  </h2>
                  <p className="text-gray-600">
                    Configurez votre invitation QCM
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Recipients Section */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Destinataires
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Rechercher des destinataires
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full py-3 pl-10 pr-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      placeholder="Rechercher par nom ou email..."
                      value={searchEmail}
                      onChange={handleInputChange}
                    />

                    {/* Search Results Dropdown */}
                    {showResults && (
                      <div className="absolute z-20 w-full mt-2 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl max-h-60">
                        {filteredApprenants.length > 0 ? (
                          filteredApprenants.map((emp, index) => (
                            <div
                              key={index}
                              onClick={() => handleAddRecipient(emp)}
                              className="flex items-center p-4 transition-colors duration-200 border-b border-gray-100 cursor-pointer hover:bg-purple-50 last:border-b-0"
                            >
                              <div className="flex items-center justify-center w-10 h-10 mr-3 text-sm font-medium text-white rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                                {getInitials(emp.emp_firstname, emp.emp_name)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {emp.emp_firstname} {emp.emp_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {emp.emp_email || "Email non disponible"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Aucun résultat trouvé
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Recipients */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Destinataires sélectionnés ({selectedRecipients.length})
                  </label>
                  <div className="min-h-[4rem] p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    {selectedRecipients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipients.map((selected) => (
                          <div
                            key={selected.idEmploye}
                            className="inline-flex items-center px-3 py-2 text-purple-800 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-100 to-indigo-100"
                          >
                            <div className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-medium text-white bg-purple-500 rounded-full">
                              {getInitials(
                                selected.emp_firstname,
                                selected.emp_name
                              )}
                            </div>
                            <span className="mr-2 text-sm font-medium">
                              {selected.emp_firstname} {selected.emp_name}
                            </span>
                            <button
                              type="button"
                              className="text-purple-600 transition-colors duration-200 hover:text-purple-800"
                              onClick={() =>
                                handleRemoveRecipient(selected.idEmploye)
                              }
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <input
                              type="hidden"
                              name="idEmploye[]"
                              value={selected.idEmploye}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-16 text-gray-500">
                        <Users className="w-6 h-6 mr-2" />
                        Aucun destinataire sélectionné
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* QCM Selection */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sélection du QCM
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Choisir un QCM *
                  </label>
                  <select
                    name="idQCM"
                    className="block w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white"
                    required
                    value={selectedQcm}
                    onChange={handleSelectedQcmChange}
                  >
                    <option value="">Sélectionner un QCM</option>
                    {qcms.map((qcm, index) => (
                      <option value={qcm.idQCM} key={index}>
                        {qcm.intituleQCM}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Validity Period */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Période de Validité
                  </h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Valide à partir de *
                    </label>
                    <input
                      type="datetime-local"
                      name="valid_from"
                      className="block w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      value={selectedDateFrom}
                      onChange={handleSelectedDateFromChange}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Valide jusqu'au *
                    </label>
                    <input
                      type="datetime-local"
                      name="valid_until"
                      className="block w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white"
                      value={selectedDateUntil}
                      onChange={handleSelectedDateUntilChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Message Personnalisé
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Contenu du message
                  </label>
                  <textarea
                    name="custom_message"
                    rows="6"
                    className="block w-full px-4 py-3 transition-all duration-200 border border-gray-300 resize-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white"
                    placeholder="Rédigez votre message d'invitation personnalisé..."
                    value={message}
                    onChange={handleMessageChange}
                  />
                  <p className="text-sm text-gray-500">
                    Ce message sera inclus dans l'email d'invitation envoyé aux
                    destinataires.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Link
                  to="/formateur/testing/qcm/invitation/campaign"
                  className="inline-flex items-center px-8 py-3 mx-2 font-semibold text-white transition-all duration-200 transform bg-purple-600 shadow-lg rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {isLoading ? "Envoi en cours..." : "Envoyer l'Invitation"}
                </Link>
                <button
                  type="submit"
                  disabled={
                    isLoading || selectedRecipients.length === 0 || !selectedQcm
                  }
                  className="inline-flex items-center px-8 py-3 font-semibold text-white transition-all duration-200 transform bg-purple-600 shadow-lg rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isLoading ? "Envoi en cours..." : "Envoyer l'Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
