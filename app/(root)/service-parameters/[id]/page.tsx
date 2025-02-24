"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import useCartStore from '@/store/useCartStore'

interface ServiceParameter {
  id: string
  name: string
  description?: string
  imageUrl?: string
  price: number
  warranty?: number
  installmentAvailable: boolean
  installmentMonths?: number
  monthlyInstallment?: number
  status: string
  whatIncluded?: string[]
  faqs?: {
    question: string
    answer: string
  }[]
}

const getServiceParameter = async ({ id, locale }: { id: string; locale: string }) => {
  const res = await axios.get(`${apiUrl}/service-parameters/${id}?lang=${locale}`)
  return res.data
}

export default function ServiceParameterPage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useStore()
  const { addItem } = useCartStore()
  const t = useTranslations('services')
  const t2 = useTranslations('')
  const id = params.id as string

  const { data: parameterData, isLoading,refetch } = useQuery({
    queryKey: ['service-parameter', id],
    queryFn: () => getServiceParameter({ id, locale }),
  })
useEffect(() => {
  refetch()
},[locale])
  const parameter: ServiceParameter = parameterData?.data

  const handleAddToCart = () => {
    if (!parameter) return
    
    addItem({
      id: parameter.id,
      type: 'service'
    })
    router.push('/checkout')
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-64 bg-gray-200" />
        <div className="container mx-auto p-4 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!parameter) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('service_not_found')}</h1>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline"
        >
          {t('back')}
        </button>
      </div>
    )
  }
  return (
    <div className="bg-white relative min-h-screen max-sm:-my-12 -my-10">
      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={parameter.imageUrl}
          alt={parameter.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className="container mx-auto p-4">
        {/* Rating and Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">5.0</span>
          <span className="text-gray-500">(1)</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{parameter.name}</h1>

        {/* Description */}
        {parameter.description && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">{t('description')}</h2>
            <p className="text-gray-600">{parameter.description}</p>
          </div>
        )}

        {/* What's Included */}
        {parameter.whatIncluded && parameter.whatIncluded.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">{t('what_included')}</h2>
            <ul className="space-y-3">
              {parameter.whatIncluded.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {parameter.faqs && parameter.faqs.length > 0 && (
          <div className="mb-20">
            <h2 className="text-lg font-medium mb-4">{t('faqs')}</h2>
            <div className="space-y-3">
              {parameter.faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">{faq.question}</span>
                    <svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" 
  viewBox="0 0 24 24" 
  strokeWidth={1.5} 
  stroke="currentColor" 
  className="w-5 h-5 transition-transform group-open:rotate-180"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
                  </summary>
                  <div className="p-4 text-gray-600">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 max-sm:bottom-16">
        <div className="container mx-auto flex items-center justify-between gap-4 max-sm:flex-col">
          <div>
            <p className="text-gray-600">{t('price_includes_vat')}</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">{parameter.price} {t2('home_service_details_view.price')}</span>
              {parameter.installmentAvailable && (
                <div className="flex items-center gap-1">
                  <img src="/imgs/tabby.png" alt="Tabby" className="h-4" />
                  <span className="text-sm text-gray-600">
                    {t('monthly_installment', { amount: parameter.monthlyInstallment })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white max-sm:w-full  px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            {t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  )
}
