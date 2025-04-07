"use client"

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  FileText,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Truck,
  AlertTriangle,
  Scale,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

const sections = [
  {
    id: 'introduction',
    icon: FileText,
    color: 'blue'
  },
  {
    id: 'user_agreement',
    icon: UserCheck,
    color: 'green',
    subsections: ['eligibility', 'account', 'responsibilities']
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    color: 'purple',
    subsections: ['data_collection', 'data_usage', 'data_protection']
  },
  {
    id: 'payment',
    icon: CreditCard,
    color: 'orange',
    subsections: ['methods', 'fees', 'refunds']
  },
  {
    id: 'delivery',
    icon: Truck,
    color: 'pink',
    subsections: ['process', 'timing', 'responsibility']
  },
  {
    id: 'prohibited',
    icon: AlertTriangle,
    color: 'red',
    subsections: ['content', 'activities', 'consequences']
  },
  {
    id: 'liability',
    icon: Scale,
    color: 'yellow',
    subsections: ['limitations', 'indemnification', 'disclaimers']
  }
]

interface AccordionItemProps {
  title: string
  content: string
  icon: any
  isOpen: boolean
  onToggle: () => void
  subsections?: string[]
  sectionId: string
  color: string
}

function AccordionItem({
  title,
  content,
  icon: Icon,
  isOpen,
  onToggle,
  subsections,
  sectionId,
  color
}: AccordionItemProps) {
  const t = useTranslations()

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      green: 'bg-green-500/10 text-green-500',
      purple: 'bg-purple-500/10 text-purple-500',
      orange: 'bg-orange-500/10 text-orange-500',
      pink: 'bg-pink-500/10 text-pink-500',
      red: 'bg-red-500/10 text-red-500',
      yellow: 'bg-yellow-500/10 text-yellow-500'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="border rounded-lg  overflow-hidden mb-4">
      <motion.button
        className="w-full flex items-center justify-between p-6 bg-card hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xl font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={`w-6 h-6 transition-transform ${
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
            <div className="p-6 bg-muted/30">
              <p className="text-muted-foreground mb-6">{content}</p>
              {subsections && (
                <div className="space-y-4">
                  {subsections.map((subsection) => (
                    <div
                      key={subsection}
                      className="bg-background p-4 rounded-lg"
                    >
                      <h4 className="font-medium mb-2">
                        {t(`terms.${sectionId}.${subsection}.title`)}
                      </h4>
                      <p className="text-muted-foreground">
                        {t(`terms.${sectionId}.${subsection}.content`)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function TermsPage() {
  const t = useTranslations()
  const [openSection, setOpenSection] = useState<string | null>('introduction')
  const [lastUpdated] = useState('2024-03-08')
  let locale = useLocale()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden w-full">
        <div className="absolute inset-0 bg-[url('/images/terms/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className=" relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('terms.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('terms.description')}
          </motion.p>
        </div>
      </div>

      <div className="container py-12">
        {/* شريط المعلومات */}
        <AnimatedSection className="relative -mt-24 mb-12 z-20 bg-white">
          <div className="bg-card shadow-xl rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('terms.last_updated')}
                  </p>
                  <p className="font-medium">
                    {formatDate(lastUpdated, locale)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('terms.questions')}
                  </p>
                  <Link
                    href="/contact"
                    className="font-medium text-primary hover:underline"
                  >
                    {t('terms.contact_us')}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('terms.support')}
                  </p>
                  <a
                    href={`tel:${t('terms.support_phone')}`}
                    className="font-medium hover:underline"
                  >
                    {t('terms.support_phone')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              title={t(`terms.${section.id}.title`)}
              content={t(`terms.${section.id}.content`)}
              icon={section.icon}
              isOpen={openSection === section.id}
              onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
              subsections={section.subsections}
              sectionId={section.id}
              color={section.color}
            />
          ))}
        </div>

        {/* تذييل الصفحة */}
        <AnimatedSection className="mt-12">
          <div className="bg-card rounded-xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('terms.agreement.title')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('terms.agreement.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{t('terms.view_privacy')}</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{t('terms.contact_support')}</span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
} 