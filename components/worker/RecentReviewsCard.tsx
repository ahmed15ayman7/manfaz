import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Review } from '@/interfaces'
import { formatDate } from '@/lib/utils'

interface RecentReviewsCardProps {
  reviews?: Review[]
}

export default function RecentReviewsCard({ reviews = [] }: RecentReviewsCardProps) {
  const t = useTranslations('worker_dashboard')

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{t('recent_reviews')}</h2>
        <Link href="/worker/reviews" className="text-primary text-sm hover:underline">
          {t('view_all')}
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{t('no_reviews')}</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
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
                  {formatDate(review.createdAt, 'ar')}
                </span>
              </div>
              <p className="text-gray-600 line-clamp-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 