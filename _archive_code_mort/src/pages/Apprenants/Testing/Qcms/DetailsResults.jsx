import { useEffect, useState } from "react"
import { NavBar } from "../../../components/Navbar/NavBar"
import { LoadingScreen } from "../../../components/Body/LoadingScreen"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { useStateContext } from "../../Context/ContextProvider"
import { Footer } from "../../../components/footer/Footer"

const DetailsSection = ({section, details}) => (
    <div className="mb-8">
        <div className="overflow-hidden bg-white border shadow-lg rounded-2xl border-slate-200">
            <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <h3 className="flex items-center text-xl font-semibold text-slate-800">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-purple-100 rounded-lg">
                        <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <Link className="transition-colors duration-200 hover:text-purple-700" to="/qcm/global-results">
                        {section}
                    </Link>
                </h3>
            </div>
            <div className="p-6">
                {details.map((detail, index) => (
                    <div key={index} className="space-y-3">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-2 h-2 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-700">Points obtenus</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{detail.total_points}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-2 h-2 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-700">Pourcentage</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{detail.pourcentage}%</p>
                            </div>
                        </div>
                        
                        <div className="p-4 border border-purple-200 bg-purple-50 rounded-xl">
                            <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 mr-2 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-purple-800">Description</span>
                            </div>
                            <p className="leading-relaxed text-slate-700">{detail?.descriptionNiveau}</p>
                        </div>
                        
                        <div className="p-4 border bg-amber-50 rounded-xl border-amber-200">
                            <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-amber-800">Recommandation</span>
                            </div>
                            <p className="leading-relaxed text-slate-700">{detail?.recommandation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>   
)
    
export default function DetailsResults()
{
    const { id, idAppr, idSession } = useParams()
    const { token, api_base_url } = useStateContext()
    const [ userAppr, setUserAppr ] = useState([])
    const [ groupedResponses, setGroupedResponses ] = useState([])
    const [ sectionTitle, setSectionTitle ] = useState([])
    const [ result, setResult ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    
    const DataRequest = async () => {
        setIsLoading(true)
        await axios.get(`${api_base_url}qcm/${id}/appr/${idAppr}/session/${idSession}/result`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(({data}) =>{
            setUserAppr(data.userAppr)
            setGroupedResponses(data.groupedResponses)
            setResult(data.result)
            setIsLoading(false)
            console.log(data.result);
        }).catch((err) =>{
            setIsLoading(false)
            console.error(err.message?.data);
        })
    }

    useEffect(()=>{
        DataRequest()
    }, [])

    return <>
        <NavBar />  
        {isLoading ? <LoadingScreen /> :
        <div className="min-h-[120vh] bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header avec gradient purple */}
            <div className="text-white bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900">
                <div className="container px-4 py-12 mx-auto">
                    {/* Icône centrale */}
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mt-10 mb-6 bg-white shadow-lg rounded-2xl">
                        <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
                            Résultat du test pour {`${userAppr.name} ${userAppr.firstName}`}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-purple-100">
                            Analyse détaillée des performances par section
                        </p>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link 
                            to="/qcm/global-results" 
                            className="flex items-center px-6 py-3 font-medium text-white transition-all duration-200 shadow-lg bg-slate-800 rounded-xl hover:bg-slate-900 hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Retour en arrière
                        </Link>
                        <button 
                            className="flex items-center px-6 py-3 font-medium text-white transition-all duration-200 shadow-lg bg-slate-700 rounded-xl hover:bg-slate-800 hover:shadow-xl"
                            onClick={() => {/* openModal logic */}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 512 512">
                                <path d="M72.5 252c-1.4 2.5-1.4 5.5 0 8l88.3 152.9c1.4 2.5 4.1 4 6.9 4l176.6 0c2.9 0 5.5-1.5 6.9-4L439.5 260l48.7 28.1L439.5 260c1.4-2.5 1.4-5.5 0-8L351.2 99.1c-1.4-2.5-4.1-4-6.9-4l-176.6 0c-2.9 0-5.5 1.5-6.9 4L72.5 252zM17.1 292c-12.9-22.3-12.9-49.7 0-72L105.4 67.1c12.9-22.3 36.6-36 62.4-36l176.6 0c25.7 0 49.5 13.7 62.4 36L494.9 220c12.9 22.3 12.9 49.7 0 72L406.6 444.9c-12.9 22.3-36.6 36-62.4 36l-176.6 0c-25.7 0-49.5-13.7-62.4-36L17.1 292zM290.2 180.8l40.2 100.6c17.1 4.6 29.6 20.1 29.6 38.6c0 22.1-17.9 40-40 40c-15.9 0-29.7-9.3-36.1-22.7l-97.2-19.4c-7.1 6.3-16.4 10.2-26.7 10.2c-22.1 0-40-17.9-40-40s17.9-40 40-40l57.6-76.8c-1-3.6-1.6-7.3-1.6-11.2c0-22.1 17.9-40 40-40s40 17.9 40 40c0 7.6-2.1 14.7-5.8 20.8zM202 271.9l79.2 15.8-31.7-79.2L202 271.9z"></path>
                            </svg>
                            Diagramme des résultats
                        </button>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-8 mx-auto max-w-7xl">
                {/* Résumé des résultats */}
                <div className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">
                    <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-12 h-12 mr-4 bg-purple-100 rounded-xl">
                                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800">Résumé des résultats</h2>
                                <p className="text-sm text-slate-600">Vue d'ensemble des performances</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-700">QCM</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{result.intituleQCM}</p>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-700">Date</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{result.date_session}</p>
                            </div>
                            
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-slate-700">Points totaux</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{result.total_points} / {result.totalPointQcm}</p>
                            </div>
                            
                            <div className="p-4 border border-purple-200 bg-purple-50 rounded-xl">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 mr-2 bg-purple-700 rounded-full"></div>
                                    <span className="text-sm font-semibold text-purple-800">Pourcentage</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">{Math.round(result.pourcentage * 100) / 100}%</p>
                            </div>
                            
                            <div className="p-4 border border-green-200 bg-green-50 rounded-xl md:col-span-2">
                                <div className="flex items-center mb-2">
                                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                    <span className="text-sm font-semibold text-green-800">Niveau atteint</span>
                                </div>
                                <p className="text-xl font-bold text-green-900">{result.niveau}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Détails par section */}
                <div className="mb-8">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-3xl font-bold text-slate-800">Détails par section</h2>
                        <p className="text-slate-600">Analyse approfondie des performances dans chaque catégorie</p>
                    </div>
                    
                    {Object.entries(groupedResponses).map(([key, values]) => (
                        <DetailsSection key={key} section={key} details={values} />
                    ))}
                    
                    {Object.keys(groupedResponses).length === 0 && (
                        <div className="p-12 text-center bg-white shadow-xl rounded-2xl">
                            <svg className="w-16 h-16 mx-auto mb-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <h3 className="mb-2 text-xl font-semibold text-slate-800">Aucun détail disponible</h3>
                            <p className="text-slate-600">Les résultats détaillés par section ne sont pas encore disponibles</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal du diagramme */}
            <div id="spiderChartModal" className="fixed inset-0 z-50 flex items-center justify-center hidden w-full h-full p-4 overflow-y-auto bg-black bg-opacity-50">
                <div className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl">
                    <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-purple-100 rounded-xl">
                                    <svg className="w-6 h-6 text-purple-700" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M72.5 252c-1.4 2.5-1.4 5.5 0 8l88.3 152.9c1.4 2.5 4.1 4 6.9 4l176.6 0c2.9 0 5.5-1.5 6.9-4L439.5 260l48.7 28.1L439.5 260c1.4-2.5 1.4-5.5 0-8L351.2 99.1c-1.4-2.5-4.1-4-6.9-4l-176.6 0c-2.9 0-5.5 1.5-6.9 4L72.5 252zM17.1 292c-12.9-22.3-12.9-49.7 0-72L105.4 67.1c12.9-22.3 36.6-36 62.4-36l176.6 0c25.7 0 49.5 13.7 62.4 36L494.9 220c12.9 22.3 12.9 49.7 0 72L406.6 444.9c-12.9 22.3-36.6 36-62.4 36l-176.6 0c-25.7 0-49.5-13.7-62.4-36L17.1 292zM290.2 180.8l40.2 100.6c17.1 4.6 29.6 20.1 29.6 38.6c0 22.1-17.9 40-40 40c-15.9 0-29.7-9.3-36.1-22.7l-97.2-19.4c-7.1 6.3-16.4 10.2-26.7 10.2c-22.1 0-40-17.9-40-40s17.9-40 40-40l57.6-76.8c-1-3.6-1.6-7.3-1.6-11.2c0-22.1 17.9-40 40-40s40 17.9 40 40c0 7.6-2.1 14.7-5.8 20.8zM202 271.9l79.2 15.8-31.7-79.2L202 271.9z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800">Diagramme des résultats</h3>
                                    <p className="text-sm text-slate-600">Visualisation graphique des performances</p>
                                </div>
                            </div>
                            <button 
                                id="closeModal" 
                                className="p-1 transition-colors duration-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="relative w-full mb-6 h-80 md:h-96">
                            <canvas id="spiderChart" className="w-full h-full"></canvas>
                        </div>
                        <ul id="chartStats" className="space-y-2"></ul>
                    </div>
                    
                    <div className="px-6 py-4 border-t bg-slate-50 border-slate-200">
                        <div className="flex justify-end">
                            <button 
                                id="closeModalBtn" 
                                className="px-6 py-3 font-medium text-white transition-all duration-200 bg-purple-700 shadow-lg rounded-xl hover:bg-purple-800 hover:shadow-xl"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        }
    </>
}