import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
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
export function SessionsWidgetCfp({
  sessions = [],
  basePath = "cfp",
  title = "Sessions du Jour",
  handleShowProject
}) {
  return (
    <>
      <Card className="bg-white h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <T>{title}</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 ">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                return (
                  <div
                    key={session.idSeance}
                    className="p-4 space-y-3 bg-gray-100 border rounded-lg"
                  >
                    <div className="flex items-start justify-between w-full">
                      <h4 className="w-2/3 text-sm font-medium text-balance">
                        {session.module_name}
                      </h4>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleShowProject(session?.idEtp)}>
                        <Building className="w-4 h-4" />
                        <span>{session.etp_name || "Pas de nom"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
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
                        {
                          session.modalite === "En ligne" ? (
                            <span>En ligne</span>
                          ) : (
                            <span>
                              {(session.salle_quartier || "Pas de quartier") +
                                " - " +
                                (session.ville || "Pas de ville")}
                            </span>
                          )
                        }
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
    </>
  );
}