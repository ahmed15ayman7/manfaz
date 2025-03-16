"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Tab } from '@headlessui/react'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Tag, 
  Gift, 
  Ticket, 
  ArrowLeft, 
  Search,
  ChevronRight,
  Info,
  ShoppingBag,
  Heart
} from 'lucide-react'
import useStore from '@/store/useLanguageStore'
import API_ENDPOINTS from '@/lib/apis'
import axiosInstance from '@/lib/axios'
import { Store, Product, StoreOffer, UserLocation } from '@/interfaces'
import { calculateDistance, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Button, Input, Tabs, Rating, Chip, IconButton, Tooltip } from '@mui/material'
import { useUser } from '@/hooks/useUser'

const getStoreDetails = async ({ storeId, locale }: { storeId: string; locale: string }) => {
  const url = API_ENDPOINTS.stores.getById(storeId, { lang: locale }, false)
  const res = await axiosInstance.get(url)
  return res.data
}

export default function StoreDetailsPage() {
  const params = useParams()
  const { locale } = useStore()
  const t = useTranslations('stores.store_details')
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  let { user, status } = useUser()
  const { data: storeData, isLoading, refetch } = useQuery({
    queryKey: ['store', params.storeId],
    queryFn: () => getStoreDetails({ storeId: params.storeId as string, locale }),
  })

  useEffect(() => {
    refetch()
  }, [locale])

  const store: Store = storeData?.data

  useEffect(() => {
    if (store?.categories?.length > 0) {
      setSelectedCategory(store.categories[0].id)
    }
  }, [store])

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerPosition = headerRef.current.getBoundingClientRect().top
        setIsHeaderSticky(headerPosition <= 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  let [locations, setLocations] = useState<UserLocation[]>([])
  useEffect(() => {
    if (status !== 'loading') {
      setLocations(user?.locations || [])
    }
  }, [status])

  const filteredProducts = (categoryId: string) => {
    return store?.products.filter(product => {
      const matchesCategory = product.categoryId === categoryId
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }

  const handleCategoryInView = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const scrollToCategory = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: "smooth" })
    setSelectedCategory(categoryId)
  }
  let calculateDistance = (latitude: number, longitude: number) => {
    let shortestDistance = 1000000
    locations.forEach(location => {
      let distance = Math.sqrt(Math.pow(latitude - location.latitude, 2) + Math.pow(longitude - location.longitude, 2))
      if (distance < shortestDistance) {
        shortestDistance = distance
      }
    })
    return Math.round(shortestDistance * 100) / 100
  }
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  // التحقق من حالة المتجر وساعات العمل
  const isOpen = useMemo(() => {
      if (store.status !== 'active') return false;

      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 للأحد، 1 للاثنين، إلخ
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const todayHours = store.workingHours?.find(hours => hours.dayOfWeek === dayOfWeek);

      if (!todayHours || !todayHours.isOpen) return false;

      return currentTime.localeCompare(todayHours.openTime) >= 0 && currentTime.localeCompare(todayHours.closeTime) < 0;
  }, [store.status, store.workingHours]);

  // الحصول على وقت الفتح القادم
  const nextOpenTime = useMemo(() => {
      if (isOpen) return null;

      const now = new Date();
      const dayOfWeek = now.getDay();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const todayHours = store.workingHours?.find(hours => hours.dayOfWeek === dayOfWeek);
      
      if (todayHours && todayHours.isOpen && currentTime < todayHours.openTime) {
        return todayHours.openTime;
      }
      
      // البحث عن اليوم التالي المفتوح
      for (let i = 1; i <= 7; i++) {
        const nextDay = (dayOfWeek + i) % 7;
        const nextDayHours = store.workingHours?.find(hours => hours.dayOfWeek === nextDay);
        
        if (nextDayHours?.isOpen) {
          return nextDayHours.openTime;
        }
      }
      
      return null;
    }, [isOpen, store.workingHours]);
    
      if (isLoading) {
        return (
          <div className="container mx-auto p-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8" />
            <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        )
      }
    
      if (!store) {
        return (
          <div className="container mx-auto p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">{t('store_not_found')}</h1>
              <p className="text-gray-600 mt-2">{t('store_not_found_description')}</p>
            </div>
          </div>
        )
      }
    return (
    <div className="min-h-screen bg-gray-50 rounded-3xl">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 rounded-t-3xl">
        <Image
          src={store.coverImage || '/imgs/default-cover.jpg'}
          alt={store.name}
          fill
          className="object-cover rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-black/20 rounded-3xl" />
        <Button
          variant="outlined"
          className="absolute top-4 right-4 text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Store Info */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative px-4 py-6 bg-white rounded-t-3xl -mt-6"
      >
        <motion.div variants={itemVariants} className="flex items-start gap-4">
          <div className="relative h-20 w-20 rounded-xl overflow-hidden">
            <Image
              src={store.logo || '/imgs/default-logo.jpg'}
              alt={store.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{store.name}</h1>
              <IconButton>
                <Heart className="h-6 w-6" />
              </IconButton>
            </div>
            <p className="text-sm text-gray-500">{store.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Rating value={store.rating} readOnly size="small" />
              <span className="text-sm text-gray-500">
                ({store.reviewsCount} {t('reviews')})
              </span>
            </div>
            <Chip
              label={t(`store_status.${store.status}`)}
              color={isOpen? 'success' : 'default'}
              variant="outlined"
              size="small"
            />
          </div>
        </motion.div>

        {/* Store Stats */}
        <motion.div variants={itemVariants} className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm text-center">
              {store.locations[0]?.address} • {calculateDistance(store.locations[0]?.latitude, store.locations[0]?.longitude)} {t('km_away')}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Clock className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm text-center">
              {store.workingHours[0]?.isOpen
                ? t('opens_at', { time: store.workingHours[0]?.openTime })
                : t('closed')}
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Tag className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm text-center">
              {t('min_order')}: {store.minOrderAmount} SAR
            </span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm text-center">
              {t('delivery_fee')}: {store.deliveryFee} SAR
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Search & Categories */}
      <div
        ref={headerRef}
        className={cn(
          "bg-white py-4 transition-all duration-300",
          isHeaderSticky && "fixed top-0 left-0 right-0 shadow-md z-50"
        )}
      >
        <div className="px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={t('search.stores_placeholder')}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-gray-50"
            />
          </div>
          <Tabs
            value={selectedCategory}
            onChange={(event, value) => scrollToCategory(value)}
            className="mt-4 overflow-x-auto"
            variant="scrollable"
            scrollButtons="auto"
          >
            {store.categories.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                title={category.name}
                className="min-w-[120px]"
              />
            ))}
          </Tabs>
        </div>
      </div>

      {/* Content Tabs */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-4 border-b mb-6 px-4 bg-white">
          <Tab className={({ selected }) => cn(
            'pb-2 px-4 text-sm font-medium outline-none',
            selected ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
          )}>
            {t('products')}
          </Tab>
          <Tab className={({ selected }) => cn(
            'pb-2 px-4 text-sm font-medium outline-none',
            selected ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
          )}>
            {t('offers')}
          </Tab>
          <Tab className={({ selected }) => cn(
            'pb-2 px-4 text-sm font-medium outline-none',
            selected ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
          )}>
            {t('discounts')}
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Products Panel */}
          <Tab.Panel>
            <div className="pb-20">
              {store.categories.map((category) => (
                <motion.div
                  key={category.id}
                  ref={(el: HTMLDivElement | null) => {
                    categoryRefs.current[category.id] = el;
                  }}
                  className="bg-white mb-4"
                >
                  <div className="px-4 py-3 border-b">
                    <h2 className="text-lg font-bold">{category.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-4">
                    <AnimatePresence>
                      {filteredProducts(category.id)?.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`/stores/${store.id}/products/${product.id}`)}
                        >
                          <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[0] || '/imgs/default-product.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {product.discountPrice && (
                              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% {t('off')}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div>
                                <span className="font-bold">{product.price} SAR</span>
                                {product.discountPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {product.discountPrice} SAR
                                  </span>
                                )}
                              </div>
                              <Rating value={product.rating} readOnly size="small" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredProducts(category.id)?.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">{t('no_products_found')}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Tab.Panel>

          {/* Offers Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <AnimatePresence>
                {store.offers.map((offer: StoreOffer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {offer.image && (
                      <div className="relative h-48">
                        <Image
                          src={offer.image}
                          alt={offer.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <Tag className="w-5 h-5 text-primary mr-2" />
                        <h3 className="font-medium">{offer.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>{t('valid_until')}</span>
                          <span>{formatDate(offer.endDate, locale)}</span>
                        </div>
                        {offer.discountPercentage && (
                          <div className="flex items-center mt-1">
                            <span className="text-primary font-bold">
                              {offer.discountPercentage}% {t('off')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {store.offers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('no_offers_found')}</p>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Discounts & Coupons Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Ticket className="w-5 h-5 mr-2" />
                  {t('coupons')}
                </h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {store.Coupon.map((coupon, index) => (
                      <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{coupon.code}</span>
                            <p className="text-sm text-gray-500 mt-1">
                              {coupon.discountPercentage
                                ? `${coupon.discountPercentage}% ${t('off')}`
                                : `${coupon.discountAmount} SAR ${t('off')}`
                              }
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">{t('expires')}</span>
                            <p className="text-sm font-medium">
                              {formatDate(coupon.expiryDate, locale)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  {t('gift_cards')}
                </h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {store.GiftCard.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{card.code}</span>
                            <p className="text-sm text-gray-500 mt-1">
                              {card.amount} SAR
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">{t('expires')}</span>
                            <p className="text-sm font-medium">
                              {formatDate(card.expiryDate, locale)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 