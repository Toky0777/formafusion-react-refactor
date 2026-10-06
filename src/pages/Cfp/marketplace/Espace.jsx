import { useEffect, useState } from 'react';
import {
    ChevronRight,
    User,
    FileText,
    CheckCircle,
    AlertCircle,
    Building,
    Camera,
    BookOpen,
    FileCheck,
    MapPin,
    Users,
    Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../../../config/axios';

const Espace = () => {
    const [data, setData] = useState({
        reglement: false,
        accueil: false,
        conditions: false,
        reasons: false,
        traits: false,
        photo: false,
        acces: false,
        accompagnement: false,
        organigramme: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/cfp/marketplace/espace`);
                setData(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatusBadge = ({ completed }) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${completed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {completed ? (
                <>
                    <CheckCircle size={12} />
                    Complété
                </>
            ) : (
                <>
                    <AlertCircle size={12} />
                    À compléter
                </>
            )}
        </span>
    );

    const cards = [
        {
            title: "Mon profil",
            icon: User,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            link: "/cfp/espace/profil",
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { label: "Caractéristiques principales", status: data.traits },
                { label: "Pourquoi nous choisir", status: data.reasons },
                { label: "Photo publicitaire", status: data.photo, icon: Camera }
            ]
        },
        {
            title: "Conditions et règlements",
            icon: FileText,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            link: "/cfp/espace/reglement",
            image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            items: [
                { label: "Règlement intérieur", status: data.reglement },
                { label: "Livret d'accueil", status: data.accueil, icon: BookOpen },
                { label: "Conditions de vente", status: data.conditions, icon: FileCheck },
                { label: "Modalités d'accès", status: data.acces, icon: MapPin },
                { label: "Suivi et accompagnement", status: data.accompagnement, icon: Users },
                { label: "Organigramme", status: data.organigramme, icon: Building }
            ]
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="mt-4 text-gray-600">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Votre profile dans Marketplace</h1>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl"
                        >
                            <Link to={card.link} className="block">
                                <div className="relative h-48 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                                <card.icon className={`w-6 h-6 ${card.color}`} />
                                            </div>
                                            <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <ul className="space-y-2">
                                        {card.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className="px-4 py-3 transition-all duration-200 group rounded-xl hover:bg-gray-50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {item.icon && (
                                                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                                        )}
                                                        <span className="text-gray-700 group-hover:text-gray-900">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <StatusBadge completed={item.status} />
                                                        <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:text-gray-600 group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Statistiques */}
                <div className="p-6 mt-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Progression globale</h3>
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {Object.values(data).filter(Boolean).length} / {Object.values(data).length} sections complétées
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{
                                width: `${(Object.values(data).filter(Boolean).length / Object.values(data).length) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Espace;