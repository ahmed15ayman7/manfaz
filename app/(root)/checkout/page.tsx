"use client"
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import useCartStore from '@/store/useCartStore'
import { useState, useEffect } from 'react'
import { IconCash, IconCreditCard } from '@tabler/icons-react'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import LoadingComponent from '@/components/shared/LoadingComponent'
import { useSession } from 'next-auth/react'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"

type PaymentMethod = 'cash' | 'card' | 'tabby' | 'tamara'

const getServiceParameter = async ({ id, locale }: { id: string; locale: string }) => {
  const res = await axios.get(`${apiUrl}/service-parameters/${id}?lang=${locale}`)
  return res.data.data
}

const getService = async ({ id, locale, type }: { id: string; locale: string; type: string }) => {
  const res = await axios.get(`${apiUrl}/services/${id}?lang=${locale}&type=${type}`)
  return res.data.data
}

export default function CheckoutPage() {
  const router = useRouter()
  const t = useTranslations()
  const { items, removeItem } = useCartStore()
  const { locale } = useStore()
  const [focusPhone, setFocusPhone] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: ''
  })

  // Use useQueries instead of mapping over items with individual useQuery hooks
  const itemQueries = useQueries({
    queries: items?.map(item => ({
      queryKey: [item?.type, item?.id, locale],
      queryFn: () => item?.type === 'service'
        ? getServiceParameter({ id: item?.id, locale })
        : getService({ id: item?.id, locale, type: 'delivery' }),
      enabled: !!item?.id && !!locale
    })) || []
  })
  let { data: userData, status } = useSession();
  const isLoading = itemQueries?.some(query => query?.isLoading)
  const isError = itemQueries?.some(query => query?.isError)

  useEffect(() => {
    if (status !== 'loading' && userData && userData?.user) {
      setFormData({
        name: userData?.user?.name || '',
        phone: userData?.user?.phone || '',
        email: userData?.user?.email || '',
        address: userData?.user?.locations[0]?.address || '',
        city: '',
        notes: ''
      })
    }
  }, [status, userData])
  const getTotalPrice = () => {
    return itemQueries?.reduce((total, query) => total + (query?.data?.price || 0), 0) || 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement checkout logic here
    console.log({ formData, paymentMethod, items, totalPrice: getTotalPrice() })
  }

  if (!items?.length) {
    return (
      <div className=" mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('checkout.empty_cart')}</h1>
        <p className="text-gray-600 mb-6">{t('checkout.empty_cart_message')}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t('checkout.browse_services')}
        </button>
      </div>
    )
  }

  if (isLoading || status === 'loading') {
    return <LoadingComponent />
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Error loading service details</p>
      </div>
    )
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.contact_info')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.phone')}</label>
                <div className="" style={{ direction: "ltr" }}>
                  <PhoneInput
                    country={"sa"}
                    onFocus={e => setFocusPhone(true)}
                    onBlur={e => setFocusPhone(false)}
                    containerClass={`border rounded-[16px] py-2 bg-white ${focusPhone ? 'ring-2 outline-none' : 'border-gray-300'}`}
                    dropdownStyle={{ border: "none !important" }}
                    value={formData.phone}
                    onChange={(value, data, event, formattedValue) => {
                      setFormData({ ...formData, phone: value })
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.city')}</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('checkout.address')}</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('checkout.notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.payment_method')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''
                  }`}
              >
                <IconCash className="text-primary" size={24} />
                <span>{t('checkout.cash')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''
                  }`}
              >
                <IconCreditCard className="text-primary" size={24} />
                <span>{t('checkout.card')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('tabby')}
                className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === 'tabby' ? 'border-primary bg-primary/5' : ''
                  }`}
              >
                <img src="/imgs/tabby.png" alt="Tabby" className="w-10 h-6" />
                <span>{t('checkout.tabby')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('tamara')}
                className={`flex items-center gap-2 p-4 border rounded-lg ${paymentMethod === 'tamara' ? 'border-primary bg-primary/5' : ''
                  }`}
              >
                <img src="/imgs/tamara.png" alt="Tamara" className="w-10 h-6" />
                <span>{t('checkout.tamara')}</span>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.order_summary')}</h2>
            <div className="space-y-4">
              {items?.map((item, index) => {
                const query = itemQueries[index]
                const itemData = query?.data

                return (
                  <div key={item?.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    {itemData?.imageUrl && (
                      <img
                        src={itemData.imageUrl}
                        alt={itemData.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{itemData?.name}</h3>
                      {itemData?.name && (
                        <p className="text-sm text-gray-600">{itemData.name}</p>
                      )}
                      <p className="text-primary font-medium mt-1">
                        {itemData?.price} {t('home_service_details_view.price')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item?.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.order_summary')}</h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('checkout.services_count', { count: items?.length })}</span>
              <span>{items?.length}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span>{t('checkout.total_amount')}</span>
              <span>
                {getTotalPrice()} {t('home_service_details_view.price')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            {t('checkout.confirm_order')}
          </button>
        </div>
      </form>
    </div>
  )
}
