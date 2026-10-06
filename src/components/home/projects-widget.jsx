import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Calendar,
  Building,
  MapPin,
  Users,
  CheckCircle,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import T from "../translate/AutoTranslator";
import { Button } from "../ui/button";
import { IMAGE_URL } from "../../config/env";
export function ProjectsWidget({ data, basePath = "cfp", handleShowProject }) {
  // Utiliser les données de l'API ou des données par défaut
  const projects = data?.encours_projects || [];
  const imageBaseUrl = IMAGE_URL;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour formater les montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            <T>Projets en Cours</T>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4  ">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.idProjet}
                  className="bg-gray-100 p-4 mt-4 space-y-3 transition-colors border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
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

                  <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Du {formatDate(project.dateDebut)} au
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

                  <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>
                        {project.nb_apprenants} <T>apprenants</T>{" "}
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
                    <Link to={`/${basePath}/projet/detail/${project.idProjet}`}>
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
                <p>Aucun projet en cours</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function ProjectsWidgetEtp({ data, basePath = "cfp" }) {
  const projetsPlanifie = data?.projetsPlanifie || [];
  const projetsEnCours = data?.projetsEnCours || [];
  const recentProjetsTermines = data?.recentProjetsTermines || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmée":
      case "validée":
      case "terminé":
        return "bg-[#91d093] text-white";
      case "en-attente":
      case "en-cours":
        return "bg-[#3094c5] text-white";
      case "planifié":
        return "bg-purple-600 text-white";
      default:
        return "bg-muted";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Projets à Venir */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Projets à Venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projetsPlanifie.length > 0 ? (
              projetsPlanifie.map((projet) => (
                <Link to={`/${basePath}/projet/detail/${projet.idProjet}`}>
                  <div
                    key={projet.idProjet || projet.id}
                    className="bg-gray-100 p-4 mt-4 space-y-3 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">
                          {projet.cfp_name || projet.etp_name}
                        </h4>
                        <Badge
                          className={getStatusColor(
                            projet.status || "planifié"
                          )}
                        >
                          {projet.status || "planifié"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projet.module_name || projet.formation}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(projet.dateDebut)} -{" "}
                            {formatDate(projet.dateFin)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-chart-1">
                          {projet.nb_apprenants || projet.participants}{" "}
                          participants
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucun projet à venir</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projets en Cours */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Projets en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projetsEnCours.length > 0 ? (
              projetsEnCours.map((projet) => (
                <Link to={`/${basePath}/projet/detail/${projet.idProjet}`}>
                  <div
                    key={projet.idProjet || projet.id}
                    className="bg-gray-100 p-4 mt-4 space-y-3 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">
                          {projet.cfp_name || projet.etp_name}
                        </h4>
                        <Badge
                          className={getStatusColor(
                            projet.status || "en-cours"
                          )}
                        >
                          {projet.status || "en-cours"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projet.module_name || projet.formation}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(projet.dateDebut)} -{" "}
                            {formatDate(projet.dateFin)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-chart-1">
                            {projet.nb_apprenants || projet.participants}{" "}
                            participants
                          </span>
                          {projet.progression && (
                            <span className="text-xs font-medium text-chart-3">
                              {projet.progression}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucun projet en cours</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projets Récemment Terminés */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Projets Récemment Terminés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjetsTermines.length > 0 ? (
              recentProjetsTermines.map((projet) => (
                <Link to={`/${basePath}/projet/detail/${projet.idProjet}`}>
                  <div
                    key={projet.idProjet || projet.id}
                    className="bg-gray-100 p-4 mt-4 space-y-3 transition-colors border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">
                          {projet.cfp_name || projet.etp_name}
                        </h4>
                        <Badge
                          className={getStatusColor(projet.status || "terminé")}
                        >
                          {projet.status || "terminé"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {projet.module_name || projet.formation}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(projet.dateDebut || projet.date)}
                            {projet.dateFin
                              ? ` - ${formatDate(projet.dateFin)}`
                              : projet.time
                              ? ` à ${projet.time}`
                              : ""}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-chart-1">
                          {projet.nb_apprenants || projet.participants}{" "}
                          participants
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucun projet terminé récemment</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
