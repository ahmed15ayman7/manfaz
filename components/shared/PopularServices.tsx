"use client"
import ServicesCard from "../cards/ServicesCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "@/constant";
import useStore from '@/store/useLanguageStore';
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

let getServices = async ({ locale }: { locale: string }) => {
  let res = await axios.get(`${apiUrl}/categories?type=delivery&lang=${locale}`)
  return res.data.data
}
const PopularServices = () => {
  let t = useTranslations('home');
  let { locale } = useStore();
  let { data: services, isLoading, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices({ locale }),
  })
  useEffect(() => {
    refetch()
  }, [locale])
  return (
    <div className="px-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('popular_services')}</h2>
        {!isLoading && services?.length > 3 && <Link href="/categories?type=delivery">
          <p className="text-sm text-primary border border-primary rounded-md px-2 py-1 hover:bg-primary hover:text-white transition-all duration-300">{t('see_all')}</p>
        </Link>}
      </div>
      <div className="grid grid-cols-3 gap-4 mt-2 max-xl:grid-cols-2">
        {isLoading && <div className="w-full h-24  rounded-md animate-pulse flex gap-5">
          <div className="w-full h-full  bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-full h-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-full h-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>}
        {!isLoading && services?.map((service: any, index: number) => (
          <ServicesCard key={index} service={service} id={service.id} />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
