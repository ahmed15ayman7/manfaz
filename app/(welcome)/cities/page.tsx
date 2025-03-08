"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  Store,
  Truck,
  Users,
  ArrowRight,
  Building2
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import { Input } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'

const mockCities = [
  {
    id: 'riyadh',
    image: '/images/cities/riyadh.jpg',
    stores: 1200,
    drivers: 3000,
    users: 500000
  },
  {
    id: 'jeddah',
    image: '/images/cities/jeddah.jpg',
    stores: 800,
    drivers: 2000,
    users: 300000
  },
  {
    id: 'dammam',
    image: '/images/cities/dammam.jpg',
    stores: 500,
    drivers: 1200,
    users: 200000
  },
  {
    id: 'makkah',
    image: '/images/cities/makkah.jpg',
    stores: 600,
    drivers: 1500,
    users: 250000
  },
  {
    id: 'madinah',
    image: '/images/cities/madinah.jpg',
    stores: 400,
    drivers: 1000,
    users: 150000
  },
  {
    id: 'khobar',
    image: '/images/cities/khobar.jpg',
    stores: 300,
    drivers: 800,
    users: 100000
  }
]

function CityCard({ city }: { city: typeof mockCities[0] }) {
  const t = useTranslations()
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-card rounded-xl overflow-hidden shadow-lg"
    >
      <Link href={`/stores?city=${city.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={city.image}
            alt={t(`cities.${city.id}.name`)}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 right-4 left-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {t(`cities.${city.id}.name`)}
            </h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-4">
            {t(`cities.${city.id}.description`)}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <Store className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-medium">{city.stores}+</p>
              <p className="text-muted-foreground">{t('cities.stores')}</p>
            </div>
            <div>
              <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-medium">{city.drivers}+</p>
              <p className="text-muted-foreground">{t('cities.drivers')}</p>
            </div>
            <div>
              <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="font-medium">{city.users}+</p>
              <p className="text-muted-foreground">{t('cities.users')}</p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function CitiesPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCities = mockCities.filter(
    (city) =>
      searchQuery === '' ||
      t(`cities.${city.id}.name`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(`cities.${city.id}.description`).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* الهيدر الرئيسي */}
      <div className="relative h-[40vh] min-h-[400px] bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/cities/pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary" />
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-primary-foreground">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center"
          >
            {t('cities.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl text-center"
          >
            {t('cities.description')}
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
                <Input
                  type="text"
                  placeholder={t('cities.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* قائمة المدن */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('cities.no_results.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('cities.no_results.description')}
              </p>
            </div>
          )}
        </div>

        {/* قسم التوسع */}
        <AnimatedSection className="mt-12">
          <div className="bg-card rounded-xl p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('cities.expansion.title')}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t('cities.expansion.description')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t('cities.suggest_city')}</span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>{t('cities.learn_more')}</span>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
} 