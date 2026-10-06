import { ArrowDown01, Route } from "lucide-react";

export default function BonCommandeFiltersETP({ filters, onChange, onReset, perPage, setPerPage, onSubmit }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <div className="w-full py-4 bg-white">
            <form className="flex items-center justify-between gap-2 flex-nowrap" onSubmit={onSubmit}>
                <div className="flex items-center flex-1 gap-2 overflow-x-auto flex-nowrap">
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-40 min-w-[150px]">
                        <Route className="w-4 text-gray-600" />
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="w-full text-xs bg-transparent outline-none"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="1">Nouveau</option>
                            <option value="2">Planifié</option>
                            <option value="3">En cours</option>
                            <option value="4">Exécuté</option>
                            <option value="5">Annulé</option>
                            <option value="6">Facturé</option>
                            <option value="7">Payé</option>
                            <option value="8">Partiel</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-md border w-32 min-w-[120px]">
                        <ArrowDown01 className="w-5 text-gray-600" />
                        <input
                            type="text"
                            name="numero_bc"
                            value={filters.numero_bc}
                            onChange={handleChange}
                            placeholder="Numéro BC"
                            className="w-full text-xs bg-transparent outline-none"
                        />
                    </div>
                   
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-md border w-44 min-w-[140px]">
                        <label className="text-xs text-gray-500 whitespace-nowrap">
                            Date BC :
                        </label>
                        <input
                            type="date"
                            name="date_bc_fin"
                            value={filters.date_bc_fin}
                            onChange={handleChange}
                            className="w-full text-xs bg-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2 ml-4">
                    <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 transition-all bg-gray-100 rounded-md hover:bg-purple-500 hover:text-white"
                    >
                        Filtrer
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 transition-all bg-white border border-gray-300 rounded-md hover:bg-purple-100 hover:text-purple-600 hover:border-gray-100"
                    >
                        Réinitialiser
                    </button>
                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-md border min-w-[90px]">
                        <label htmlFor="perPage" className="text-sm text-gray-500">Page</label>
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={e => setPerPage(Number(e.target.value))}
                            className="w-full text-xs bg-transparent outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
    );
}