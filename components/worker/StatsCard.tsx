interface StatsCardProps {
  title: string
  value: string | number
  subValue?: string
  trend?: number
  icon: string
}

export default function StatsCard({ title, value, subValue, trend = 0, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {trend !== 0 && (
          <div
            className={`flex items-center text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '•'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        {subValue && <span className="text-gray-500 text-sm ml-1">{subValue}</span>}
      </div>
    </div>
  )
} 