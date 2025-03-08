"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import useStore from '@/store/useLanguageStore'
import { formatDate } from '@/lib/utils'
import EarningsChart from '@/components/worker/EarningsChart'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'

interface EarningsData {
  total: number
  available: number
  pending: number
  history: {
    id: string
    amount: number
    type: 'order' | 'withdrawal'
    status: 'completed' | 'pending'
    createdAt: Date
    order?: {
      id: string
      service?: {
        name: string
      }
      user?: {
        name: string
      }
    }
  }[]
  chart: {
    date: string
    amount: number
  }[]
}

const getWorkerEarnings = async ({ locale, period }: { locale: string; period: string }) => {
  const url = API_ENDPOINTS.workers.getById('me', { lang: locale, include: 'earnings', period }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

export default function WorkerEarningsPage() {
  const { locale } = useStore()
  const t = useTranslations('worker_dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  const { data, isLoading } = useQuery({
    queryKey: ['worker-earnings', selectedPeriod],
    queryFn: () => getWorkerEarnings({ locale, period: selectedPeriod }),
  })

  const earnings: EarningsData = data?.data || {
    total: 0,
    available: 0,
    pending: 0,
    history: [],
    chart: [],
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-6">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>

          {/* History Skeleton */}
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('earnings')}</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
          className="p-2 border rounded-lg"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold">${earnings.total.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-6">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold">${earnings.available.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg p-6">
          <p className="text-sm text-gray-600">Pending Earnings</p>
          <p className="text-2xl font-bold">${earnings.pending.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">{t('earnings_overview')}</h2>
        <EarningsChart data={earnings.chart} />
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Earnings History</h2>
        <div className="space-y-4">
          {earnings.history.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {item.type === 'order'
                    ? `Order: ${item.order?.service?.name}`
                    : 'Withdrawal'}
                </p>
                <p className="text-sm text-gray-500">
                  {item.type === 'order' && item.order?.user?.name}
                  {' • '}
                  {formatDate(item.createdAt, locale)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    item.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {item.type === 'withdrawal' ? '-' : '+'}${item.amount.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    item.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {item.status === 'completed' ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
