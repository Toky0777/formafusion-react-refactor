import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog.tsx";
import {
  Users,
  BookOpen,
  FileX,
  CreditCard,
  MessageSquareX,
  Gift,
  Building2,
  UserPlus,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TbAlertTriangle } from "react-icons/tb";
import T from "../translate/AutoTranslator.jsx";

export function DailySummary({ data }) {
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fonction pour formater les montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Valeurs par défaut si les données ne sont pas disponibles
  // const customer_name = data?.customer_name || "Aucun nom";
  const enCours = data?.en_cours || 0;
  const totalTrained = data?.total_trained || 0;
  const total_douteuse = data?.total_douteuse || 0;
  const impayees = data?.impayees || 0;
  const nonCloture = data?.nonCloture || 0;

  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="pb-4">
        {/* <CardTitle className="text-xl font-bold text-gray-700 capitalize text-card-foreground">
          <T>Bonjour</T> {customer_name}
        </CardTitle> */}
        <p className="font-medium capitalize text-muted-foreground">
          <T>{currentDate}</T>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
          <Link
            to="/cfp/projet"
            className="flex items-center gap-4 p-6 transition-all duration-200 border bg-slate-50 rounded-xl group border-border/50 hover:shadow-md"
          >
            <div className="p-3 bg-[#6364f1] rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {enCours}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Projets en cours</T>
              </p>
            </div>
          </Link>

          <Link
            to="/cfp/apprenant"
            className="flex items-center gap-4 p-6 transition-all duration-200 border bg-slate-50 rounded-xl group border-border/50 hover:shadow-md"
          >
            <div className="p-3 rounded-xl shadow-sm transition-transform bg-[#4c5566] group-hover:scale-105">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {totalTrained}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Apprenants formés ce mois-ci</T>
              </p>
            </div>
          </Link>

          <Link
            to="#"
            className="flex items-center gap-4 p-6 transition-all duration-200 border bg-slate-50 rounded-xl group border-border/50 hover:shadow-md"
          >
            <div className="p-3 rounded-xl shadow-sm transition-transform bg-[#9f6304] group-hover:scale-105">
              <TbAlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {formatAmount(total_douteuse)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Factures douteuse</T>
              </p>
            </div>
          </Link>

          <Link
            to="/cfp/dossier"
            className="flex gap-4 items-center p-6 bg-gradient-to-br rounded-xl border-[1px] border-red-600/30 transition-all duration-200 group from-red-600/5 to-red-600/10 hover:shadow-md hover:shadow-red-600/10"
          >
            <div className="p-3 transition-transform bg-red-600 shadow-sm rounded-xl group-hover:scale-105">
              <FileX className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{nonCloture}</p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Dossiers non clôturés</T>
              </p>
            </div>
          </Link>

          <Link
            to="/cfp/facture/non-paye"
            className="flex gap-4 items-center p-6 bg-gradient-to-br rounded-xl border-[1px] border-red-600/30 transition-all duration-200 group from-red-600/5 to-red-600/10 hover:shadow-md hover:shadow-red-600/10"
          >
            <div className="p-3 transition-transform bg-red-600 shadow-sm rounded-xl group-hover:scale-105">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(impayees)}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Factures impayées</T>
              </p>
            </div>
          </Link>

          <div className="flex gap-4 items-center p-6 bg-gradient-to-br rounded-xl border-[1px] border-red-600/30 transition-all duration-200 group from-red-600/5 to-red-600/10 hover:shadow-md hover:shadow-red-600/10">
            <div className="p-3 transition-transform bg-red-600 shadow-sm rounded-xl group-hover:scale-105">
              <MessageSquareX className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-sm font-medium text-muted-foreground">
                <T>Réclamations ouvertes</T>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DailySummaryEtp({ data }) {
  // Valeurs par défaut si les données ne sont pas disponibles
  const customer_name = data?.customer_name || "Aucun nom";
  const enCours = data?.en_cours || 0;
  const totalTrained = data?.total_trained || 0;

  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Card className="shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-700 text-card-foreground">
            Bonjour {customer_name}
          </CardTitle>
          <p className="font-medium capitalize text-muted-foreground">
            {currentDate}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/etp/projet"
              className="flex items-center gap-4 p-6 transition-all duration-200 border bg-slate-50 rounded-xl group border-border/50 hover:shadow-md"
            >
              <div className="p-3 transition-transform shadow-sm bg-[#6266e9] rounded-xl group-hover:scale-105">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {enCours}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Projets en cours
                </p>
              </div>
            </Link>

            <Link
              to="/etp/apprenant"
              className="flex items-center gap-4 p-6 transition-all duration-200 border bg-slate-50 rounded-xl group border-border/50 hover:shadow-md"
            >
              <div className="p-3 transition-transform bg-gray-600 shadow-sm rounded-xl group-hover:scale-105">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalTrained}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Employées formés ce mois-ci
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 p-6 transition-all duration-200 border border-green-300 bg-gradient-to-br from-green-500 to-green-200 rounded-xl group hover:shadow-md hover:shadow-green-200">
              <div className="p-3 transition-transform bg-green-500 shadow-sm rounded-xl group-hover:scale-105">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">11</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Loyalty and Rewards
                </p>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Card className="transition-all duration-300 border-0 bg-gradient-to-r from-blue-100 to-blue-200 hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-blue-600 shadow-md rounded-2xl">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center lg:text-left">
                        <h3 className="mb-2 text-2xl font-bold text-blue-900">
                          Invitez vos centres de formation
                        </h3>
                        <p className="max-w-2xl text-lg leading-relaxed text-blue-800">
                          Gérez vos collaborations et projets de formation
                          directement avec vos centres préférés. Formafusion est
                          simple et gratuite.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        size="lg"
                        className="px-8 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 shadow-md hover:bg-blue-700 hover:shadow-lg"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Inviter un centre
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 py-3 font-semibold text-blue-700 bg-transparent border-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        onClick={() => setShowCollaborationDialog(true)}
                      >
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showCollaborationDialog}
        onOpenChange={setShowCollaborationDialog}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-blue-900">
              <Handshake className="w-6 h-6" />
              Comment fonctionne la collaboration ?
            </DialogTitle>
            <DialogDescription className="mt-4 text-base text-muted-foreground">
              Découvrez le processus simple pour collaborer avec vos centres de
              formation préférés.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="mb-3 text-lg font-semibold text-blue-900">
                Étape 1 : Invitation
              </h4>
              <p className="leading-relaxed text-blue-800">
                Pour qu'un projet de formation ait lieu sur la plateforme, il
                faut que le centre de formation et l'entreprise soient en
                collaboration. L'une des deux parties doit inviter l'autre.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>

            <div className="p-6 border border-green-200 rounded-lg bg-green-50">
              <h4 className="mb-3 text-lg font-semibold text-green-900">
                Étape 2 : Acceptation
              </h4>
              <p className="leading-relaxed text-green-800">
                La partie invitée n'a qu'à accepter l'invitation pour établir la
                collaboration. Une fois acceptée, vous pouvez commencer à créer
                et gérer vos projets de formation ensemble.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-100 to-green-100">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Résultat :</span>
              </div>
              <p className="leading-relaxed text-gray-800">
                Une collaboration active qui vous permet de gérer tous vos
                projets de formation directement sur Formafusion, de manière
                simple et gratuite.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setShowCollaborationDialog(false)}
              className="text-white bg-blue-600 hover:bg-blue-700"
            >
              Compris !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function DailySummaryForm({ data }) {
  // Valeurs par défaut si les données ne sont pas disponibles
  const customer_name = data?.customer_name || "Aucun nom";
  const enCours = data?.en_cours || 0;
  const totalTrained = data?.total_trained || 0;

  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Card className="shadow-sm backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-700 text-card-foreground">
            Bonjour {customer_name}
          </CardTitle>
          <p className="font-medium capitalize text-muted-foreground">
            {currentDate}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/formateur/projects/en_cours"
              className="flex items-center gap-4 p-6 transition-all duration-200 border bg-gradient-to-br rounded-xl group border-border/50 hover:shadow-md"
            >
              <div className="p-3 transition-transform shadow-sm bg-[#6266e9] rounded-xl group-hover:scale-105">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {enCours}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Projets en cours
                </p>
              </div>
            </Link>

            <Link
              to="/formateur/apprenant"
              className="flex items-center gap-4 p-6 transition-all duration-200 border bg-gradient-to-br rounded-xl group border-border/50 hover:shadow-md"
            >
              <div className="p-3 transition-transform bg-gray-600 shadow-sm rounded-xl group-hover:scale-105">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {totalTrained}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Employées formés ce mois-ci
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-4 p-6 transition-all duration-200 border border-green-300 bg-gradient-to-br from-green-500 to-green-200 rounded-xl group hover:shadow-md hover:shadow-green-200">
              <div className="p-3 transition-transform bg-green-500 shadow-sm rounded-xl group-hover:scale-105">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">11</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Loyalty and Rewards
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showCollaborationDialog}
        onOpenChange={setShowCollaborationDialog}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-blue-900">
              <Handshake className="w-6 h-6" />
              Comment fonctionne la collaboration ?
            </DialogTitle>
            <DialogDescription className="mt-4 text-base text-muted-foreground">
              Découvrez le processus simple pour collaborer avec vos centres de
              formation préférés.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="mb-3 text-lg font-semibold text-blue-900">
                Étape 1 : Invitation
              </h4>
              <p className="leading-relaxed text-blue-800">
                Pour qu'un projet de formation ait lieu sur la plateforme, il
                faut que le centre de formation et l'entreprise soient en
                collaboration. L'une des deux parties doit inviter l'autre.
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </div>

            <div className="p-6 border border-green-200 rounded-lg bg-green-50">
              <h4 className="mb-3 text-lg font-semibold text-green-900">
                Étape 2 : Acceptation
              </h4>
              <p className="leading-relaxed text-green-800">
                La partie invitée n'a qu'à accepter l'invitation pour établir la
                collaboration. Une fois acceptée, vous pouvez commencer à créer
                et gérer vos projets de formation ensemble.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-100 to-green-100">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Résultat :</span>
              </div>
              <p className="leading-relaxed text-gray-800">
                Une collaboration active qui vous permet de gérer tous vos
                projets de formation directement sur Formafusion, de manière
                simple et gratuite.
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={() => setShowCollaborationDialog(false)}
              className="text-white bg-blue-600 hover:bg-blue-700"
            >
              Compris !
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
