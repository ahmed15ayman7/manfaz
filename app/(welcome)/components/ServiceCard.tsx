import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Service } from '@/interfaces'
import { useTranslations } from 'next-intl'

interface ServiceCardProps {
  service: Service
  index: number
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full mb-6">
        <Image
          src={service.imageUrl||""}
          alt={service.name}
          fill
          className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

      <Link
        href={`/services/${service.id}`}
        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        {t('learn_more')}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </motion.div>
  )
} 