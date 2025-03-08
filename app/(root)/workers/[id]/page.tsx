"use client"

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import Image from 'next/image'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import { Worker, Review } from '@/interfaces'
import { formatDate } from '@/lib/utils'

const getWorker = async ({ id, locale }: { id: string; locale: string }) => {
  const res = await axios.get(`${apiUrl}/workers/${id}?lang=${locale}`)
  return res.data
}

export default function WorkerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useStore()
  const t = useTranslations('worker_profile')
  const id = params.id as string

  const { data: workerData, isLoading, refetch } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => getWorker({ id, locale }),
  })

  useEffect(() => {
    refetch()
  }, [locale])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="w-2/3 h-8 bg-gray-100 rounded animate-pulse" />
        <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  const worker: Worker = workerData?.data

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg mb-16">
        <div className="absolute -bottom-12 left-4 flex items-end">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src={worker.user?.imageUrl || '/imgs/default-avatar.png'}
              alt={worker.user?.name || ''}
              fill
              className={`object-cover rounded-full border-4 border-white ${
                !worker.isAvailable ? 'grayscale' : ''
              }`}
            />
            {worker.isAvailable && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="mb-2 ml-4">
            <h1 className="text-2xl font-bold">{worker.user?.name}</h1>
            <p className="text-gray-600">{worker.title}</p>
            <div className="flex items-center mt-1">
              <svg
                className="w-4 h-4 text-gray-600 mr-1"
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
              </svg>
              <span className="text-gray-600 text-sm">
                {worker.user?.locations?.[0]?.city}, {t('location')}
              </span>
              {!worker.isAvailable && (
                <span className="ml-2 text-red-500 text-sm">{t('not_available')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">{worker.jobSuccessRate}%</p>
          <p className="text-gray-600 text-sm">{t('job_success')}</p>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-500">${worker.totalEarned}K+</p>
          <p className="text-gray-600 text-sm">{t('earned')}</p>
        </div>
        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">{worker.totalJobsDone}+</p>
          <p className="text-gray-600 text-sm">{t('jobs_done')}</p>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('about')}</h2>
        <p className="text-gray-600">{worker.about || worker.description}</p>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('skills')}</h2>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('experience')}</h2>
        <div className="space-y-6">
          {worker.experiences.map((exp) => (
            <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
              <h3 className="font-semibold text-lg">{exp.title}</h3>
              <p className="text-primary">{exp.company}</p>
              <p className="text-gray-600 text-sm">{exp.duration}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t('reviews')}</h2>
          <button
            onClick={() => router.push(`/workers/${id}/reviews`)}
            className="text-primary text-sm"
          >
            {t('view_all')}
          </button>
        </div>
        <div className="space-y-6">
          {worker.reviews.slice(0, 3).map((review: Review) => (
            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="relative w-10 h-10">
                    <Image
                      src={review.user.imageUrl || '/imgs/default-avatar.png'}
                      alt={review.user.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm ml-1">{review.rating}</span>
                    </div>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {formatDate(review.createdAt, locale)}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 