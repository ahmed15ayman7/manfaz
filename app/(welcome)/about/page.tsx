"use client"

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Target,
  Eye,
  Heart,
  Star,
  Users,
  Store,
  Truck,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Building2,
  Award,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import Link from 'next/link'
import Image from 'next/image'

// بيانات تجريبية لفريق العمل
const teamMembers = [
  {
    id: 1,
    name: 'about.team.member1.name',
    role: 'about.team.member1.role',
    imageUrl: '/images/team/member1.jpg'
  },
  {
    id: 2,
    name: 'about.team.member2.name',
    role: 'about.team.member2.role',
    imageUrl: '/images/team/member2.jpg'
  },
  {
    id: 3,
    name: 'about.team.member3.name',
    role: 'about.team.member3.role',
    imageUrl: '/images/team/member3.jpg'
  },
  // يمكن إضافة المزيد من أعضاء الفريق هنا
]

const stats = [
  {
    icon: Store,
    value: '2000+',
    label: 'about.stats.stores'
  },
  {
    icon: Users,
    value: '1M+',
    label: 'about.stats.users'
  },
  {
    icon: Truck,
    value: '8000+',
    label: 'about.stats.drivers'
  },
  {
    icon: MapPin,
    value: '20+',
    label: 'about.stats.cities'
  }
]

const values = [
  {
    icon: Target,
    color: 'blue',
    title: 'about.values.excellence.title',
    description: 'about.values.excellence.description'
  },
  {
    icon: Heart,
    color: 'red',
    title: 'about.values.trust.title',
    description: 'about.values.trust.description'
  },
  {
    icon: Star,
    color: 'yellow',
    title: 'about.values.innovation.title',
    description: 'about.values.innovation.description'
  }
]

const milestones = [
  {
    year: '2020',
    title: 'about.milestones.launch.title',
    description: 'about.milestones.launch.description',
    icon: Building2
  },
  {
    year: '2021',
    title: 'about.milestones.expansion.title',
    description: 'about.milestones.expansion.description',
    icon: TrendingUp
  },
  {
    year: '2022',
    title: 'about.milestones.award.title',
    description: 'about.milestones.award.description',
    icon: Award
  },
  {
    year: '2023',
    title: 'about.milestones.coverage.title',
    description: 'about.milestones.coverage.description',
    icon: MapPin
  }
]

const features = [
  {
    icon: Clock,
    color: 'green',
    title: 'about.features.speed.title',
    description: 'about.features.speed.description'
  },
  {
    icon: Shield,
    color: 'blue',
    title: 'about.features.security.title',
    description: 'about.features.security.description'
  },
  {
    icon: Users,
    color: 'purple',
    title: 'about.features.support.title',
    description: 'about.features.support.description'
  }
]

export default function AboutPage() {
  const t = useTranslations()

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-500',
      red: 'bg-red-500/10 text-red-500',
      yellow: 'bg-yellow-500/10 text-yellow-500',
      green: 'bg-green-500/10 text-green-500',
      purple: 'bg-purple-500/10 text-purple-500'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/about/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('about.description')}
          </motion.p>
        </div>
      </div>

      <div className="container py-12">
        {/* الإحصائيات */}
        <AnimatedSection className="relative -mt-24 mb-12 z-20">
          <div className="bg-card shadow-xl rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold mb-1">{value}</p>
                  <p className="text-muted-foreground">{t(label)}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* الرؤية والرسالة */}
        <AnimatedSection className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8">
              <Eye className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t('about.vision.title')}</h2>
              <p className="text-muted-foreground">{t('about.vision.content')}</p>
            </div>
            <div className="bg-card rounded-xl p-8">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">{t('about.mission.title')}</h2>
              <p className="text-muted-foreground">{t('about.mission.content')}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* القيم */}
        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, color, title, description }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl p-6 text-center"
              >
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getColorClasses(color)}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(title)}</h3>
                <p className="text-muted-foreground">{t(description)}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* المراحل */}
        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('about.milestones.title')}
          </h2>
          <div className="relative">
            <div className="absolute top-0 bottom-0 right-[50%] w-px bg-border md:right-[calc(50%-0.5px)]" />
            <div className="space-y-12">
              {milestones.map(({ year, title, description, icon: Icon }, index) => (
                <div
                  key={year}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1 md:text-right">
                    <div className="bg-card rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">{year}</p>
                          <h3 className="text-xl font-semibold">{t(title)}</h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{t(description)}</p>
                    </div>
                  </div>
                  <div className="absolute right-[50%] w-4 h-4 rounded-full bg-primary transform translate-x-2 md:translate-x-2" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* المميزات */}
        <AnimatedSection className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('about.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, color, title, description }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl p-6"
              >
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${getColorClasses(color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(title)}</h3>
                <p className="text-muted-foreground">{t(description)}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* التواصل */}
        <AnimatedSection>
          <div className="bg-card rounded-xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('about.contact.title')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('about.contact.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{t('about.contact.email_us')}</span>
                </Link>
                <a
                  href={`tel:${t('about.contact.phone')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{t('about.contact.call_us')}</span>
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
} 