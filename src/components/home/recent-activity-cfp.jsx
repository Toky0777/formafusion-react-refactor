import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  ShoppingCart,
  Clock,
  ExternalLink,
  Calendar,
  Building,
  Users,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import T from "../translate/AutoTranslator";
import { formatDate } from "../../utils/global";
import { IMAGE_URL } from "../../config/env";

export function RecentActivityCfp({
  data,
  handleShowProject,
  basePath = "cfp",
}) {
  // Dernières commandes (statique 5 max)
  const recentCommandes = data?.bon_commandes?.slice(0, 5) || [];
  const projects = data?.project_session_undetermined || [];
  const imageBaseUrl = IMAGE_URL;

  // Pagination pour les projets
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Formater montant
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Couleur statuts commandes
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-[#95a5a6] text-white";
      case 2:
        return "bg-[#3498db] text-white";
      case 3:
        return "bg-[#f39c12] text-white";
      case 4:
        return "bg-[#2ecc71] text-white";
      case 5:
        return "bg-[#e74c3c] text-white";
      case 6:
        return "bg-[#9b59b6] text-white";
      case 7:
        return "bg-[#27ae60] text-white";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Card Dernières Commandes */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Dernières Commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCommandes.length > 0 ? (
              recentCommandes.map((commande) => (
                <div
                  key={commande.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 transition-colors border rounded-lg hover:bg-muted/50 bg-gray-100"
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="flex flex-col md:flex-row items-start md:items-center justify-between mb-1 cursor-pointer"
                      onClick={() => handleShowProject(commande?.idEtp)}
                    >
                      <h4 className="text-sm font-medium">
                        {commande.etp_name}
                      </h4>
                      <Badge className={getStatusColor(commande.idStatus)}>
                        {commande.status_name}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      {commande.details_devis
                        .split(" | ")
                        .map((detail, index) => {
                          const parts = detail.split(" - ");
                          if (parts.length >= 4) {
                            return (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row justify-between"
                              >
                                <span>{parts[0]}</span>
                                <span className="ml-0 sm:ml-4">
                                  Qté: {parts[1]}
                                </span>
                                <span className="ml-0 sm:ml-4">
                                  P.U:{" "}
                                  {parseFloat(parts[2]).toLocaleString("fr-FR")}{" "}
                                  Ar
                                </span>
                              </div>
                            );
                          }
                          return <div key={index}>{detail}</div>;
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{commande.date_bc}</span>
                      </div>

                      <span className="text-sm font-medium text-chart-1">
                        Montant BC:{" "}
                        {parseFloat(commande.montant_bc).toLocaleString(
                          "fr-FR"
                        )}{" "}
                        Ar
                      </span>

                      <Link to={`/cfp/bon-commande/view/${commande.idBC}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucune commande</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card Session pas de date */}
      <Card className="border-l-2 border-yellow-400 bg-white flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <T>Projet avec session indéterminée</T>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 p-6 pb-4">
            <div className="space-y-4">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((project) => (
                  <div
                    key={project.idProjet}
                    className="bg-gray-100 p-4 space-y-3 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {project.module_name}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {project.module_description ||
                            "Aucune description disponible"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Du {formatDate(project.dateDebut)} au{" "}
                          {formatDate(project.dateFin)}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleShowProject(project?.idEtp)}
                      >
                        <Building className="w-3 h-3" />
                        <span>
                          <T>Client:</T> {project.etp_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${imageBaseUrl}/img/formateurs/${project.photoForm}`}
                          alt="Formateur"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          <T>Formateur :</T> {project.formateur_name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>
                          {project.nb_apprenants} <T>apprenants</T>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{project.ville}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          <T>Prix HT:</T> {formatAmount(project.total_ht)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Link
                        to={`/${basePath}/projet/detail/${project.idProjet}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Aucun projet trouvee</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination fixée en bas de la carte */}
          {projects.length > itemsPerPage && (
            <div className="border-t bg-gray-50/50 p-4 mt-auto">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm py-1 px-3 bg-white border rounded-md">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
