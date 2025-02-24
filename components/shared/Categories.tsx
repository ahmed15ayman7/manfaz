"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from "../cards/CategoryCard";
import useStore from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiUrl } from "@/constant";
import axios from "axios";
import BottomSheet from './BottomSheet';

const getCategories = async ({locale}: {locale: string}) => {
  let res = await axios.get(`${apiUrl}/categories?lang=${locale}`)
  return res.data
}

const getServices = async ({categoryId, locale, type}: {categoryId: string, locale: string, type: string}) => {
  let res = await axios.get(`${apiUrl}/services?categoryId=${categoryId}&lang=${locale}&type=${type}`)
  return res.data
}

const Categories = () => {
  const router = useRouter();
  const {locale} = useStore();
  const t = useTranslations('home');
  const t2 = useTranslations('');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string, type: string} | null>(null);
  
  const {data: categoriesData, isLoading} = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({locale}),
  });

  const {data: servicesData, isLoading: isLoadingServices} = useQuery({
    queryKey: ['services', selectedCategory?.id],
    queryFn: () => selectedCategory ? getServices({categoryId: selectedCategory.id, locale, type: selectedCategory.type}) : null,
    enabled: !!selectedCategory,
  });

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">{t('categories')}</h2>
      <div className="grid grid-cols-4 gap-3 mt-2">
        {isLoading && <div className="w-full h-24 bg-light-3 rounded-md animate-pulse"></div>}
        {!isLoading && categoriesData?.data?.map((category: any) => (
          <CategoryCard 
            key={category.id} 
            category={category.name} 
            image={category.imageUrl}
            categoryId={category.id}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      <BottomSheet 
        isOpen={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory?.name}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoadingServices && (
            <>
              <div className="w-full h-20 bg-gray-100 rounded-md animate-pulse"></div>
              <div className="w-full h-20 bg-gray-100 rounded-md animate-pulse"></div>
            </>
          )}
          {!isLoadingServices && servicesData?.data?.map((service: any) => (
            <div 
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {service.imageUrl && (
                  <img src={service.imageUrl} alt={service.name} className="w-16 h-16 rounded-md object-cover" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{service.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{service.rating}</span>
                    </div>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  )}
                  {service.price && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-medium text-primary">{service.price} {t2("home_service_details_view.price")}</span>
                      {/* {service.warranty && (
                        <span className="text-xs text-gray-500">ضمان {service.warranty} يوم</span>
                      )} */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!isLoadingServices && servicesData?.data?.length === 0 && (
            <p className="text-center text-gray-500 col-span-2">No services found</p>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};

export default Categories;
