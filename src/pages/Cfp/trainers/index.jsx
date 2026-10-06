import { useState, useEffect } from 'react';
import NavbarTrainer from '../../../components/navbar/navbar-trainer';
import FormateurListe from './FormateurListe';
import FormateurAjout from './FormateurAjout';
import { LoaderCircle } from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import axios from '../../../config/axios';


function TrainerList() {

    const auth = useAuth();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [formateurs, setFormateurs] = useState([]);
    const [count, setCount] = useState(0);
    const [showModalAjout, setShowModalAjout] = useState(false);
    const navigate = useNavigate()

    // Fonction pour charger les formateurs depuis l'API
    const fetchFormateurs = async () => {
        setLoading(true);
        try {
            const result = await axios.get(`/cfp/formateurs`);

            setFormateurs(result.data.formateurs || []);
            setCount(result.data.count || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des formateurs :", error);
            if (error.response?.status === 401) {
                // console.log("unauthorized")
                navigate("/user");
            }
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    // Chargement des formateurs à l'initialisation
    useEffect(() => {
        if (auth.token) {
            fetchFormateurs();
        }
    }, [auth.token]);
    return (
        <div className="flex flex-col w-full bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
            <Toaster position='top-right' reverseOrder={false} toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                removeDelay: 1000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
            }}></Toaster>
            <NavbarTrainer setShowModalAjout={setShowModalAjout} search={search} setSearch={setSearch} />
            <div className="w-full min-h-screen p-4 mt-2 bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
                <div className="flex flex-col w-full h-full px-4">

                    <div className="w-full h-full mx-auto">

                        <section id="content" className="p-2 mt-2">
                            {loading ? (
                                <div className="flex justify-center">
                                    <div className="p-6 text-center w-96">
                                        <LoaderCircle className="w-6 h-6 mx-auto text-purple-500 border-purple-500 animate-spin" />
                                    </div>
                                </div>
                            ) : (
                                <FormateurListe
                                    formateurs={formateurs}
                                    count={count}
                                    refreshData={fetchFormateurs}
                                    search={search}
                                />
                            )}
                        </section>

                    </div>
                </div>
            </div>



            <AnimatePresence>
                {showModalAjout && (
                    <FormateurAjout
                        setShowModalAjout={setShowModalAjout}
                        refreshData={fetchFormateurs}
                    />
                )}
            </AnimatePresence>
        </div>

    )
}

export default TrainerList
