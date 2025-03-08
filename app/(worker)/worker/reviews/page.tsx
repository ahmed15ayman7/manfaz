"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import useStore from '@/store/useLanguageStore'
import { Review } from '@/interfaces'
import { formatDate } from '@/lib/utils'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'

const getWorkerReviews = async ({ locale, page, limit }: { locale: string; page: number; limit: number }) => {
  const url = API_ENDPOINTS.workers.reviews.getAll('me', { lang: locale, page, limit }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

export default function WorkerReviewsPage() {
  const { locale } = useStore()
  const t = useTranslations('worker_profile')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: ['worker-reviews', page],
    queryFn: () => getWorkerReviews({ locale, page, limit }),
  })

  const reviews: Review[] = data?.data?.reviews || []
  const totalPages = Math.ceil((data?.data?.total || 0) / limit)

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded" />
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
      <h1 className="text-2xl font-bold mb-6">{t('reviews')}</h1>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={review.user.imageUrl || '/imgs/default-avatar.png'}
                    alt={review.user.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{review.user.name}</h3>
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
