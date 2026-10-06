import { useQualiopiCfp } from "../../../hooks/useQualiopiCfp";
import T from "../../../components/translate/AutoTranslator";
import { DashboardCfp } from "./component/dashboard";

export default function Qualiopi() {
    const { data, loading, error, refetch } = useQualiopiCfp();

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
                    <p className="text-gray-600">
                        <T>Chargement des données Qualité des formations</T>...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen">
                <div className="p-4 text-center">
                    <h2 className="mb-2 text-xl font-bold text-red-600">
                        Erreur de chargement
                    </h2>
                    <p className="mb-4 text-gray-600">{error.message || error}</p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50">
            <DashboardCfp
                className="w-full max-w-6xl mx-auto"
                data={data || {}}
            />
        </div>
    );
}