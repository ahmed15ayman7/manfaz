import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Order } from '@/interfaces'
import { formatDate } from '@/lib/utils'

interface RecentOrdersCardProps {
  orders?: Order[]
}

export default function RecentOrdersCard({ orders = [] }: RecentOrdersCardProps) {
  const t = useTranslations('worker_dashboard')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{t('recent_orders')}</h2>
        <Link href="/worker/orders" className="text-primary text-sm hover:underline">
          {t('view_all')}
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{t('no_orders')}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <div>
                <h4 className="font-medium">{order.service?.name}</h4>
                <p className="text-sm text-gray-500">{order.user?.name}</p>
                <span className="text-xs text-gray-400">
                  {formatDate(order.createdAt || new Date(), 'ar')}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {t(`status.${order.status}`)}
                </span>
                <Link
                  href={`/worker/orders/${order.id}`}
                  className="text-primary hover:underline text-sm"
                >
                  {t('view')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 