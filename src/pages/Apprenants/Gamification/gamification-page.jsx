import { useEffect, useState } from "react";
import { CarteXp } from "../../../components/card/carte-xp";
import Badge from "../../../components/card/badge";
import ProgressionPath from "../../../components/card/progression-path";
import Rewards from "../../../components/card/rewards";
import TopLearners from "../../../components/card/top-learners";
import axios from "../../../config/axios";
export default function GamificationPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/apprs`);
        setData(res.data);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen px-2 py-8 bg-gray-50">
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            🚀 Gamification Formafusion
          </h1>
          <p className="text-base text-gray-500">
            Gagner des XP, débloquer des badges et progresser dans ta formation.
          </p>
        </header>

        <section>
          <CarteXp data={data} />
        </section>

        <section>
          <Badge data={data} />
        </section>

        <section>
          <ProgressionPath data={data} />
        </section>

        <section>
          <Rewards data={data} />
        </section>

        <section>
          <TopLearners data={data} />
        </section>

        <div className="flex justify-center pt-4">
          <button className="px-6 py-3 font-medium text-white transition-all rounded-md shadow bg-gradient-to-r from-blue-500 to-purple-500">
            Continuer ta formation et gagner + d'XP maintenant !
          </button>
        </div>
      </div>
    </div>
  );
}
