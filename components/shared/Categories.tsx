"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from "../cards/CategoryCard";
import useStore from '@/store/useLanguageStore';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/lib/config';
import axios from "axios";
import BottomSheet from './BottomSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';

const getCategories = async ({ locale, type = 'all', search }: { locale: string, type?: string, search: string }) => {
  let res = await axios.get(`${BASE_URL}/categories?type=${type}&lang=${locale}`)
  return res.data
}

const getServices = async ({ categoryId, locale, type, search }: { categoryId: string, locale: string, type: string, search: string }) => {
  let res = await axios.get(`${BASE_URL}/services?categoryId=${categoryId}&lang=${locale}&type=${type}`)
  return res.data
}

const Categories = ({ search }: { search: string }) => {
  const router = useRouter();
  const { locale } = useStore();
  const t = useTranslations('home');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string, type: string } | null>(null);

  const { data: categoriesData, isLoading, refetch } = useQuery({
    queryKey: ['categories', selectedTab],
    queryFn: () => getCategories({ locale, type: selectedTab === 0 ? 'service' : 'delivery', search }),
  });

  const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useQuery({
    queryKey: ['services', selectedCategory?.id],
    queryFn: () => selectedCategory ? getServices({ categoryId: selectedCategory.id, locale, type: selectedCategory.type, search }) : null,
    enabled: !!selectedCategory,
  });

  const handleCategoryClick = (category: any) => {
    if (category.type === 'delivery_service') {
      router.push('/delivery-service');
      return;
    }
    setSelectedCategory(category);
  };

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  useEffect(() => {
    refetch();
    refetchServices();
  }, [locale, selectedTab, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="px-4 mt-4">
      {/* <h2 className="text-lg font-semibold mb-4">{t('categories')}</h2> */}

      {/* <Tab.Group onChange={setSelectedTab}>
        <Tab.List className="flex space-x-4 mb-6 p-1 bg-gray-100 rounded-xl">
          <Tab className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-300
             ${selected ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-primary'}`
          }>
            {t('services')}
          </Tab>
          {/* <Tab className={({ selected }) =>
            `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-300
             ${selected ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-primary'}`
          }>
            {t('delivery')}
          </Tab> */}
      {/* </Tab.List> */}

      {/* <Tab.Panels> */}
      <AnimatePresence mode="wait">
        {/* <Tab.Panel> */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-3 mt-2 max-xl:grid-cols-3"
        >
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className="w-full h-24 bg-gray-100 rounded-md animate-pulse"
                variants={itemVariants}
              />
            ))
          ) : (
            categoriesData?.data?.categories?.map((category: any) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                className="transition-all duration-300"
              >
                <CategoryCard
                  category={category.name}
                  image={category.imageUrl}
                  categoryId={category.id}
                  onClick={() => handleCategoryClick(category)}
                />
              </motion.div>
            ))
          )}
        </motion.div>
        {/* </Tab.Panel> */}
      </AnimatePresence>
      {/* </Tab.Panels> */}
      {/* </Tab.Group> */}

      <BottomSheet
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        title={selectedCategory?.name}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 sm:grid-cols-6 gap-4"
        >
          {isLoadingServices ? (
            Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className="w-full h-20 bg-gray-100 rounded-md animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))
          ) : (
            servicesData?.data?.map((service: any, index: number) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleServiceClick(service.id)}
                className="p-4 bg-gray-50 rounded-3xl cursor-pointer hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-3 flex-col">
                  {service.iconUrl && (
                    <img src={service.iconUrl} alt={service.name} className="w-16 h-16 rounded-md object-cover" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{service.name}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {!isLoadingServices && servicesData?.data?.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 col-span-2"
            >
              {t("no_services_found")}
            </motion.p>
          )}
        </motion.div>
      </BottomSheet>
    </div>
  );
};

export default Categories;
