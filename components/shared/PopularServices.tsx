"use client"
import ServicesCard from "../cards/ServicesCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from '@/lib/config';
import useStore from '@/store/useLanguageStore';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const getServices = async ({ locale, search }: { locale: string, search: string }) => {
  let res = await axios.get(`${BASE_URL}/categories?type=delivery&lang=${locale}&search=${search}`)
  return res.data.data
}

const PopularServices = ({ search }: { search: string }) => {
  let t = useTranslations('home');
  let { locale } = useStore();
  let { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices({ locale, search }),
  })

  let [showAll, setShowAll] = useState(false);

  // تقسيم البيانات حسب الشروط مع مراعاة الموبايل
  // استخدم window.innerWidth أو media query لتحديد الأعمدة
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const firstRowCount = isMobile ? 2 : 3;
  const secondRowCount = isMobile ? 3 : 4;

  let deliveryServiceIndex = services?.categories?.findIndex((cat: any) => cat.subType === 'delivery_service');
  let deliveryService = deliveryServiceIndex !== -1 ? services?.categories?.[deliveryServiceIndex] : null;
  let otherCategories = services?.categories?.filter((cat: any, idx: number) => idx !== deliveryServiceIndex) || [];

  // الصف الأول
  let firstRow = [];
  if (deliveryService) firstRow.push(deliveryService);
  firstRow = firstRow.concat(otherCategories.slice(0, firstRowCount - firstRow.length));
  // الصف الثاني
  let secondRow = otherCategories.slice(firstRowCount - 1, firstRowCount - 1 + secondRowCount);
  // باقي العناصر
  let rest = otherCategories.slice(firstRowCount - 1 + secondRowCount);

  // صور باقي الفئات avatar
  const restAvatars = rest.slice(0, 5).map((cat: any) => (
    <img
      key={cat.id}
      src={cat.imageUrl}
      alt={cat.name}
      className="w-7 h-7 rounded-full border-2 border-white -ml-2 shadow"
      style={{ zIndex: 10 }}
    />
  ));
  // إذا كان هناك أكثر من 5، أضف +
  if (rest.length > 5) {
    restAvatars.push(
      <span key="more" className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border-2 border-white -ml-2 shadow">+{rest.length - 5}</span>
    );
  }

  // زر عرض الكل
  const ShowAllButton = (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow border mx-auto mt-6 mb-2"
      onClick={() => setShowAll(true)}
    >
      {restAvatars}
      <IconChevronDown size={28} className="text-gray-600" />
      {/* <span className="text-sm font-semibold">عرض الكل</span> */}
    </motion.button>
  );

  // زر إغلاق الكل
  const HideAllButton = (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-2 bg-white rounded-full px-4 py-2 shadow border mx-auto mt-6 mb-2"
      onClick={() => setShowAll(false)}
    >
      {/* {restAvatars} */}
      <IconChevronUp size={28} className="text-gray-600" />
      {/* <span className="text-sm font-semibold">إغلاق</span> */}  
    </motion.button>
  );

  useEffect(() => {
    refetch()
  }, [locale, search])

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="px-4 mt-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        {/* <h2 className="text-lg font-semibold">{t('popular_services')}</h2> */}
        <div className="flex items-center gap-2">
          {!isLoading && services?.length > 3 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/categories?type=delivery">
                <p className="text-sm text-primary border border-primary rounded-md px-2 py-1 hover:bg-primary hover:text-white transition-all duration-300">
                  {t('see_all')}
                </p>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* الصف الأول */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-4 mt-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}
      >
        {isLoading ? (
          <motion.div
            className="w-full h-24 rounded-md animate-pulse flex gap-5"
            variants={itemVariants}
          >
            <div className="w-full h-full min-w-[120px] bg-gray-200 rounded-md"></div>
            <div className="w-full h-full min-w-[120px] bg-gray-200 rounded-md"></div>
            <div className="w-full h-full min-w-[120px] bg-gray-200 rounded-md"></div>
          </motion.div>
        ) : (
          firstRow.map((service: any) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="transform transition-all duration-300 hover:shadow-lg rounded-3xl"
            >
              <ServicesCard service={service} id={service.id} />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* الصف الثاني */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid gap-4 mt-4 ${isMobile ? 'grid-cols-3' : 'grid-cols-4'}`}
      >
        {secondRow.map((service: any) => (
          <motion.div
            key={service.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="transform transition-all duration-300 hover:shadow-lg rounded-3xl"
          >
            <ServicesCard service={service} id={service.id} />
          </motion.div>
        ))}
      </motion.div>

      {/* زر عرض الكل بعد الصف الثاني */}
      {!showAll && rest.length > 0 && ShowAllButton}

      {/* باقي العناصر */}
      <AnimatePresence>
        {showAll && rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full"
          >
            <div className={`grid gap-4 mt-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {rest.map((service: any) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="transform transition-all duration-300 hover:shadow-lg rounded-3xl"
                >
                  <ServicesCard service={service} id={service.id} />
                </motion.div>
              ))}
            </div>
            {/* زر إغلاق الكل بعد آخر صف */}
            {HideAllButton}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PopularServices;
