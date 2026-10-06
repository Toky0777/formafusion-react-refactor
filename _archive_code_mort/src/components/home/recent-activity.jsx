import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { UserPlus, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import T from "../translate/AutoTranslator";

export function RecentActivity({ data }) {
  // Utiliser les données de l'API pour recentInscriptions (reservations)
  const recentInscriptions = data?.reservations?.slice(0, 5) || [];

  // Garder recentCommandes statique comme demandé
  const recentCommandes = data?.bon_commandes?.slice(0, 5) || [];

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour déterminer le statut d'une réservation
  const getReservationStatus = (reservation) => {
    const today = new Date();
    const reservationDate = new Date(reservation.dateDebut);

    if (reservationDate > today) {
      return {
        status: "planifiee",
        text: "Planifiée",
        color: "bg-chart-1 text-white",
      };
    } else if (reservationDate.toDateString() === today.toDateString()) {
      return {
        status: "aujourdhui",
        text: "Aujourd'hui",
        color: "bg-chart-2 text-white",
      };
    } else {
      return { status: "passee", text: "Passée", color: "bg-muted" };
    }
  };

  // Fonction pour les couleurs de statut des commandes (statique)
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-[#95a5a6'] text-white";
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
      <Card className="!bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <T>Dernières Inscriptions</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInscriptions.length > 0 ? (
              recentInscriptions.map((reservation, index) => {
                const status = getReservationStatus(reservation);
                return (
                  <Link to="/cfp/reservation">
                    <div
                      key={`${reservation.customerName}-${reservation.dateDebut}-${index}`}
                      className="p-3 mb-4 transition-colors border rounded-lg bg-slate-50 hover:bg-muted/50"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {/* Colonne 1 */}
                        <div>
                          <div className="text-sm font-medium">
                            {reservation.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.module_name}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {formatDate(reservation.dateDebut)}
                          </div>
                        </div>
                        {/* Colonne 2 */}
                        <div className="flex flex-col items-end justify-between h-full text-xs text-muted-foreground">
                          <div>
                            <span className="font-semibold">
                              <T>Nb réservés :</T>
                            </span>{" "}
                            {reservation.nbPlaceReserved}
                          </div>
                          <div>
                            <span className="font-semibold">
                              <T>Responsable :</T>
                            </span>{" "}
                            {reservation.responsable_name || "Non assigné"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucune inscription récente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Link to="/cfp/bon-commande">
        <Card className="!bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Dernières Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommandes.map((commande) => (
                <div
                  key={commande.id}
                  className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-slate-50 hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
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
                              <div key={index} className="flex justify-between">
                                <span>{parts[0]}</span>
                                <span className="ml-4">Qté: {parts[1]}</span>
                                <span className="ml-4">
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
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{commande.date_bc}</span>
                      </div>
                      <span className="text-sm font-medium text-chart-1">
                        Montant BC : {parseFloat(commande.montant_bc).toLocaleString('fr-FR')} Ar
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
