/**
 * @file ProductDetailsPage.tsx
 * @description صفحة تفاصيل المنتج التي تعرض معلومات المنتج الكاملة وتتيح إضافته للسلة
 * يدعم الصفحة اللغات المتعددة والتصميم المتجاوب وحركات الانتقال
 */

"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Star, 
  Clock, 
  Package2,
  Share2,
  Heart,
  Truck,
  Shield,
  Store,
  BarChart3
} from 'lucide-react'
import useStore from '@/store/useLanguageStore'
import useCartStore from '@/store/useCartStore'
import API_ENDPOINTS from '@/lib/apis'
import { Product, Store as StoreType } from '@/interfaces'
import { Button, Rating, Tooltip, Divider } from '@mui/material'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/axios'
/**
 * جلب تفاصيل المنتج من الخادم
 * @param id - معرف المنتج
 * @param storeId - معرف المتجر
 * @param locale - اللغة الحالية
 * @returns وعد يحتوي على بيانات المنتج
 */
const getProductDetails = async ({ id, storeId, locale }: { 
  id: string
  storeId: string
  locale: string 
}) => {
  const url = API_ENDPOINTS.stores.products(storeId, { id, lang: locale }, false)
  const res = await axiosInstance.get(url)
  return res.data.data
}

/**
 * المكون الرئيسي لصفحة تفاصيل المنتج
 * يعرض صور المنتج، معلوماته، السعر، المكونات، والإضافات
 * يتيح التحكم في الكمية وإضافة المنتج للسلة
 */
export default function ProductDetailsPage() {
  // Hooks and state
  const params = useParams()
  const router = useRouter()
  const { locale } = useStore()
  const t = useTranslations('stores.product_details')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem, getItemQuantity } = useCartStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => getProductDetails({ 
      id: params.id as string, 
      storeId: params.storeId as string, 
      locale 
    }),
  })

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

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      type: 'product',
      quantity,
      product
    })

    toast.success(t('added_to_cart'), {
      position: locale === 'ar' ? 'top-left' : 'top-right',
      autoClose: 2000,
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 p-4"
        >
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-20 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
          </div>
        </motion.div>
      </div>
    )
  }

  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4"
        >
          <h1 className="text-2xl font-bold text-gray-800">{t('product_not_found')}</h1>
          <p className="text-gray-600 mt-2">{t('product_not_found_description')}</p>
          <Button onClick={() => router.back()} className="mt-4">
            {t('common.go_back')}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sticky header */}
      <motion.div
        initial={false}
        animate={{ 
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          borderBottom: isScrolled ? '1px solid #E5E7EB' : 'none'
        }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur-sm transition-colors duration-200"
      >
        <Button
          variant="outlined"
          size="small"
          className="rounded-full bg-white/80"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Tooltip title={t('share_product')}>
            <Button
              variant="outlined"
              size="small"
              className="rounded-full bg-white/80"
              onClick={() => {
                // Share functionality
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </Tooltip>
          <Tooltip title={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}>
            <Button
              variant="outlined"
              size="small"
              className="rounded-full bg-white/80"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </Tooltip>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Product images */}
        <motion.div variants={itemVariants} className="relative aspect-square">
          <Image
            src={product.images[selectedImage] || '/imgs/default-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Thumbnail gallery */}
        <motion.div variants={itemVariants} className="bg-white p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((image: string, index: number) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Product details */}
        <motion.div variants={itemVariants} className="p-4 bg-white mt-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={product.rating || 0} readOnly size="small" />
                <span className="text-sm text-gray-500">({product.reviewsCount || 0})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {product.discountPrice || product.price} {t('common.currency')}
                </span>
                {product.discountPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.price} {t('common.currency')}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <span className="text-sm text-green-600">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% {t('off')}
                </span>
              )}
            </div>
          </div>

          <Divider className="my-4" />

          {/* Product stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Package2 className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">{product.stock} {t('in_stock')}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">{product.totalOrders || 0} {t('total_orders')}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">{product.deliveryTime} {t('delivery_time')}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Store className="h-6 w-6 text-primary mb-2" />
              <span className="text-sm font-medium">{t('seller_info')}</span>
            </div>
          </div>

          <Divider className="my-4" />

          {/* Product description */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">{t('product_description')}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold mb-2">{t('ingredients')}</h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Extras */}
          {product.extras && product.extras.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold mb-2">{t('extras')}</h2>
              <div className="flex flex-wrap gap-2">
                {product.extras.map((extra: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {extra}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Shipping and warranty info */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">{t('shipping_info')}</h3>
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">{t('warranty')}</h3>
                <p className="text-sm text-gray-600">1 year warranty</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add to cart bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                disabled={quantity <= 1}
              >
                <Minus className="h-5 w-5" />
              </motion.button>
              <span className="text-lg font-medium">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                disabled={quantity >= (product.stock || 1)}
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1 ml-4"
              disabled={!product.isAvailable || product.stock === 0}
              variant="contained"
              color="primary"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {t('cart.add_to_cart')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 