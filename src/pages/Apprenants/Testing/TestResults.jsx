import { Link, useParams } from "react-router-dom";
import { Trophy, Award, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../../config/axios";

const TestResults = () => {
  const [result, setResult] = useState({});
  const [niveau, setNiveau] = useState("");
  const [qcm, setQcm] = useState({});
  const { id } = useParams();

  const DataRequest = async () => {
    try {
      const { data } = await axios.get(`/qcm/solve/${id}/results`);
      setResult(data.session);
      setQcm(data.session.rel_qcm_session);
      setNiveau(data.niveauAppr);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(result);

  useEffect(() => {
    DataRequest();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full bg-emerald-300 -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute bg-purple-300 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute transform -translate-x-1/2 bg-purple-300 rounded-full top-40 left-1/2 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 w-full min-h-screen pt-12 pb-12">
          <div className="container max-w-4xl px-6 mx-auto">
            {/* Success Header */}
            <div className="mb-12 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 blur opacity-30 animate-pulse"></div>
                <div className="relative p-6 rounded-full shadow-xl bg-gradient-to-r from-emerald-500 to-blue-600">
                  <Trophy className="w-16 h-16 text-white" />
                </div>
              </div>

              <h1 className="mb-4 text-5xl font-bold leading-tight text-purple-700 lg:text-6xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text">
                Félicitations !
              </h1>
              <p className="text-xl font-medium text-gray-600">
                Vous avez terminé votre QCM avec succès
              </p>
            </div>

            {/* Results Card */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-3xl blur opacity-30"></div>
              <div className="relative overflow-hidden border shadow-2xl bg-white/95 backdrop-blur-xl border-white/50 rounded-3xl">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/30"></div>

                <div className="relative p-8 lg:p-12">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <span className="text-2xl font-bold text-gray-800">
                        Résultats du QCM
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {/* QCM Name */}
                    <div className="p-6 text-center transition-all duration-300 border bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border-emerald-200/60 hover:shadow-lg">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                          <Star className="w-6 h-6 text-gray-500" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-emerald-800">
                        QCM
                      </h3>
                      <p className="text-2xl font-bold text-emerald-700">
                        {qcm.intituleQCM}
                      </p>
                    </div>

                    {/* Total Points */}
                    <div className="p-6 text-center transition-all duration-300 border bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-blue-200/60 hover:shadow-lg">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                          <Award className="w-6 h-6 text-pink-500" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-blue-800">
                        Points Total
                      </h3>
                      <p className="text-3xl font-bold text-blue-700">
                        {result.totalPoints}
                      </p>
                    </div>

                    {/* Level */}
                    <div className="p-6 text-center transition-all duration-300 border bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border-purple-200/60 hover:shadow-lg">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                          <Trophy className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-purple-800">
                        Niveau
                      </h3>
                      <p className="text-2xl font-bold text-purple-700">
                        {niveau}
                      </p>
                    </div>
                  </div>

                  {/* Performance indicator */}
                  <div className="p-6 mt-8 border bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200/60 rounded-2xl">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-lg font-semibold text-gray-700">
                        Excellent travail ! Continuez comme ça !
                      </span>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-100/40 to-transparent rounded-bl-3xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-tr-3xl"></div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur group-hover:blur-lg opacity-70"></div>
                <Link
                  to="/particulier/test"
                  className="relative flex items-center px-8 py-4 space-x-3 text-lg font-semibold text-white transition-all duration-200 transform bg-purple-700 shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour à la liste des QCMs</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestResults;
