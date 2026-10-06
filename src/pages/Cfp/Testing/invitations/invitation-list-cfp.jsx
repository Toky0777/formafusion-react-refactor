import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";
import { TablePaginator } from "../../../../components/tabs/TablePaginator";
import { InvitationFilter } from "../../../../components/filters/InvitationFilter";
import { ClipboardList, Filter, MailPlus } from "lucide-react";
import InvitationDetailsModal from "./invitations-details-cfp";

export default function InvitationListCfp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(null);
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

  const Actions = ({ invitation }) => (
    <div
      className="flex justify-center"
      onClick={() => {
        setId(invitation.idInvitation);
        setIsOpen(true);
      }}
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
    </div>
  );
  //   console.log(invitations);
  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Main Content */}
        <div className="relative  py-5">
          {/* Filter Section */}
          <div className="mb-8 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                {/* Titre + description */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                    <Filter className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Filtres Avancés
                    </h2>
                    <p className="text-sm text-gray-600">
                      Affinez votre recherche avec des critères précis
                    </p>
                  </div>
                </div>

                {/* Bouton aligné à droite */}
                <Link
                  to="/cfp/prequal/qcm/invitation/create"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-gray-700 transition-all duration-300 bg-white border border-gray-200 shadow-lg group rounded-2xl hover:shadow-xl hover:border-indigo-200 hover:scale-105 hover:-translate-y-1 hover:text-indigo-600"
                  title="Send New Invitation"
                >
                  <MailPlus className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Envoyer invitation
                </Link>
              </div>
            </div>

            <div className="p-8">
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
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                    <ClipboardList className="w-5 h-5 text-green-600" />
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
      {isOpen && (
        <InvitationDetailsModal
          id={id}
          isOpen={isOpen}
          onClose={() => {
            setId(null);
            setIsOpen((u) => !u);
          }}
        />
      )}
    </>
  );
}
