"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import useStore from '@/store/useLanguageStore'
import { Order } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'

type OrderStatus = 'all' | 'pending' | 'in_progress' | 'completed' | 'canceled'

const getWorkerOrders = async ({ locale, status, page, limit }: { locale: string; status: OrderStatus; page: number; limit: number }) => {
  const url = API_ENDPOINTS.workers.getById('me', { lang: locale, include: 'orders', status: status === 'all' ? undefined : status, page, limit }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

export default function WorkerOrdersPage() {
  const { locale } = useStore()
  const t = useTranslations('orders')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('all')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: ['worker-orders', selectedStatus, page],
    queryFn: () => getWorkerOrders({ locale, status: selectedStatus, page, limit }),
  })

  const orders: Order[] = data?.data?.orders || []
  const totalPages = Math.ceil((data?.data?.total || 0) / limit)

  const statusTabs: { value: OrderStatus; label: string }[] = [
    { value: 'all', label: t('all') },
    { value: 'pending', label: t('pending') },
    { value: 'in_progress', label: t('in_progress') },
    { value: 'completed', label: t('completed') },
    { value: 'canceled', label: t('canceled') },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {/* Status Tabs Skeleton */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg" />
            ))}
          </div>

          {/* Orders List Skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

      {/* Status Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedStatus === tab.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('no_orders')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {order.service?.imageUrl && (
                    <div className="relative w-16 h-16">
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
                    <p className="text-sm text-gray-500">
                      {order.user?.name} • {formatDate(order.scheduledTime, locale)}
                    </p>
                    {order.description && (
                      <p className="text-sm text-gray-600 mt-2">{order.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
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
                  <p className="font-medium mt-2">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
