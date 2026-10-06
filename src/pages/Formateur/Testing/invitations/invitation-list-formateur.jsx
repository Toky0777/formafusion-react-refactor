import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";
import { TablePaginator } from "../../../../components/tabs/TablePaginator";
import { InvitationFilter } from "../../../../components/filters/InvitationFilter";

export default function InvitationListFormateur() {
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [filteredInvitations, setFilteredInvitations] = useState([]);
  const [statusInvitations, setStatusInvitations] = useState({});

  // États pour les filtres
  const [filters, setFilters] = useState({
    state: "",
    opening_date: "",
    close_date: "",
  });

  const DataRequest = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/qcm/invitations-index`);

      // Stocker les données brutes sans les actions d'abord
      const rawInvitations = response.data.invitations;
      setInvitations(rawInvitations);
      setStatusInvitations(response.data.statusOptions || {});
      setIsLoading(false);
    } catch (err) {
      console.error(err.message?.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    DataRequest();
  }, []);

  // Fonction de filtrage
  const applyFilters = () => {
    let filtered = invitations;
    // Filtre par statut
    if (filters.state) {
      filtered = filtered.filter(
        (invitation) => invitation.invitation_status == filters.state
      );
    }
    console.log(filtered);

    // Filtre par date d'ouverture (valid_from)
    if (filters.opening_date) {
      filtered = filtered.filter((invitation) => {
        const validFrom = new Date(invitation.valid_from)
          .toISOString()
          .split("T")[0];
        return validFrom >= filters.opening_date;
      });
    }

    // Filtre par date de fermeture (valid_until)
    if (filters.close_date) {
      filtered = filtered.filter((invitation) => {
        const validUntil = new Date(invitation.valid_until)
          .toISOString()
          .split("T")[0];
        return validUntil <= filters.close_date;
      });
    }

    // Ajouter les actions aux données filtrées
    const filteredWithActions = filtered.map((item, index) => ({
      ...item,
      actions: <Actions key={`filtered-${index}`} invitation={item} />,
    }));

    setFilteredInvitations(filteredWithActions);
  };

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    if (invitations.length > 0) {
      applyFilters();
    }
  }, [filters, invitations]);

  // Fonction pour mettre à jour les filtres
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Fonction pour appliquer les filtres (appelée lors de la soumission du form)
  const handleApplyFilters = () => {
    applyFilters();
  };

  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      state: "",
      opening_date: "",
      close_date: "",
    });
  };

  const columns = [
    "ID",
    "Status",
    "Valid From",
    "Valid Until",
    "Campagne",
    "Actions",
  ];
  const dataNames = [
    "idInvitation",
    "invitation_status",
    "valid_from",
    "valid_until",
    "campaign_name",
    "actions",
  ];
  if (isLoading) return <Spinner />;
  const CfpActionButton = () => {
    return (
      <>
       
      </>
    );
  };

  const Actions = ({ invitation }) => (
    <div className="flex justify-center">
      <Link
        to={`/formateur/testing/qcm/invitations/${invitation.idInvitation}`}
        className="flex items-center justify-center text-gray-500 transition-all duration-200 border border-gray-200 group w-9 h-9 bg-gray-50 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md hover:scale-105"
        title="Voir les détails"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </Link>
    </div>
  );
  //   console.log(invitations);
  return (
    <div className=" bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative pt-4 overflow-hidden bg-gradient-to-r from-purple-400 via-blue-300 to-indigo-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-2 py-5 mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm text-white/90">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Gestion des Invitations
            </div>
            <h1 className="mb-4 text-xl font-bold text-white md:text-xl">
              Gestion des invitations
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-white/80">
              Suivez et gérez toutes vos invitations avec des outils puissants
              de filtrage et d'analyse
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative px-6 mx-auto -mt-10 max-w-7xl">
        {/* Action Buttons */}

        <CfpActionButton />

        {/* Filter Section */}
        <div className="mb-4 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-md font-bold text-gray-900">
                  Filtres Avancés
                </h2>
                <p className="text-sm text-gray-600">
                  Affinez votre recherche avec des critères précis
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <InvitationFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              statusInvitations={statusInvitations}
            />
          </div>
        </div>

        {/* Results Table */}
        <div className="mb-12 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Résultats des Invitations
                  </h2>
                  <p className="text-sm text-gray-600">
                    Liste complète de vos invitations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-4 py-2 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm font-medium text-blue-700">
                    Total :{" "}
                    <span className="font-bold text-blue-800">
                      {filteredInvitations.length ?? invitations.length}
                    </span>{" "}
                    invitation
                    {(filteredInvitations.length ?? invitations.length) > 1
                      ? "s"
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <TablePaginator
              datas={
                filteredInvitations.length > 0 ||
                filters.state ||
                filters.status
                  ? filteredInvitations
                  : invitations.map((item, index) => ({
                      ...item,
                      actions: <Actions key={index} invitation={item} />,
                    }))
              }
              columns={columns}
              dataNames={dataNames}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
