"use client"
import ServicesCard from "../cards/ServicesCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from '@/lib/config';
import useStore from '@/store/useLanguageStore';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { motion } from "framer-motion";

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
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-4 mt-2 max-xl:grid-cols-2"
      >
        {isLoading ? (
          <motion.div
            className="w-full h-24 rounded-md animate-pulse flex gap-5"
            variants={itemVariants}
          >
            <div className="w-full h-full min-w-[100px] bg-gray-200 rounded-md"></div>
            <div className="w-full h-full min-w-[100px] bg-gray-200 rounded-md"></div>
            <div className="w-full h-full min-w-[100px] bg-gray-200 rounded-md"></div>
          </motion.div>
        ) : (
          services?.categories?.map((service: any, index: number) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="transform transition-all duration-300 hover:shadow-lg"
            >
              <ServicesCard service={service} id={service.id} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default PopularServices;
