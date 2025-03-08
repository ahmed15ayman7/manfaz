"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Search,
  ShoppingBag,
  Truck,
  CreditCard,
  UserCircle,
  HelpCircle,
  Phone,
  Mail
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { TextField } from '@mui/material'
import Link from 'next/link'

const categories = [
  {
    id: 'general',
    icon: HelpCircle,
    color: 'blue'
  },
  {
    id: 'orders',
    icon: ShoppingBag,
    color: 'green'
  },
  {
    id: 'delivery',
    icon: Truck,
    color: 'orange'
  },
  {
    id: 'payment',
    icon: CreditCard,
    color: 'purple'
  },
  {
    id: 'account',
    icon: UserCircle,
    color: 'pink'
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <motion.button
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <span className="text-lg font-medium text-right">{question}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-muted/30">
              <p className="text-muted-foreground">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const t = useTranslations()
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

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

  const getFAQs = (categoryId: string) => {
    const questions = []
    for (let i = 1; i <= 5; i++) {
      const questionKey = `faq.${categoryId}.q${i}`
      const answerKey = `faq.${categoryId}.a${i}`
      
      try {
        const question = t(questionKey)
        const answer = t(answerKey)
        questions.push({ id: `${categoryId}-q${i}`, question, answer })
      } catch {
        break
      }
    }
    return questions
  }

  const currentFAQs = getFAQs(activeCategory).filter(
    faq =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/faq/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('faq.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('faq.description')}
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
                  placeholder={t('faq.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* التصنيفات */}
        <AnimatedSection className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              const baseClasses = "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors"
              const colorClasses = isActive
                ? getActiveColorClasses(category.color)
                : getColorClasses(category.color)

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`${baseClasses} ${colorClasses}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(`faq.categories.${category.id}`)}</span>
                </button>
              )
            })}
          </div>
        </AnimatedSection>

        {/* الأسئلة الشائعة */}
        <div className="max-w-3xl mx-auto">
          {currentFAQs.length > 0 ? (
            currentFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openQuestion === faq.id}
                onToggle={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('faq.no_results.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('faq.no_results.description')}
              </p>
            </div>
          )}
        </div>

        {/* قسم المساعدة */}
        <AnimatedSection className="mt-12">
          <div className="bg-card rounded-xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('faq.need_help.title')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('faq.need_help.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{t('faq.contact_us')}</span>
                </Link>
                <a
                  href={`tel:${t('faq.support_phone')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{t('faq.call_support')}</span>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
} 