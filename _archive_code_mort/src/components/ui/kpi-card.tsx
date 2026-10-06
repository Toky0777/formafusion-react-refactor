import { Card, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, ResponsiveContainer, LabelList } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { KPIData } from "@/types"

interface KPICardProps {
  title: string
  data: KPIData
  color: string
  className?: string
}

export function KPICard({ title, data, color, className }: KPICardProps) {
  const chartData = data.trend.map((value, index) => ({
    month: `${String(8 + index).padStart(2, "0")}/24`,
    value,
  }))

  const isPositiveGrowth = data.growth > 0

  return (
    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
            <div className="text-3xl font-bold text-gray-900">
              {data.current}
              {data.unit}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mois dernier: {data.previous}
              {data.unit}
            </span>
            <div className={`flex items-center gap-1 ${isPositiveGrowth ? "text-green-600" : "text-red-600"}`}>
              {isPositiveGrowth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">
                {isPositiveGrowth ? "+" : ""}
                {data.growth}%
              </span>
            </div>
          </div>

          <div className="h-20 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 5, left: 5, bottom: 20 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
                <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} strokeWidth={2}>
                  <LabelList dataKey="value" position="top" style={{ fontSize: "10px", fill: "#374151" }} />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
