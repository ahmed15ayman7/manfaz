"use client"
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Category } from '@/interfaces'
import { useTranslations } from 'next-intl'

interface CategoryCardProps {
  category: Category
  index: number
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const t = useTranslations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <Link href={`/categories/${category.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={category.imageUrl||""}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-white/80">{category.description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 