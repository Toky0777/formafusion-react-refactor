import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  Phone,
  Building,
} from "lucide-react";
import T from "../translate/AutoTranslator";

export function SessionsWidget({
  data,
  basePath = "cfp",
  sessionType = "today_sessions",
}) {
  // Utiliser les données de l'API ou des données par défaut
  const sessions = data?.[sessionType] || [];

  // Fonction pour déterminer le statut d'une session basé sur l'heure actuelle
  const getSessionStatus = (session) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startTime = session.heureDebut.split(":");
    const endTime = session.heureFin.split(":");
    const sessionStart = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
    const sessionEnd = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);

    if (currentTime >= sessionStart && currentTime <= sessionEnd) {
      return {
        status: "en-cours",
        text: "En cours",
        color: "bg-[#329ccc] text-white",
      };
    } else if (currentTime < sessionStart) {
      return {
        status: "planifie",
        text: "Planifié",
        color: "bg-[#ccaad6] text-white",
      };
    } else {
      return { status: "termine", text: "Terminé", color: "bg-[#91d18b]" };
    }
  };

  const title =
    sessionType === "upcoming_sessions"
      ? "Sessions à venir"
      : "Sessions du Jour";

  return (
    <Card className="h-fit bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <T>{title}</T>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map((session) => {
              const sessionStatus = getSessionStatus(session);
              return (
                <div
                  key={session.idSeance}
                  className="p-4 space-y-3 border rounded-lg bg-gray-100"
                >
                  <div className="flex items-start justify-between w-full">
                    <h4 className="w-2/3 text-sm font-medium text-balance">
                      {session.module_name}
                    </h4>
                    <Badge className={`${sessionStatus.color}`}>
                      {sessionStatus.text}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{session.etp_name || "Pas de nom"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {sessionType === "upcoming_sessions" &&
                        session.dateSeance
                          ? session.dateSeance + "| "
                          : null}
                        {(session.heureDebut || "??:??") +
                          " - " +
                          (session.heureFin || "??:??")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>
                        {(session.formateur_name || "Pas de nom") +
                          " " +
                          (session.formateur_firstName || "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {(session.salle_quartier || "Pas de quartier") +
                          " - " +
                          (session.ville || "Pas de ville")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>
                        {session.formateur_phone || "Pas de téléphone"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        {session.nb_apprenants != null
                          ? session.nb_apprenants
                          : "?"}{" "}
                        participants
                      </span>
                      <Link
                        to={`/${basePath}/projet/detail/${session.idProjet}`}
                      >
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>Aucune session prévue</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
