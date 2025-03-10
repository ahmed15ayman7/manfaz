"use client"
import { useTranslations } from 'next-intl'
import API_ENDPOINTS from '@/lib/apis'
import AnimatedSection from './components/AnimatedSection'
import ServiceCard from './components/ServiceCard'
import StoreCard from './components/StoreCard'
import CategoryCard from './components/CategoryCard'

import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/lib/axios'
import { Skeleton } from '@mui/material'
const useServicesQuery = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => axiosInstance.get(API_ENDPOINTS.services.getAll({ limit: 6 }, false))
  })
}

const useStoresQuery = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: () => axiosInstance.get(API_ENDPOINTS.stores.getAll({ limit: 6 }, false))
  })
}

const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get(API_ENDPOINTS.categories.getAll({ limit: 6 }, false))
  })
}

export default function WelcomePage() {
  const t = useTranslations()
  const { data: services, isLoading: servicesLoading } = useServicesQuery()
  const { data: stores, isLoading: storesLoading } = useStoresQuery()
  const { data: categories, isLoading: categoriesLoading } = useCategoriesQuery()

  return (
    <div className="space-y-20 py-10 flex flex-col items-center">
      {/* Hero Section */}
      <AnimatedSection className="container text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {t('hero.description')}
        </p>
      </AnimatedSection>

      {/* Services Section */}
      <section className="container">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t('our_services')}</h2>
          <p className="mt-2 text-muted-foreground">{t('services.description')}</p>
        </AnimatedSection>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesLoading ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[30vh]" />
          )) : services?.data?.data?.map((service: any, index: any) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t('browse_categories')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('categories.description')}
          </p>
        </AnimatedSection>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesLoading ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[30vh]" />
          )) : categories?.data?.data?.categories?.map((category: any, index: any) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="container">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-bold">{t('featured_stores')}</h2>
          <p className="mt-2 text-muted-foreground">{t('stores.description')}</p>
        </AnimatedSection>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {storesLoading ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[30vh]" />
          )) : stores?.data?.data?.stores.map((store: any, index: any) => (
            <StoreCard key={store.id} store={store} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="container text-center space-y-4">
        <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {t('cta.description')}
        </p>
        <div className="mt-6">
          <a
            href="https://play.google.com/store/apps/details?id=com.manfaz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="/google-play-badge.svg"
              alt="Get it on Google Play"
              className="h-32"
            />
          </a>
          <a
            href="https://apps.apple.com/app/manfaz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block ml-4"
          >
            <img
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              className="h-32"
            />
          </a>
        </div>
      </AnimatedSection>
    </div>
  )
} 