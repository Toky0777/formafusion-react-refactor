import React, { useState } from "react";
import dayjs from "dayjs";
import { FileText, Check } from "lucide-react";
import StatusDropdown from "./StatusDropdown";
import DetailsDevisCell from "./DetailsDevisCell";
import { Link } from "react-router-dom";
import axios from "../../../config/axios";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import ProjetsBonCommandeDrawerEtp from "./ProjetsBonCommandeDrawerEtp";

export default function BonCommandeTableEtp({
  bons,
  loading,
  pagination,
  perPage,
  onEdit,
  onDelete,
  onStatusChange,
  onDocumentsClick,
}) {
  const [projetsDrawerOpen, setProjetsDrawerOpen] = useState(false);
  const [selectedBonCommandeId, setSelectedBonCommandeId] = useState(null);

  const handleStatusChange = (bonCommandeId, newStatusId) => {
    console.log(`Statut changé pour le BC ${bonCommandeId}: ${newStatusId}`);
    if (onStatusChange) {
      onStatusChange(bonCommandeId, newStatusId);
    }
  };

  const handleProject = (bonCommandeId) => {
    setSelectedBonCommandeId(bonCommandeId);
    setProjetsDrawerOpen(true);
  };

  const handleCloseProjetsDrawer = () => {
    setProjetsDrawerOpen(false);
    setSelectedBonCommandeId(null);
  };

  return (
    <>
      <ProjetsBonCommandeDrawerEtp
        open={projetsDrawerOpen}
        onClose={handleCloseProjetsDrawer}
        bonCommandeId={selectedBonCommandeId}
      />
      <div className="w-full bg-white border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 bg-gray-50">
              <th className="p-3 font-medium text-left">#</th>
              <th className="p-3 font-medium text-left">Status</th>
              <th className="p-3 font-medium text-left">Numéro BC</th>
              <th className="p-3 font-medium text-left">Numéro Devis</th>
              <th className="p-3 font-medium text-left">Date BC</th>
              <th className="p-3 font-medium text-left">Date début</th>
              <th className="p-3 font-medium text-left">Date fin</th>
              <th className="p-3 font-medium text-left">Modalité</th>
              <th className="p-3 font-medium text-left">Montant BC</th>
              <th className="p-3 font-medium text-left">Montant Devis</th>
              <th className="p-3 font-medium text-left">Entreprise</th>
              <th className="p-3 font-medium text-left">Détails devis</th>
              <th className="p-3 font-medium text-left">Projet</th>
              <th className="p-3 font-medium text-left">Documents</th>
              
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="13"
                  className="p-4 italic text-center text-gray-500"
                >
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 border-2 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    Chargement...
                  </div>
                </td>
              </tr>
            ) : bons.length === 0 ? (
              <tr>
                <td colSpan="13" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      Aucun bon de commande trouvé
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Commencez par créer votre premier bon de commande
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              bons.map((bc, idx) => (
                <tr
                  key={bc.idBC || bc.id || idx}
                  className="transition border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 text-gray-600">{pagination.from + idx}</td>
                  <td className="p-3 text-gray-600">
                    <StatusDropdown
                      bonCommande={bc}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                  <td className="p-3">
                    <span
                      className="font-semibold text-purple-700"
                      title={bc.numero_bc}
                    >
                      {bc.numero_bc
                        ? bc.numero_bc.length > 10
                          ? bc.numero_bc.substring(0, 10) + "..."
                          : bc.numero_bc
                        : "-"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">
                    <Link to={`/cfp/proforma/details/${bc.idDevis}`}>
                      {bc.numero_devis || "-"}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-700">
                    {bc.date_bc ? dayjs(bc.date_bc).format("DD/MM/YYYY") : "-"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {bc.date_debut
                      ? dayjs(bc.date_debut).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {bc.date_fin
                      ? dayjs(bc.date_fin).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td className="p-3 text-center text-gray-700">
                    {bc.modalite ? `${bc.modalite} j` : "-"}
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    {bc.montant_bc ? (
                      <span className="text-green-600">
                        {Number(bc.montant_bc).toLocaleString("fr-FR")} Ar
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-900">
                    {bc.montant_devis ? (
                      <span className="text-blue-600">
                        {Number(bc.montant_devis).toLocaleString("fr-FR")} Ar
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <EtpPopoverCell
                    idEtp={bc.idEtp}
                    etp_name={bc.etp_name}
                    etp_email={bc.etp_email}
                    contact_name={bc.contact_name}
                    contact_mail={bc.contact_mail}
                    contact_phone={bc.contact_phone}
                  />

                  <td className="p-3">
                    <DetailsDevisCell detailsDevis={bc.details_devis} />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="text-gray-700 hover:bg-purple-50"
                      onClick={() => handleProject(bc.idBC)}
                    >
                      {bc.nb_projets || "-"}
                    </button>
                  </td>

                  {/* Colonne Documents */}
                  <td className="p-3">
                    <button
                      onClick={() => onDocumentsClick(bc)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${
                        bc.idDocument
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-900"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                      title="Gérer les documents"
                    >
                      {bc.idDocument ? (
                        <Check className="w-3.5 h-3.5 text-purple-600" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      Documents
                    </button>
                  </td>

                 
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Composant Popover pour les informations de l'entreprise
const EtpPopoverCell = React.memo(
  ({
    idEtp,
    etp_name,
    etp_email,
    contact_name,
    contact_mail,
    contact_phone,
  }) => {
    const [open, setOpen] = useState(false);

    const hasContactInfo = contact_name || contact_mail || contact_phone;

    const [dataEtp, setDataEtp] = useState({});
    const [showDrawer, setShowDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (idEtp) => {
      setIsLoading(true);
      setShowDrawer(true);
      try {
        const res = await axios.get(`/etp/etp-drawer/${idEtp}`);
        setDataEtp(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <>
        <td className="relative p-3">
          <div
            className={`cursor-pointer ${
              etp_name
                ? "text-gray-700 hover:text-purple-700"
                : "text-gray-400 italic"
            }`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onClick={() => handleClick(idEtp)}
          >
            {etp_name || "Aucune entreprise"}

            {open && (etp_name || hasContactInfo) && (
              <div className="absolute left-0 z-20 p-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-80 top-full">
                {/* Informations de l'entreprise */}
                {etp_name && (
                  <div className="mb-3">
                    <div className="mb-1 text-sm font-semibold text-purple-700">
                      Entreprise
                    </div>
                    <div className="text-sm text-gray-900">{etp_name}</div>
                    {etp_email && (
                      <div className="mt-1 text-sm text-gray-600">
                        {etp_email}
                      </div>
                    )}
                  </div>
                )}

                {/* Informations du contact */}
                {hasContactInfo && (
                  <>
                    {etp_name && <hr className="my-3 border-gray-200" />}
                    <div>
                      <div className="mb-2 text-sm font-semibold text-gray-700">
                        Personne à contacter
                      </div>
                      <div className="space-y-2 text-sm">
                        {contact_name && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 min-w-16">
                              Nom :
                            </span>
                            <span className="font-medium text-gray-900">
                              {contact_name}
                            </span>
                          </div>
                        )}
                        {contact_mail && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 min-w-16">
                              Email :
                            </span>
                            <span className="text-gray-900 break-all">
                              {contact_mail}
                            </span>
                          </div>
                        )}
                        {contact_phone && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500 min-w-16">
                              Téléphone :
                            </span>
                            <span className="text-gray-900">
                              {contact_phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Aucune information */}
                {!etp_name && !hasContactInfo && (
                  <div className="text-sm italic text-gray-500">
                    Aucune information disponible
                  </div>
                )}
              </div>
            )}
          </div>
        </td>

        {showDrawer && (
          <ProjectDrawer
            data={dataEtp}
            isLoading={isLoading}
            isShow={showDrawer}
            onClose={() => setShowDrawer(false)}
            account="cfp"
          />
        )}
      </>
    );
  }
);

EtpPopoverCell.displayName = "EtpPopoverCell";
