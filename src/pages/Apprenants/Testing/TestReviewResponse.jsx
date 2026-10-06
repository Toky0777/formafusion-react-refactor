import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle, ChevronLeftIcon, Clock, Send } from "lucide-react";
import axios from "../../../config/axios";
import { Spinner } from "../../../components/ui/spinner";

const TestReviewResponse = () => {
  const { id } = useParams();

  const [qcm, setQcm] = useState({});
  const [questions, setQuestions] = useState([]);
  const [RemainingTime, setRemainingTime] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  let answerData = JSON.parse(sessionStorage.getItem("progress"));

  useEffect(() => {
    const fetchStartTime = async () => {
      const { data } = await axios.get(`/qcm/solve/${id}/start-test`);
      const { start_time, duration } = data;
      const endTime = new Date(start_time).getTime() + duration * 1000;

      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((endTime - now) / 1000);

        if (diff <= 0) {
          clearInterval(interval);
          setRemainingTime(0);
          setFinished(true);
          // éventuellement envoyer automatiquement les réponses ici
        } else {
          setRemainingTime(diff);
        }
      }, 1000);
    };

    fetchStartTime();
  }, []);

  const DataRequest = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/qcm/solve/${id}/review`);
      setQcm(data.qcm);
      setQuestions(data.qcm.questions_qcm);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")} `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = sessionStorage.getItem("dateDebut") / 1000;
    const payload = {
      qcm_timer: sessionStorage.getItem("qcm_timer"),
      idInvitation: sessionStorage.getItem("idInvitation"),
      campId: sessionStorage.getItem("campId"),
      dateDebut: date,
      progress: answerData,
    };

    try {
      await axios.post(`/qcm/solve/${id}/submit`, payload);

      sessionStorage.removeItem("qcm_timer");
      sessionStorage.removeItem("idInvitation");
      sessionStorage.removeItem("campId");
      sessionStorage.removeItem("dateDebut");
      sessionStorage.removeItem("progress");
      navigate(`/particulier/test/qcm/solve/${id}/results`);
    } catch (error) {
      console.log(error);
    }
  };

  const timeExpired = RemainingTime === 0;
  let i = 0;
  useEffect(() => {
    DataRequest();
  }, []);
  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
        {/* Enhanced background decoration - Responsive */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-500/20 -top-10 -right-10 sm:-top-20 sm:-right-20 sm:w-96 sm:h-96 mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute w-40 h-40 rounded-full bg-gradient-to-tl from-purple-400/20 to-pink-500/20 -bottom-16 -left-16 sm:-bottom-32 sm:-left-32 sm:w-80 sm:h-80 mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute rounded-full bg-gradient-to-br from-cyan-400/15 to-purple-500/15 top-1/3 left-1/2 sm:left-2/3 w-36 h-36 sm:w-72 sm:h-72 mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute w-32 h-32 rounded-full sm:w-64 sm:h-64 bg-gradient-to-tr from-indigo-400/10 to-purple-500/10 bottom-1/4 right-1/4 mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "6s" }}
          ></div>
        </div>

        {/* Main content - Fully responsive */}
        <div className="relative z-10 w-full pt-8 pb-8 sm:pt-12 lg:pt-20 sm:pb-16">
          <div className="container max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
            {/* Header - Responsive layout */}
            <div className="flex flex-col items-start justify-between mb-8 space-y-6 sm:mb-12 lg:mb-16 sm:space-y-8 lg:flex-row lg:items-start lg:space-y-0">
              <div className="w-full space-y-3 lg:max-w-3xl sm:space-y-4">
                <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 mb-2 text-xs sm:text-sm font-medium text-purple-700 border rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200/50 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-2 bg-purple-500 rounded-full animate-pulse"></span>
                  Phase de révision
                </div>
                <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-purple-700 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-slate-800 via-purple-700 to-indigo-700 bg-clip-text">
                  Révisez vos réponses
                </h1>
                <p className="text-base font-medium leading-relaxed break-words sm:text-lg lg:text-xl text-slate-600">
                  {qcm.intituleQCM}
                </p>
              </div>

              {/* Timer - Responsive positioning */}
              {RemainingTime !== 0 && !timeExpired && (
                <div className="flex justify-center w-full lg:w-auto lg:justify-end">
                  <div className="relative group">
                    <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-r from-amber-200 to-orange-200 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-80"></div>
                    <div className="relative px-4 py-3 border shadow-lg sm:px-6 sm:py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/70 backdrop-blur-xl rounded-xl sm:rounded-2xl">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 shadow-md bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl">
                          <Clock className="w-4 h-4 text-purple-700 sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium tracking-wide uppercase text-amber-700">
                            Temps restant
                          </p>
                          <span className="text-xl font-bold sm:text-2xl text-amber-800 tabular-nums">
                            {formatTime(RemainingTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time expired warning - Responsive */}
            {timeExpired && (
              <div className="relative mb-8 sm:mb-12 group">
                <div className="absolute inset-0 transition-opacity duration-300 bg-orange-600 rounded-2xl sm:rounded-3xl blur-xl opacity-30 group-hover:opacity-80"></div>
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 opacity-90"></div>
                  <div className="relative border rounded-lg shadow-2xl bg-white/95 backdrop-blur-2xl border-red-200/50">
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:space-x-6">
                        <div className="flex-shrink-0">
                          <div className="p-3 shadow-lg sm:p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl sm:rounded-2xl">
                            <AlertTriangle className="w-5 h-5 text-white sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-xl font-bold sm:text-2xl text-slate-800">
                            Temps écoulé !
                          </h3>
                          <p className="text-base leading-relaxed sm:text-lg text-slate-600">
                            Le temps imparti est terminé. Vous ne pouvez plus
                            modifier vos réponses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions form - Responsive cards */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-6 sm:space-y-8">
                {questions.map((question, index) => {
                  let responses = question.reponses_questions;
                  return (
                    <div key={question.idQuestion} className="relative group">
                      <div className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-r from-purple-100/40 to-indigo-100/40 rounded-2xl sm:rounded-3xl blur group-hover:opacity-100"></div>
                      <div className="relative">
                        {/* Card remplacée par des classes Tailwind */}
                        <div className="transition-all duration-300 bg-white border shadow-lg border-gray-200/60 rounded-xl sm:rounded-2xl hover:shadow-xl hover:border-purple-200/80 backdrop-blur-sm">
                          {/* CardHeader remplacé */}
                          <div className="p-4 border-b sm:p-6 lg:p-8 border-gray-100/80 bg-gradient-to-r from-purple-50/50 to-indigo-50/30 rounded-t-xl sm:rounded-t-2xl">
                            <h5 className="text-lg font-bold leading-relaxed text-gray-800 sm:text-xl lg:text-2xl">
                              <span className="inline-flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white rounded-full shadow-lg sm:w-10 sm:h-10 sm:text-base bg-gradient-to-br from-purple-500 to-indigo-600">
                                {index + 1}
                              </span>
                              {question.texteQuestion}
                            </h5>
                          </div>
                          {/* CardContent remplacé */}
                          <div className="p-4 sm:p-6 lg:p-8">
                            <div className="space-y-4 sm:space-y-5">
                              {/* Option "No answer" */}
                              <div className="flex items-start p-3 space-x-3 transition-all duration-200 border border-gray-200 rounded-lg sm:p-4 hover:border-purple-300 hover:bg-purple-50/30 group/option">
                                <input
                                  className="w-4 h-4 mt-1 text-purple-600 border-2 border-purple-300 focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 sm:w-5 sm:h-5"
                                  type="radio"
                                  name={`responses[${question.idQuestion}][idReponse]`}
                                  id={`reponse_null_${question.idQuestion}`}
                                  value=""
                                  checked={
                                    !answerData.responses[question.idQuestion]
                                  }
                                  disabled
                                />
                                <label
                                  className="flex-1 text-sm font-medium leading-relaxed text-gray-600 transition-colors duration-200 cursor-pointer sm:text-base group-hover/option:text-purple-700"
                                  htmlFor={`reponse_null_${question.idQuestion}`}
                                >
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full sm:text-sm">
                                    Aucune réponse
                                  </span>
                                </label>
                              </div>

                              {/* Response options */}
                              {question.idTypeQcmQuestion === 1 ? (
                                responses.map((response) => (
                                  <div
                                    key={response.idReponse}
                                    className={`flex items-start p-3 space-x-3 transition-all duration-200 border rounded-lg sm:p-4 group/option ${
                                      response.idReponse ===
                                      answerData.responses[question.idQuestion]
                                        ? "border-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md"
                                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                                    }`}
                                  >
                                    <input
                                      className="w-4 h-4 mt-1 text-purple-600 border-2 border-purple-300 focus:ring-purple-500 focus:ring-2 focus:ring-offset-1 sm:w-5 sm:h-5"
                                      type="radio"
                                      name={`responses[${question.idQuestion}][idReponse]`}
                                      id={`reponse_${response.idReponse}`}
                                      value={response.idReponse}
                                      disabled
                                      checked={
                                        response.idReponse ===
                                        answerData.responses[
                                          question.idQuestion
                                        ]
                                      }
                                    />
                                    <label
                                      className={`flex-1 text-sm font-medium leading-relaxed cursor-pointer sm:text-base transition-colors duration-200 ${
                                        response.idReponse ===
                                        answerData.responses[
                                          question.idQuestion
                                        ]
                                          ? "text-purple-800"
                                          : "text-gray-700 group-hover/option:text-purple-700"
                                      }`}
                                      htmlFor={`reponse_${response.idReponse}`}
                                    >
                                      {response.texteReponse}
                                      {response.idReponse ===
                                        answerData.responses[
                                          question.idQuestion
                                        ] && (
                                        <span className="inline-flex items-center px-2 py-1 ml-2 text-xs font-bold text-purple-700 bg-purple-200 rounded-full">
                                          Sélectionné
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                ))
                              ) : (
                                <div
                                  key={`index-${i++}`}
                                  className={`flex items-start p-3 space-x-3 transition-all duration-200 border rounded-lg sm:p-4 group/option border-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-md
                                                                    }`}
                                >
                                  <p>
                                    Votre réponse est :{" "}
                                    {answerData.responses[question.idQuestion]}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit buttons - Responsive layout */}
              <div className="flex flex-col items-stretch justify-center gap-4 pt-8 sm:flex-row sm:items-center sm:pt-12 lg:gap-6">
                {!timeExpired && (
                  <Link
                    to={`/particulier/test/qcm/solve/${id}/respond`}
                    className="relative flex items-center justify-center px-6 py-4 space-x-3 text-base font-bold text-white no-underline transition-all duration-300 transform bg-gray-800 shadow-2xl sm:px-8 lg:px-10 sm:py-5 sm:space-x-4 sm:text-lg rounded-2xl sm:rounded-3xl hover:shadow-3xl hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-700/50 active:scale-95 group"
                  >
                    <div className="p-1.5 sm:p-2 transition-colors duration-300 bg-white/20 rounded-lg sm:rounded-xl group-hover:bg-white/30">
                      <ChevronLeftIcon className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <span className="tracking-wide">Changer les réponses</span>
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl sm:rounded-3xl group-hover:opacity-100"></div>
                  </Link>
                )}

                <button
                  type="submit"
                  className="relative flex items-center justify-center px-6 py-4 space-x-3 text-base font-bold text-white transition-all duration-300 transform bg-purple-800 shadow-2xl sm:px-8 lg:px-10 sm:py-5 sm:space-x-4 sm:text-lg rounded-2xl sm:rounded-3xl hover:shadow-3xl hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-700/50 active:scale-95 group"
                >
                  <div className="p-1.5 sm:p-2 transition-colors duration-300 bg-white/20 rounded-lg sm:rounded-xl group-hover:bg-white/30">
                    <Send className="w-4 h-4 transition-transform duration-300 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:rotate-12" />
                  </div>
                  <span className="tracking-wide">Soumettre le QCM</span>
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl sm:rounded-3xl group-hover:opacity-100"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestReviewResponse;
