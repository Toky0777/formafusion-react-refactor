export function Thead() {
    return (
        <>
            <thead>
                <tr id="" className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer ">
                    <th className="p-2 text-base font-semibold text-gray-500 ">#</th>
                    <th className="p-2 text-base font-semibold text-gray-500 ">Statut</th>
                    <th className="p-2 text-base font-semibold text-gray-500 ">Echue</th>
                    <th className="p-2 text-base font-semibold text-gray-500 ">Date d'échéance</th>
                    <th className="p-2 text-base font-semibold text-gray-500 ">Date facture</th>
                    <th className="p-2 text-base font-semibold text-center text-gray-500">N° Devis</th>
                    <th className="p-2 text-base font-semibold text-gray-500 ">Entreprise</th>
                    <th className="p-2 text-base font-semibold text-right text-gray-500">Total</th>
                    <th className="p-2 text-base font-semibold text-right text-gray-500">Montant dû</th>
                    <th className="p-2 text-base font-semibold text-right text-gray-500">Actions</th>
                </tr>
            </thead>
        </>
    )
}