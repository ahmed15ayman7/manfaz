"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import { BASE_URL } from '@/lib/config'
import useStore from '@/store/useLanguageStore'
import useCartStore from '@/store/useCartStore'
import CartBottomSheet from '@/components/shared/CartBottomSheet'

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
}

interface FAQ {
  question: string
  answer: string
}

interface Service {
  id: string
  name: string
  description?: string
  imageUrl?: string
  type: string
  price?: number
  rating: number
  ratingCount: number
  warranty?: number
  installmentAvailable: boolean
  installmentMonths?: number
  monthlyInstallment?: number
  parameters: ServiceParameter[]
  faqs: FAQ[]
  whatIncluded?: string[]
}

const getService = async ({ id, locale }: { id: string; locale: string }) => {
  const res = await axios.get(`${BASE_URL}/services/${id}?lang=${locale}`)
  return res.data
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useStore()
  const { addItem } = useCartStore()
  const t = useTranslations('services')
  const t2 = useTranslations('')
  const id = params.id as string

  const [showCart, setShowCart] = useState(false)

  const { data: serviceData, isLoading, refetch } = useQuery({
    queryKey: ['service', id],
    queryFn: () => getService({ id, locale }),
  })

  const service: Service = serviceData?.data
  useEffect(() => {
    refetch()
  }, [locale])
  const handleAddToCart = (parameter?: ServiceParameter) => {
    if (parameter) {
      router.push(`/service-workers/${service.id}?parameterId=${parameter.id}`)
    } else {
      router.push(`/service-workers/${service.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
        <div className="w-2/3 h-8 bg-gray-100 rounded animate-pulse" />
        <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden flex justify-center items-center h-64 md:h-96 mb-6">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-auto h-auto object-contain rounded-lg"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{service.name}</h1>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{service.rating}</span>
          <span className="text-gray-500">({service.ratingCount})</span>
        </div>
      </div>

      {/* Description */}
      {service.description && (
        <p className="text-gray-600 mb-6">{service.description}</p>
      )}

      {/* Service Parameters */}
      {service.parameters && service.parameters.length > 0 && (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {service.parameters.map((param) => (
            <div
              key={param.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                {param.imageUrl && (
                  <img
                    src={param.imageUrl}
                    alt={param.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg max-sm:text-sm">{param.name}</h3>
                      {param.warranty && (
                        <span className="text-green-600 text-sm">
                          {t('warranty_days', { days: param.warranty })}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-lg max-sm:text-sm text-nowrap">{param.price} {t2('home_service_details_view.price')}</span>
                  </div>
                  {param.description && (
                    <p className="text-gray-600 text-sm mt-2">{param.description.slice(0, 50)}...</p>
                  )}
                  {param.installmentAvailable && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src="/imgs/tabby.png" alt="Tabby" className="h-4" />
                      <img src="/imgs/tamara.png" alt="tamara" className="h-4" />
                      <span className="text-sm text-gray-600">
                        {t('monthly_installment', { amount: param.monthlyInstallment })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex border-t">
                <button
                  onClick={() => handleAddToCart(param)}
                  className="flex-1 bg-primary text-white py-3 font-medium hover:bg-primary-600 transition-colors"
                >
                  {t('order_now')}
                </button>
                <button
                  onClick={() => router.push(`/service-parameters/${param.id}`)}
                  className="flex-1 bg-gray-50 text-gray-700 py-3 font-medium hover:bg-gray-100 transition-colors"
                >
                  {t('show_details')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {service.type === 'delivery' && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 max-sm:bottom-16">
          <div className="container mx-auto flex items-center justify-between gap-4 max-sm:flex-col">
            <div>
              <p className="text-gray-600">{t('price_includes_vat')}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">{service.price} {t2('home_service_details_view.price')}</span>
                {service.installmentAvailable && (
                  <div className="flex items-center gap-1">
                    <img src="/imgs/tabby.png" alt="Tabby" className="h-4" />
                    <span className="text-sm text-gray-600">
                      {t('monthly_installment', { amount: service.monthlyInstallment })}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleAddToCart()}
              className="bg-primary text-white max-sm:w-full  px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              {t('add_to_cart')}
            </button>
          </div>
        </div>
      )}
      {/* Cart Bottom Sheet */}
      {/* <CartBottomSheet 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
      /> */}
    </div>
  )
}
