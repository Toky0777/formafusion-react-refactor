import { Clipboard, FileText, ThumbsUp } from "lucide-react";

export function BonCommandeDashboard({ totals }) {
    const cards = [
        {
            label: "Total Bons de Commande",
            value: totals.total_bc,
            icon: Clipboard,
            bgFrom: "from-green-50",
            bgTo: "to-green-100/30",
            border: "border-green-200/50",
            iconBg: "bg-[#10b981]"
        },
        {
            label: "Total Devis",
            value: totals.total_devis,
            icon: FileText,
            bgFrom: "from-blue-50",
            bgTo: "to-blue-100/30",
            border: "border-blue-200/50",
            iconBg: "bg-[#6364f1]"
        },
        {
            label: "Total Nouveau Bon de commande",
            value: totals.total_new_bc,
            icon: ThumbsUp,
            bgFrom: "from-gray-50",
            bgTo: "to-gray-100/30",
            border: "border-gray-200/50",
            iconBg: "bg-gray-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
            {cards.map((card, index) => (
                <DashboardCard key={index} card={card} />
            ))}
        </div>
    );
}

function DashboardCard({ card }) {
    const Icon = card.icon;

    return (
        <div className={`flex items-center gap-4 p-6 transition-all duration-200 border bg-gradient-to-br rounded-xl group ${card.bgFrom} ${card.bgTo} ${card.border} hover:shadow-md`}>
            <div className={`p-3 rounded-xl shadow-sm transition-transform group-hover:scale-105 ${card.iconBg}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">
                    {Number(card.value).toLocaleString("fr-FR")} Ar
                </p>
                <p className="text-sm font-medium text-gray-600">
                    {card.label}
                </p>
            </div>
        </div>
    );
}