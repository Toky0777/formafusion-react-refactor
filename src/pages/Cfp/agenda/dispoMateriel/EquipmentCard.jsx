import { Monitor, Projector, Laptop } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

const iconMap = {
  ordinateur: Monitor,
  projecteur: Projector,
  laptop: Laptop,
  // Ajoutez d'autres types si nécessaire
  ecran: Monitor,
  tablette: Laptop,
  autre: Laptop
};

const statusConfig = {
  disponible: {
    variant: "default",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  "en-cours": {
    variant: "default", 
    className: "bg-blue-100 text-blue-700 border-blue-300",
  },
  réservé: {
    variant: "outline",
    className: "bg-orange-100 text-orange-700 border-orange-300",
  },
};

// CORRECTION : Export par défaut
const EquipmentCard = ({ name, type, status, location, nextSession,reservationDate, nextProject, reservationCount }) => {
  const Icon = iconMap[type] || Laptop; // Valeur par défaut
  const statusStyle = statusConfig[status] || statusConfig.disponible;

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border-border bg-card">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-card-foreground truncate">{name}</h3>
            <Badge className={statusStyle.className} variant={statusStyle.variant}>
              {status}
            </Badge>
          </div>
          
          {location && (
            <p className="text-sm text-muted-foreground mb-1">📍 {location}</p>
          )}
          
          {status === 'réservé' && reservationDate && (
            <p className="text-sm text-orange-600 mb-1">
              📅 Réservé le: {reservationDate}
            </p>
          )}
          
          {nextSession && (
            <p className="text-sm text-muted-foreground">
              Prochaine session: {nextSession}
            </p>
          )}
          
          {nextProject && (
            <p className="text-sm text-blue-600 mt-1">
              Projet: {nextProject}
            </p>
          )}
          
          {reservationCount > 1 && (
            <p className="text-xs text-gray-500 mt-1">
              + {reservationCount - 1} autre(s) réservation(s)
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// EXPORT PAR DÉFAUT
export default EquipmentCard;