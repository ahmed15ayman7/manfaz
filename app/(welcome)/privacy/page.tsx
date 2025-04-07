"use client"

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown,
  Database,
  FileText,
  Shield,
  Share2,
  Cookie,
  UserCheck,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Key,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

const sections = [
  {
    id: 'introduction',
    icon: FileText,
    hasSubSections: false,
    color: 'blue'
  },
  {
    id: 'data_collection',
    icon: Database,
    hasSubSections: true,
    subSections: ['personal_info', 'device_info', 'usage_info', 'location_info'],
    color: 'green'
  },
  {
    id: 'data_usage',
    icon: Eye,
    hasSubSections: true,
    subSections: ['purpose1', 'purpose2', 'purpose3', 'purpose4'],
    color: 'purple'
  },
  {
    id: 'data_protection',
    icon: Shield,
    hasSubSections: true,
    subSections: ['encryption', 'access_control', 'monitoring', 'backups'],
    color: 'red'
  },
  {
    id: 'data_sharing',
    icon: Share2,
    hasSubSections: true,
    subSections: ['third_parties', 'legal_requirements', 'business_transfer'],
    color: 'orange'
  },
  {
    id: 'cookies',
    icon: Cookie,
    hasSubSections: true,
    subSections: ['essential', 'analytics', 'marketing'],
    color: 'yellow'
  },
  {
    id: 'user_rights',
    icon: UserCheck,
    hasSubSections: true,
    subSections: ['access', 'rectification', 'deletion', 'portability'],
    color: 'teal'
  },
  {
    id: 'changes',
    icon: AlertTriangle,
    hasSubSections: false,
    color: 'pink'
  }
]

const securityFeatures = [
  {
    icon: Lock,
    title: 'privacy.security.encryption.title',
    description: 'privacy.security.encryption.description'
  },
  {
    icon: Key,
    title: 'privacy.security.access.title',
    description: 'privacy.security.access.description'
  },
  {
    icon: Eye,
    title: 'privacy.security.monitoring.title',
    description: 'privacy.security.monitoring.description'
  },
  {
    icon: Shield,
    title: 'privacy.security.compliance.title',
    description: 'privacy.security.compliance.description'
  }
]

interface AccordionItemProps {
  title: string
  content: string
  icon: any
  isOpen: boolean
  onToggle: () => void
  hasSubSections?: boolean
  subSections?: string[]
  sectionId: string
  color: string
}

function AccordionItem({
  title,
  content,
  icon: Icon,
  isOpen,
  onToggle,
  hasSubSections,
  subSections,
  sectionId,
  color
}: AccordionItemProps) {
  const t = useTranslations()

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      green: 'bg-green-500/10 text-green-500',
      purple: 'bg-purple-500/10 text-purple-500',
      red: 'bg-red-500/10 text-red-500',
      orange: 'bg-orange-500/10 text-orange-500',
      yellow: 'bg-yellow-500/10 text-yellow-500',
      teal: 'bg-teal-500/10 text-teal-500',
      pink: 'bg-pink-500/10 text-pink-500'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
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
              {hasSubSections && subSections && (
                <div className="space-y-4">
                  {subSections.map((subSection) => (
                    <div
                      key={subSection}
                      className="flex items-start gap-4 bg-background p-4 rounded-lg"
                    >
                      <div className="mt-1">
                        <Info className={`w-5 h-5 ${getColorClasses(color)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          {t(`privacy.${sectionId}.${subSection}.title`)}
                        </h4>
                        <p className="text-muted-foreground">
                          {t(`privacy.${sectionId}.${subSection}.content`)}
                        </p>
                      </div>
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

export default function PrivacyPage() {
  const t = useTranslations()
  const [openSection, setOpenSection] = useState<string | null>('introduction')
  const [lastUpdated] = useState('2024-03-08')
  let locale = useLocale()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background flex items-center flex-col to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/privacy/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className=" relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('privacy.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('privacy.description')}
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
                    {t('privacy.last_updated')}
                  </p>
                  <p className="font-medium">
                    {formatDate(lastUpdated, locale)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('privacy.read_time')}
                  </p>
                  <p className="font-medium">8 {t('privacy.minutes')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('privacy.questions')}
                  </p>
                  <Link 
                    href="/contact" 
                    className="font-medium text-primary hover:underline"
                  >
                    {t('privacy.contact_us')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ميزات الأمان */}
        <AnimatedSection className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('privacy.security.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-xl text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(title)}</h3>
                <p className="text-muted-foreground">{t(description)}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* المحتوى الرئيسي */}
        <div className="max-w-4xl mx-auto">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              title={t(`privacy.${section.id}.title`)}
              content={t(`privacy.${section.id}.content`)}
              icon={section.icon}
              isOpen={openSection === section.id}
              onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
              hasSubSections={section.hasSubSections}
              subSections={section.subSections}
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
                {t('privacy.commitment.title')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('privacy.commitment.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{t('privacy.contact_support')}</span>
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t('privacy.view_terms')}</span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
} 