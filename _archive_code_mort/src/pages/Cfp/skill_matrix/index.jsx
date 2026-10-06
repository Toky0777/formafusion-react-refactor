import React from "react";

export default function SkillMatrix() {
    return (
        <div>
            <div >
                <div>
                    <div>
                        <nav className="fixed top-0 z-50 w-full shadow-sm bg-white/90 text-slate-600 backdrop-blur-lg">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-5 rtl:space-x-reverse">
                                    <a className="flex space-x-2" href="/" data-discover="true">
                                        <img alt="" width="30" height="30" />
                                        <span className="self-center text-2xl font-semibold whitespace-nowrap">
                                            Skill Matrix
                                        </span>
                                    </a>
                                    <a
                                        href="https://forma-fusion.com/contact"
                                        className="cursor-pointer text-sm px-2 py-0.5 bg-green-500 text-white rounded-full"
                                    >
                                        Beta
                                    </a>
                                </div>
                                <div className="flex items-center space-x-10">
                                    <div className="flex items-center justify-center w-10 h-10 text-white transition duration-300 rounded-full cursor-pointer bg-base hover:scale-125">
                                        <h1>H</h1>
                                    </div>
                                    <button className="transition duration-300 cursor-pointer hover:scale-125">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M18.5 1A1.5 1.5 0 0 0 17 2.5v3A1.5 1.5 0 0 0 18.5 7h3A1.5 1.5 0 0 0 23 5.5v-3A1.5 1.5 0 0 0 21.5 1h-3zm0 8a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 21.5 9h-3zm-16 8A1.5 1.5 0 0 0 1 18.5v3A1.5 1.5 0 0 0 2.5 23h3A1.5 1.5 0 0 0 7 21.5v-3A1.5 1.5 0 0 0 5.5 17h-3zm8 0A1.5 1.5 0 0 0 9 18.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3zm8 0a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3zm-16-8A1.5 1.5 0 0 0 1 10.5v3A1.5 1.5 0 0 0 2.5 15h3A1.5 1.5 0 0 0 7 13.5v-3A1.5 1.5 0 0 0 5.5 9h-3zm0-8A1.5 1.5 0 0 0 1 2.5v3A1.5 1.5 0 0 0 2.5 7h3A1.5 1.5 0 0 0 7 5.5v-3A1.5 1.5 0 0 0 5.5 1h-3zm8 0A1.5 1.5 0 0 0 9 2.5v3A1.5 1.5 0 0 0 10.5 7h3A1.5 1.5 0 0 0 15 5.5v-3A1.5 1.5 0 0 0 13.5 1h-3zm0 8A1.5 1.5 0 0 0 9 10.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 13.5 9h-3z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="min-h-screen p-20 mt-10 bg-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-funnel"
                                            aria-hidden="true"
                                        >
                                            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
                                        </svg>
                                        <span>Filtres</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4 lucide lucide-chevron-down"
                                            aria-hidden="true"
                                        >
                                            <path d="m6 9 6 6 6-6"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="relative overflow-x-auto rounded-lg shadow-md">
                            <table className="w-full text-sm text-left rounded-lg">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Modules
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Début
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Fin
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Moyenne par groupe
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Détails
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b border-gray-200">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                        >
                                            EXCEL NIVEAU II Calculs et fonctions avancés
                                        </th>
                                        <td className="px-6 py-4">
                                            <span className="bg-[#95CF92] px-2 py-1 text-white rounded-xl">
                                                Terminé
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">2025-04-25</td>
                                        <td className="px-6 py-4">2025-05-10</td>
                                        <td className="px-20 py-4">2</td>
                                        <td className="px-6 py-4">
                                            <a href="/home/skill/1" data-discover="true">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-base lucide lucide-eye"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
