import { useState, useEffect } from "react";
import axios from "../../../../config/axios";
import toastr from 'toastr';
import { IMAGE_URL } from "../../../../config/env";


function ApprenantList({ batch }) {
  const [allApprenants, setAllApprenants] = useState([]);
  const [selectedApprenants, setSelectedApprenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const endpoint = IMAGE_URL;

  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: 6000,
    progressBar: true,
  };
  const fetchAllApprenants = async () => {
    try {
      console.log("Tentative de récupération des non-participants pour batch ID:", batch?.id);
      const response = await axios.get(`/etp/batch_learner/non_participant/${batch?.id}`);
      console.log("Réponse des non-participants:", response.data);

      const data = response.data.employes;

      if (data && Array.isArray(data)) {
        const formattedApprenants = data.map(emp => ({
          id: emp.idEmploye,
          emp_name: emp.name,
          emp_firstname: emp.firstName,
          photo: emp.photo,
        }));
        console.log("Apprenants formatés:", formattedApprenants);
        setAllApprenants(formattedApprenants);
      } else {
        console.error("Format inattendu de la réponse :", response.data);
        toastr.error("Format de données inattendu lors du chargement des employés.");
      }
    } catch (error) {
      console.error("Erreur de communication avec le serveur :", error);
      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
        console.error("Status de l'erreur:", error.response.status);
      }
      toastr.error("Erreur lors du chargement des employés.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect déclenché, batch ID:", batch?.id);
    if (batch?.id) {
      setLoading(true);
      fetchAllApprenants();
      fetchSelectedApprenants();
    } else {
      console.warn("Aucun ID de batch trouvé dans les props");
      setLoading(false);
    }
  }, [batch?.id]);

  const fetchSelectedApprenants = async () => {
    try {
      console.log("Tentative de récupération des participants pour batch ID:", batch?.id);
      const response = await axios.get(`/etp/batch_learner/participant/${batch?.id}`);
      console.log("Réponse des participants:", response.data);

      const data = response.data.employes;

      if (data && Array.isArray(data)) {
        const formattedSelected = data.map(emp => ({
          id: emp.id,
          employe_id: emp.idEmploye,
          emp_name: emp.name,
          emp_firstname: emp.firstName,
          photo: emp.photo,
        }));
        console.log("Apprenants sélectionnés formatés:", formattedSelected);
        setSelectedApprenants(formattedSelected);
      } else {
        console.error("Format inattendu de la réponse pour les participants :", response.data);
        toastr.error("Format de données inattendu lors du chargement des employés sélectionnés.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des apprenants sélectionnés :", error);
      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
        console.error("Status de l'erreur:", error.response.status);
      }
      toastr.error("Erreur lors du chargement des employés sélectionnés.");
    }
  };
  const handleSelectApprenant = async (apprenant) => {
    if (!batch?.id) {
      toastr.error("L'ID du batch est manquant.");
      return;
    }

    console.log("Tentative d'ajout de l'apprenant:", apprenant, "au batch:", batch.id);
    try {
      const response = await axios.post('/etp/batch_learner/create', {
        employe_id: apprenant.id,
        batch_id: batch.id,
      });

      if (response.data === 'ok' || response.data.success) {
        toastr.success("Apprenant ajouté avec succès !", { autoClose: 1500 });
        fetchAllApprenants();
        fetchSelectedApprenants();
      } else {
        console.error("Réponse non-OK:", response.data);
        toastr.error("Erreur lors de l'ajout de l'apprenant.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      toastr.error("Erreur de communication avec le serveur.");
    }
  };

  const handleDeselectApprenant = async (apprenant) => {
    if (!batch?.id) {
      toastr.error("L'ID du batch est manquant.");
      return;
    }

    console.log("Tentative de retrait de l'apprenant:", apprenant, "du batch:", batch?.id);
    try {
      const response = await axios.delete(`/etp/batch_learner/delete/${apprenant.id}`, {
        data: { batch_id: batch?.id }
      });

      if (response.data === 'ok' || response.data.success) {
        toastr.success("Apprenant retiré avec succès !", { autoClose: 1500 });
        fetchSelectedApprenants();
        fetchAllApprenants();
      } else {
        console.error("Réponse non-OK:", response.data);
        toastr.error("Erreur lors du retrait de l'apprenant.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'apprenant :", error);
      toastr.error("Erreur de communication avec le serveur.");
    }
  };
  
  return (
    <div className="flex h-full">
      {/* Liste de tous les employés */}
      <div className="flex h-full flex-col items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
        <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 ">
          <div className="w-1 h-6 bg-red-400"></div>
          <label className="text-gray-500 text-xl font-normal">Liste de tous les employés</label>
        </div>
        <div className="h-full mt-2 bg-gray-50 w-full overflow-y-auto p-2">
          <div className="mb-3">
            <input
              id="main_search_appr_projet"
              placeholder="Chercher un employé"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none w-full text-gray-600 bg-transparent pl-3 h-10 border-2 border-gray-200 rounded-md hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 duration-200"
            />
          </div>
          <div className="mt-2">
            <ul id="all_apprenant" className="space-y-2">
              {allApprenants.filter((apprenant) =>
                `${apprenant.emp_name || ''} ${apprenant.emp_firstname || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((apprenant) => (
                <li
                  key={apprenant.id}
                  className="grid grid-cols-5 w-full px-3 py-2 border border-gray-100 cursor-pointer hover:bg-gray-50 duration-200 rounded-md bg-white"
                >
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <span id={`photo_appr_${apprenant.id}`}>
                        {apprenant.photo ? (
                          <img
                            alt="Profile"
                            src={`${endpoint}/img/employes/${apprenant.photo}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center uppercase">
                            {apprenant.emp_name?.charAt(0) || "?"}
                          </div>
                        )}
                      </span>
                      <div className="flex flex-col">
                        <p className="text-base font-normal text-gray-700">
                          {apprenant.emp_name} {apprenant.emp_firstname}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center col-span-1">
                    <button
                      onClick={() => handleSelectApprenant(apprenant)}
                      className="flex items-center justify-center w-10 h-10 duration-150 bg-green-100 rounded-full hover:bg-green-200"
                      title="Ajouter au batch"
                    >
                      <i className="text-sm text-green-600 fa-solid fa-plus"></i>
                    </button>
                  </div>
                </li>
              ))}
              {allApprenants.filter((apprenant) =>
                `${apprenant.emp_name || ''} ${apprenant.emp_firstname || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                  <li>
                    <div className="px-3 py-2 text-gray-500 text-center">
                      {allApprenants.length === 0 ? "Aucun employé disponible" : "Aucun employé trouvé avec ce nom"}
                    </div>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>

      {/* Liste des apprenants sélectionnés */}
      <div className="flex flex-col items-start w-1/2 h-full">
        <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 w-full">
          <div className="w-1 h-6 bg-green-400"></div>
          <label className="text-gray-500 text-xl font-normal">
            Employés sélectionnés pour ce batch
          </label>
        </div>
        <div className="h-full mt-2 w-full overflow-y-auto p-2">
          {selectedApprenants.length > 0 ? (
            selectedApprenants.map((apprenant) => (
              <div
                key={apprenant.id}
                className="grid grid-cols-5 w-full px-3 py-2 border border-gray-100 hover:bg-gray-50 duration-200 rounded-md bg-white mb-2"
              >
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <span id={`photo_appr_${apprenant.id}`}>
                      {apprenant.photo ? (
                        <img
                          src={`${endpoint}/img/employes/${apprenant.photo}`}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 text-gray-500 uppercase bg-gray-200 rounded-full">
                          {apprenant.emp_name?.charAt(0) || "?"}
                        </div>
                      )}
                    </span>
                    <div className="flex flex-col">
                      <p className="text-base font-normal text-gray-700">
                        {apprenant.emp_name} {apprenant.emp_firstname}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center col-span-1">
                  <button
                    onClick={() => handleDeselectApprenant(apprenant)}
                    className="flex items-center justify-center w-10 h-10 duration-150 bg-red-100 rounded-full hover:bg-red-200"
                    title="Retirer du batch"
                  >
                    <i className="text-sm text-red-600 fa-solid fa-minus"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">
              Aucun employé sélectionné pour ce batch
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprenantList;