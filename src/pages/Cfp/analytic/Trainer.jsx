import { useEffect, useState } from "react";
import CardCours from "../../../components/card/CardCours";
import CardFormateur from "../../../components/card/CardFormateur";
import CardMois from "../../../components/card/CardMois";
import { MONTHS } from "../../../utils/global";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { allFormateur, formateurById } from "../../../utils/formateurs";

const Trainer = () => {
  const mois = MONTHS;

  const [dataMonth, setDataMonth] = useState([]);
  const [dataCours, setDataCours] = useState([]);
  const [activeFormateur, setActiveFormateur] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formateur, setFormateur] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setGlobalLoading(true);
      try {
        const res = await allFormateur();

        setData(res.formateurs);
      } catch (error) {
        console.log(error);
      } finally {
        setGlobalLoading(false);
      }
    };
    fetch();
  }, []);

  const handleClick = async (item) => {
    setIsLoading(true);
    setActiveFormateur(item);

    try {
      const res = await formateurById(item);
      console.log(res);
      setFormateur(res);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  function getNomMois(numeroMois) {
    if (numeroMois < 1 || numeroMois > 12) {
      return "Mois invalide";
    }
    return mois[numeroMois - 1];
  }

  useEffect(() => {
    if (formateur) {
      const newDataMonth = mois.map((m) => {
        const exist = formateur?.monthly?.find(
          (element) => getNomMois(element.mois) === m
        );
        return {
          mois: m,
          heures: exist?.heures || 0,
          note: exist?.note || 0,
        };
      });

      const newDataCours =
        formateur?.modules?.map((element) => {
          return {
            modules: element.moduleName,
            totalHeures: element.total_heures,
            notes: element.note,
          };
        }) || [];

      setDataMonth(newDataMonth);
      setDataCours(newDataCours);
    }
  }, [formateur]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div>
      {globalLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-20 mx-auto my-12 xl:grid-cols-2 max-w-screen-8xl">
          <div className="space-y-6">
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {data?.length ? (
                data.map((item) => (
                  <motion.div key={item.idFormateur} variants={itemVariants}>
                    <CardFormateur
                      onselect={() => handleClick(item.idFormateur)}
                      note={item.average_note}
                      id={item.idFormateur}
                      name={item.name}
                      image={item.photo}
                      firstname={item.firstName}
                      sumHourSession={item.sumHourSession}
                      isactive={activeFormateur === item.idFormateur}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="text-base text-center text-gray-500 col-span-full">
                  Aucun formateur trouvé.
                </div>
              )}
            </motion.div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-lg  min-h-[200px] flex items-center justify-center">
            {activeFormateur ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <LoadingSpinner />
                  <p className="mt-2 text-sm text-gray-500">
                    Chargement des données...
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-center font-semibold">
                    <h1 className="font-semibold text-lg">Taux d'occupation</h1>
                    <span>{formateur?.occupancy_rate}% </span>
                  </div>
                  <CardMois dataParMois={dataMonth} />
                  <CardCours cours={dataCours} />
                </div>
              )
            ) : (
              <h1 className="text-base text-center text-gray-700">
                Sélectionnez un formateur pour voir les détails
              </h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainer;
