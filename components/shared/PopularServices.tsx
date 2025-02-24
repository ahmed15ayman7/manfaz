"use client"
import ServicesCard from "../cards/ServicesCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "@/constant";
import  useStore  from '@/store/useLanguageStore';

let getServices = async ({locale}: {locale: string}) => {
  let res = await axios.get(`${apiUrl}/services?type=delivery&lang=${locale}`)
  return res.data.data
}
const PopularServices = () => {
  let {locale} = useStore();
  let {data:services,isLoading} = useQuery({
    queryKey:['services'],
    queryFn:()=>getServices({locale}),
  })
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-semibold">Popular Services</h2>
      <div className="flex overflow-x-auto space-x-4 mt-2">
        {isLoading && <div className="w-full h-24  rounded-md animate-pulse flex gap-5">
          <div className="w-1/4 h-full  bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
          </div>}
        {!isLoading &&services?.map((service:any, index:number) => (
         <ServicesCard key={index} service={service}  />
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
