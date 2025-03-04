"use client"
import React, { Suspense, useEffect, useState } from 'react'
import useStore from '@/store/useLanguageStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '@/constant';
import SearchBar from '@/components/shared/SearchBar';
import ServicesCard from '@/components/cards/ServicesCard';
import CategoriesCard from '@/components/cards/CategoryCard';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
const getCategories = async ({ locale, type, page, limit, search }: { locale: string, type: string, page: number, limit: number, search: string }) => {
    const res = await axios.get(`${apiUrl}/categories?type=${type}&lang=${locale}&page=${page}&limit=${limit}&search=${search}`);
    return res.data;
}
function CategoriesPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    let searchParams = useSearchParams();
    const router = useRouter();
    const { locale } = useStore();
    const { data: categories, isLoading: isLoadingCategories, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories({ locale, type: searchParams.get('type') || 'delivery', page, limit, search })
    })
    useEffect(() => {
        refetch();
    }, [search, locale])
    return (
        <div>
            <SearchBar placeholder="Search for a category" setSearch={setSearch} />
            <h1 className='text-2xl font-bold'> {searchParams.get('type') ? searchParams.get('type') : 'Delivery'}</h1>
            <div className="flex overflow-x-auto space-x-4 mt-2">
                {isLoadingCategories ? <div className="w-full h-24  rounded-md animate-pulse flex gap-5">
                    <div className="w-1/4 h-full  bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
                </div> : !isLoadingCategories && categories?.data?.length > 0 ?
                    categories?.data?.map((category: any) => {
                        if (searchParams.get('type') === 'delivery') {
                            return <ServicesCard key={category.id} service={category} id={category.id} />
                        } else {
                            return <CategoriesCard key={category.id} category={category} image={category.image} categoryId={category.id} onClick={() => router.push(`/categories/${category.id}`)} />
                        }
                    })
                    : <div className='flex justify-center items-center h-full'>
                        <h1 className='text-2xl font-bold'>No categories found</h1>
                    </div>}
            </div>
        </div>
    )
}

export default function page() {
    return (
        <Suspense fallback={<div className="w-full h-24  rounded-md animate-pulse flex gap-5">
            <div className="w-1/4 h-full  bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>}>
            <CategoriesPage />
        </Suspense>
    )
}