import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Earning } from '@/interfaces'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)



interface EarningsChartProps {
  data: Earning[]
}

export default function EarningsChart({ data = [] }: EarningsChartProps) {
  const t = useTranslations('worker_dashboard')

  const chartData = {
    labels: data.map((item) => item.createdAt.toDateString()),
    datasets: [
      {
        label: t('earnings'),
        data: data.map((item) => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value}`,
        },
      },
    },
  }

  return (
    <div className="w-full h-64">
      <Line 
        data={chartData} 
        options={{
          ...options,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(tickValue: number | string) {
                  return `$${tickValue}`
                }
              }
            }
          }
        }} 
      />
    </div>
  )
}