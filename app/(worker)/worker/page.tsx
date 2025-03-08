"use client";
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import { Worker } from '@/interfaces'
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton'
import StatsCard from '@/components/worker/StatsCard'
import RecentOrdersCard from '@/components/worker/RecentOrdersCard'
import RecentReviewsCard from '@/components/worker/RecentReviewsCard'
import EarningsChart from '@/components/worker/EarningsChart'
import axiosInstance from '@/lib/axios';

const getWorkerDashboard = async ({ locale }: { locale: string }) => {
  const res = await axiosInstance.get(`${apiUrl}/workers/dashboard?lang=${locale}`)
  return res.data
}

export default function WorkerDashboardPage() {
  const { locale } = useStore()
  const t = useTranslations('worker_dashboard')

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['worker-dashboard'],
    queryFn: () => getWorkerDashboard({ locale }),
  })

  useEffect(() => {
    refetch()

    // Socket.io setup
    const socket = io(apiUrl)

    socket.on('orderUpdated', () => {
      refetch()
      toast.info(t('new_order_notification'))
    })

    socket.on('newReview', () => {
      refetch()
      toast.info(t('new_review_notification'))
    })

    socket.on('earningsUpdated', () => {
      refetch()
      toast.success(t('earnings_updated_notification'))
    })

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission()
    }

    return () => {
      socket.disconnect()
    }
  }, [locale])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const worker: Worker = dashboardData?.data

  const handleAvailabilityToggle = async () => {
    try {
      await axios.patch(`${apiUrl}/workers/${worker.id}/availability`, {
        isAvailable: !worker.isAvailable,
      })
      refetch()
      toast.success(
        worker.isAvailable ? t('status_unavailable_success') : t('status_available_success')
      )
    } catch (error) {
      toast.error(t('status_update_error'))
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image
              src={worker.user?.imageUrl || '/imgs/default-avatar.png'}
              alt={worker.user?.name || ''}
              fill
              className="object-cover rounded-full"
            />
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${
                worker.isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
                <div>
            <h1 className="text-xl font-semibold">{t('welcome', { name: worker.user?.name })}</h1>
            <p className="text-gray-600">{worker.title}</p>
                </div>
              </div>
        <button
          onClick={handleAvailabilityToggle}
          className={`px-4 py-2 rounded-lg font-medium ${
            worker.isAvailable
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {worker.isAvailable ? t('status_available') : t('status_unavailable')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title={t('total_orders')}
          value={worker.orders?.length || 0}
          trend={5}
          icon="📦"
        />
        <StatsCard
          title={t('success_rate')}
          value={`${worker.jobSuccessRate}%`}
          trend={2}
          icon="📈"
        />
        <StatsCard
          title={t('total_earnings')}
          value={`$${worker.totalEarned}`}
          trend={8}
          icon="💰"
        />
        <StatsCard
          title={t('rating')}
          value={worker.rating.toFixed(1)}
          subValue={`(${worker.reviewsCount})`}
          trend={0}
          icon="⭐"
        />
          </div>
          
      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">{t('earnings_overview')}</h2>
            <EarningsChart data={worker.earnings} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-6">
          <RecentOrdersCard orders={worker.orders?.slice(0, 5)} />
          <RecentReviewsCard reviews={worker.reviews?.slice(0, 3)} />
        </div>
      </div>
    </div>
  )
}
