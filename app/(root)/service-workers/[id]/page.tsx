"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import Image from 'next/image'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import { Worker } from '@/interfaces'
import { calculateDistance } from '@/lib/utils'

const getWorkers = async ({ serviceId, locale }: { serviceId: string; locale: string }) => {
  const res = await axios.get(`${apiUrl}/workers?serviceId=${serviceId}&lang=${locale}`)
  return res.data
}

export default function ServiceWorkersPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { locale } = useStore()
  const t = useTranslations('workers')
  const id = params.id as string
  const parameterId = searchParams.get('parameterId')

  const { data: workersData, isLoading } = useQuery({
    queryKey: ['workers', id],
    queryFn: () => getWorkers({ serviceId: id, locale }),
  })

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="w-2/3 h-8 bg-gray-100 rounded animate-pulse" />
        <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  const workers: Worker[] = workersData?.data || []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('available_workers')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => {
          const distance = userLocation && worker.user?.locations?.[0]
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                worker.user.locations[0].latitude,
                worker.user.locations[0].longitude
              )
            : null

          return (
            <div
              key={worker.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              <div className="relative">
                <div className={`relative w-full h-48 ${!worker.isAvailable ? 'grayscale' : ''}`}>
                  <Image
                    src={worker.user?.imageUrl || '/imgs/default-avatar.png'}
                    alt={worker.user?.name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
                {worker.isAvailable && (
                  <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 rounded-full" />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{worker.user?.name}</h3>
                    <p className="text-gray-600">{worker.title}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium mx-1">{worker.rating}</span>
                    <span className="text-gray-500">({worker.reviewsCount})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{worker.description}</p>

                {worker.user?.locations?.[0] && (
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {worker.user.locations[0].city}
                      {distance && ` (${distance.toFixed(1)} km)`}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium text-green-600">{worker.jobSuccessRate}%</span>{' '}
                    {t('success_rate')}
                  </div>
                  <div>
                    <span className="font-medium">${worker.totalEarned}</span> {t('earned')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/workers/${worker.id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    {t('show_profile')}
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/checkout?workerId=${worker.id}&serviceId=${id}${
                          parameterId ? `&parameterId=${parameterId}` : ''
                        }`
                      )
                    }
                    className={`flex-1 py-2 rounded transition-colors ${
                      worker.isAvailable
                        ? 'bg-primary text-white hover:bg-primary-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!worker.isAvailable}
                  >
                    {t('order_now')}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 