"use client"
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import useCartStore from '@/store/useCartStore'
import { useState, useEffect } from 'react'
import { IconCash, IconCreditCard, IconPlus } from '@tabler/icons-react'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { apiUrl } from '@/constant'
import useStore from '@/store/useLanguageStore'
import LoadingComponent from '@/components/shared/LoadingComponent'
import { useSession } from 'next-auth/react'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import { Select, MenuItem, SelectChangeEvent } from '@mui/material'
import { createOrder } from '@/lib/actions/orders.actions'
import { UserLocation } from '@/interfaces'

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
  const { items, removeItem, clearCart } = useCartStore()
  const { locale } = useStore()
  const [focusPhone, setFocusPhone] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [selectedServiceId, setSelectedServiceId] = useState({}as typeof items[0])
  const [formData, setFormData] = useState({
    locationId:"",
    notes: '',
    serviceId: items[0]?.id || '',
    providerId: '',
    price: 0,
    totalAmount: 0
  })

  const handleAddressChange = (event: SelectChangeEvent<string>, id: string | undefined) => {
    const selectedAddress = event.target.value ;
    if (selectedAddress === 'new') {
      router.push(`/user-locations/${id || ""}`);
    } else {
      setFormData(prev => ({ ...prev, locationId: selectedAddress }));
    }
  };

  const handleServiceSelect = (item: any) => {
    setSelectedServiceId(item);
    setFormData(prev => ({ ...prev, serviceId: item.id }));
  };

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
    setSelectedServiceId(items[0]);
    if (status !== 'loading' && userData && userData?.user) {
      setFormData({
        locationId: userData?.user?.locations[0]?.id||"",
        notes: '',
        serviceId: items[0]?.id || '',
        providerId: '', // Assuming providerId will be set later
        price: getTotalPrice(),
        totalAmount: getTotalPrice()
      })
    }
  }, [status, userData, items])

  const getTotalPrice = () => {
    return itemQueries?.reduce((total, query) => total + (query?.data?.price || 0), 0) || 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (userData?.user?.id) {
      const response = await createOrder({ locationId: formData.locationId, notes: formData.notes, serviceId: formData.serviceId, providerId: formData.providerId, price: formData.price, totalAmount: formData.totalAmount, userId:  userData?.user?.id, status: 'pending', paymentStatus: 'pending',id:""},selectedServiceId.type)
      if(response.id){
        removeItem(formData.serviceId);
        router.push(`/orders`);
      }
    }
      // Redirect or show success message
    } catch (error) {
      console.error('Error creating order:', error)
      // Show error message
    }
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
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.contact_info')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.phone')}</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('checkout.address')}</label>
                <Select
                  value={formData.locationId}
                  onChange={(e) => handleAddressChange(e, userData?.user?.id)}
                  displayEmpty
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {userData?.user?.locations.map((location, index) => (
                    <MenuItem key={index} value={location.address}>
                      {location.address}
                    </MenuItem>
                  ))}
                  <MenuItem value="new"><IconPlus /> {t('checkout.add_new_address')}</MenuItem>
                </Select>
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
            <div className="space-y-4 mb-4">
              {items?.map((item, index) => {
                const query = itemQueries[index]
                const itemData = query?.data

                return (
                  <div
                    key={item?.id}
                    style={{
                      backgroundColor: selectedServiceId?.id === item?.id ? '#5A9CFF50' : ''
                    }}
                    className={`flex p-2  items-center gap-4 border-b pb-4  cursor-pointer border ${selectedServiceId?.id === item?.id ? '  border-primary  rounded-lg' : 'last:border-transparent '}`}
                    onClick={() => handleServiceSelect(item)}
                  >
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
