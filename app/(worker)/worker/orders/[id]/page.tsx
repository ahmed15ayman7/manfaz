"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { Order } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'
import useStore from '@/store/useLanguageStore'

const getOrderDetails = async ({ orderId, locale }: { orderId: string; locale: string }) => {
  const url = API_ENDPOINTS.orders.getById(orderId, { lang: locale }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

const updateOrderStatus = async ({ orderId, status }: { orderId: string; status: 'accepted' | 'rejected' | 'completed' }) => {
  const url = API_ENDPOINTS.orders.update(orderId, {}, false)
  const res = await axiosInstance.patch(url, { 
    status: status === 'accepted' ? 'in_progress' : status === 'completed' ? 'completed' : 'canceled' 
  })
  return res.data
}

export default function OrderDetailsPage() {
  const { locale } = useStore()
  const t = useTranslations('worker_orders')
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const orderId = params.id as string

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails({ orderId, locale }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
      toast.success(t('status_updated'))
    },
    onError: () => {
      toast.error(t('status_update_error'))
    },
  })

  const order: Order = data?.data

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('order_not_found')}</h2>
          <p className="text-gray-600 mb-4">{t('order_not_found_description')}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('go_back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('order_details')}</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          {t('go_back')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* معلومات الطلب الأساسية */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('basic_info')}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {order.service?.imageUrl && (
                <div className="relative w-20 h-20">
                  <Image
                    src={order.service.imageUrl}
                    alt={order.service.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{order.service?.name}</h3>
                <p className="text-sm text-gray-500">{t('service_id')}: {order.serviceId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('order_date')}</p>
                <p className="font-medium">{formatDate(order.createdAt || new Date(), locale)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('scheduled_time')}</p>
                <p className="font-medium">
                  {formatDate(order.scheduleOrder?.schedule.scheduledTime || new Date(), locale)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('price')}</p>
                <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('duration')}</p>
                <p className="font-medium">{order.duration} {t('minutes')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات العميل */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('customer_info')}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {order.user?.imageUrl && (
                <div className="relative w-12 h-12">
                  <Image
                    src={order.user.imageUrl}
                    alt={order.user.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{order.user?.name}</h3>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('phone')}</p>
              <p className="font-medium">{order.user?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('location')}</p>
              <p className="font-medium">{order?.address}</p>
            </div>
          </div>
        </div>

        {/* تفاصيل إضافية */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('additional_details')}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{t('description')}</p>
              <p className="font-medium">{order.description || t('no_description')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('notes')}</p>
              <p className="font-medium">{order.notes || t('no_notes')}</p>
            </div>
            {order.imageUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('attached_image')}</p>
                <div className="relative w-full h-48">
                  <Image
                    src={order.imageUrl}
                    alt={t('order_image')}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* حالة الطلب والإجراءات */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{t('status_and_actions')}</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{t('order_status')}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'canceled'
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {t(`status.${order.status}`)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('payment_status')}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${
                  order.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {t(`payment_status.${order.paymentStatus}`)}
              </span>
            </div>
            {order.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'accepted' })}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  {t('accept')}
                </button>
                <button
                  onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'rejected' })}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  {t('reject')}
                </button>
              </div>
            )}
            {order.status === 'in_progress' && (
              <button
                onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: 'completed' })}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {t('mark_as_completed')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 