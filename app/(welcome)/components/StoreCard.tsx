import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import { Store } from '@/interfaces'
import { useTranslations } from 'next-intl'

interface StoreCardProps {
  store: Store
  index: number
}

export default function StoreCard({ store, index }: StoreCardProps) {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg border bg-background hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40 w-full">
        <Image
          src={store.coverImage||""}
          alt={store.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="relative h-12 w-12 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={store.logo||""}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{store.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{store.locations[0].address}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{store.rating}</span>
            <span className="text-sm text-muted-foreground ml-1">
              ({store.reviewsCount})
            </span>
          </div>
          <Link
            href={`/stores/${store.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t('view_store')}
          </Link>
        </div>
      </div>
    </motion.div>
  )
} 