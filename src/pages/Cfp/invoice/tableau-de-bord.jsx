import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  TbFileInvoice,
  TbCash,
  TbAlertTriangle,
  TbHeartBroken,
  TbShieldCheck,
  TbFileAlert,
  TbTrash,
  TbGavel,
  TbScale,
} from "react-icons/tb";
import useApi from "../../../hooks/Api";
import { Spinner } from "../../../components/ui/spinner";
import { Link } from "react-router-dom";

export function TableauDeBord() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <TableauDeBordContent />
    </div>
  );
}

function TableauDeBordContent() {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const { loading, error, data, callApi } = useApi();

  useEffect(() => {
    callApi("/dashboard");
  }, [callApi]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  if (error)
    return <p className="text-center text-red-600">Erreur : {error.message}</p>;
  if (!data) return null;

  const generalCards = [
    {
      label: data?.countInvoices <= 1 ? "Facture" : "Factures",
      value: data?.countInvoices,
      icon: <TbFileInvoice size={26} className="text-blue-600" />,
      border: "border-blue-300",
      currency: "",
      url: "/cfp/facture",
    },
    {
      label: "Total factures",
      value: `${new Intl.NumberFormat("fr-FR").format(data?.total_montant)}`,
      icon: <TbCash size={26} className="text-green-600" />,
      border: "border-green-300",
      currency: `${setting?.currency_unit}`,
      url: "/cfp/facture",
    },
    {
      label: "Total échues",
      value: `${new Intl.NumberFormat("fr-FR").format(
        data?.total_echues
      )}`,
      icon: <TbAlertTriangle size={26} className="text-red-600" />,
      border: "border-red-300",
      currency: `${setting?.currency_unit}`,
      url: "/cfp/facture/echue",
    },
  ];

  return (
    <div className="mx-auto space-y-10 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Tableau de bord
        </h1>
        <p className="mt-1 text-gray-500">
          Vue d’ensemble de vos indicateurs et de la santé financière
        </p>
      </div>

      {/* Cartes générales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {generalCards.map((card, index) => (
          <Link to={card.url} key={index}>
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`bg-white border-2 ${card.border} rounded-2xl shadow-sm hover:shadow-md p-6 flex flex-col items-center text-center`}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-3 border border-gray-200 rounded-full bg-gray-50">
                {card.icon}
              </div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-800">
                {card.value}
              </p>
              <span className="text-sm text-gray-500">{card.currency}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Section finances détaillées */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Santé financière
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Restant saine */}
          <Link to="/cfp/facture/saine">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 shadow-sm border-emerald-400 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbShieldCheck size={26} className="text-emerald-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Restant saine
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.restantSaine)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Montant restant encore récupérable — représente votre trésorerie
                potentielle à court terme.
              </p>
            </motion.div>
          </Link>

          {/* Total perdu */}
          <Link to="/cfp/facture/perdu">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 shadow-sm border-rose-400 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbHeartBroken size={26} className="text-rose-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Total perdu
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_perdu)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Factures considérées comme irrécouvrables, douteuse, en litige, transmises à huissier ou en poursuite judiciaire.
              </p>
            </motion.div>
          </Link>


          {/* Douteuse */}
          <Link to="/cfp/facture/douteuse">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 shadow-sm border-amber-400 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbAlertTriangle size={26} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800">Douteuse</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_douteuse)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Factures présentant un risque élevé de non-paiement, nécessitant un suivi rapproché.
              </p>
            </motion.div>
          </Link>

          {/* En litige */}
          <Link to="/cfp/facture/en_litige">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 border-orange-400 shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbFileAlert size={26} className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">En litige</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_litige)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Factures faisant l’objet d’un désaccord entre le client et l’entreprise.
              </p>
            </motion.div>
          </Link>

          {/* Irrécouvrable */}
          <Link to="/cfp/facture/irrecouvrable">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 border-red-400 shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbTrash size={26} className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Irrécouvrable</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_irrecouvrable)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Montants définitivement perdus après plusieurs tentatives de recouvrement.
              </p>
            </motion.div>
          </Link>

          {/* Transmis à huissier */}
          <Link to="/cfp/facture/transmis_huissier">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 border-blue-400 shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbGavel size={26} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">Transmis à huissier</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_transmis_huissier)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Factures confiées à un huissier pour recouvrement forcé.
              </p>
            </motion.div>
          </Link>

          {/* En poursuite judiciaire */}
          <Link to="/cfp/facture/poursuite_judiciaire">
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-6 bg-white border-t-4 border-indigo-400 shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <TbScale size={26} className="text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  En poursuite judiciaire
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(data?.total_poursuite_judiciaire)}{" "}
                <span className="text-sm text-gray-500">{setting?.currency_unit}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Factures faisant l’objet d’une procédure judiciaire en cours.
              </p>
            </motion.div>
          </Link>
        </div>
      </div>

    </div>
  );
}
