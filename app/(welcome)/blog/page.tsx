"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
  ArrowRight,
  Bookmark,
  Share2
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { TextField } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { id: 'all', color: 'blue' },
  { id: 'news', color: 'green' },
  { id: 'tips', color: 'orange' },
  { id: 'guides', color: 'purple' },
  { id: 'updates', color: 'pink' }
]

const tags = [
  'delivery',
  'restaurants',
  'offers',
  'app',
  'service',
  'stores',
  'payment',
  'features'
]

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: number
  image: string
  tags: string[]
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'blog.posts.latest_features.title',
    excerpt: 'blog.posts.latest_features.excerpt',
    category: 'updates',
    author: 'blog.authors.team',
    date: '2024-03-08',
    readTime: 5,
    image: '/images/blog/features.jpg',
    tags: ['app', 'features']
  },
  {
    id: '2',
    title: 'blog.posts.delivery_tips.title',
    excerpt: 'blog.posts.delivery_tips.excerpt',
    category: 'tips',
    author: 'blog.authors.support',
    date: '2024-03-07',
    readTime: 3,
    image: '/images/blog/delivery.jpg',
    tags: ['delivery', 'service']
  },
  {
    id: '3',
    title: 'blog.posts.new_stores.title',
    excerpt: 'blog.posts.new_stores.excerpt',
    category: 'news',
    author: 'blog.authors.marketing',
    date: '2024-03-06',
    readTime: 4,
    image: '/images/blog/stores.jpg',
    tags: ['stores', 'offers']
  }
]

function BlogCard({ post }: { post: BlogPost }) {
  const t = useTranslations()
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-card rounded-xl overflow-hidden shadow-lg"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image}
            alt={t(post.title)}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4">
            <span className="inline-block px-3 py-1 text-sm text-white bg-primary/80 rounded-full mb-2">
              {t(`blog.categories.${post.category}`)}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">
            {t(post.title)}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {t(post.excerpt)}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('ar-SA')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} {t('blog.minutes')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BlogPage() {
  const t = useTranslations()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = mockPosts.filter(
    (post) =>
      (activeCategory === 'all' || post.category === activeCategory) &&
      (searchQuery === '' ||
        t(post.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(post.excerpt).toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white',
      green: 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white',
      orange: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white',
      purple: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white',
      pink: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getActiveColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      pink: 'bg-pink-500 text-white'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/blog/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('blog.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('blog.description')}
          </motion.p>
        </div>
      </div>

      <div className="container py-12">
        {/* شريط البحث */}
        <AnimatedSection className="relative -mt-24 mb-12 z-20">
          <div className="bg-card shadow-xl rounded-xl p-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <TextField
                  type="text"
                  placeholder={t('blog.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* القائمة الجانبية */}
          <div className="lg:col-span-1 space-y-8">
            {/* التصنيفات */}
            <AnimatedSection className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('blog.categories.title')}
              </h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category.id
                  const baseClasses = "w-full flex items-center justify-between p-2 rounded-lg font-medium transition-colors"
                  const colorClasses = isActive
                    ? getActiveColorClasses(category.color)
                    : getColorClasses(category.color)

                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`${baseClasses} ${colorClasses}`}
                    >
                      <span>{t(`blog.categories.${category.id}`)}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                })}
              </div>
            </AnimatedSection>

            {/* الوسوم */}
            <AnimatedSection className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('blog.tags.title')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    #{t(`blog.tags.${tag}`)}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* النشرة البريدية */}
            <AnimatedSection className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t('blog.newsletter.title')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('blog.newsletter.description')}
              </p>
              <div className="space-y-4">
                <TextField
                  type="email"
                  placeholder={t('blog.newsletter.placeholder')}
                  className="w-full"
                />
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <span>{t('blog.newsletter.subscribe')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </AnimatedSection>
          </div>

          {/* المقالات */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('blog.no_results.title')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('blog.no_results.description')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 