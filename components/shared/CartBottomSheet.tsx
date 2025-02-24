"use client"
import BottomSheet from './BottomSheet'
import useCartStore from '@/store/useCartStore'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiUrl } from '@/constant'
import axios from 'axios'
import  useStore  from '@/store/useLanguageStore';
import LoadingComponent from './LoadingComponent'


interface CartBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}
let getService = async ({ id, locale, type }: { id: string, locale: string, type: string }) => {
  const res = await axios.get(`${apiUrl}/services/${id}?lang=${locale}&type=${type}`)
  return res.data.data
}
const CartBottomSheet = ({ isOpen, onClose }: CartBottomSheetProps) => {
  const router = useRouter()
  const { items } = useCartStore()

  const {locale} = useStore();
  let {data:serviceData,isLoading} = useQuery({
    queryKey:['service'],
    queryFn:() => getService({ id: items[0].id, locale, type: 'delivery' })
  })
  const handleCheckout = () => {
    router.push('/checkout')
    onClose()
  }
if (isLoading) {
  return <LoadingComponent />
}
console.log(serviceData)
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="bg-primary-600 -m-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">السلة</h2>
          <span className="text-white">{items.length} خدمات</span>
        </div>
        
        <div className="space-y-4 mb-6">
          {[serviceData].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.parameterName && (
                    <p className="text-sm text-gray-600">{item.parameterName}</p>
                  )}
                  <p className="text-primary font-medium mt-1">{item.price} ريال</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-medium">المجموع</span>
          <span className="text-white font-bold text-xl">{serviceData?.data.price} ريال</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-white text-primary font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إكمال العملية
        </button>
      </div>
    </BottomSheet>
  )
}

export default CartBottomSheet
