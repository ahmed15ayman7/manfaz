"use client"
import React, { use, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { apiUrl } from '@/constant'
import Loading from '@/components/shared/Loading'
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import useCart from '@/store/useCartStore';
import useStore from '@/store/useLanguageStore';
import StoreFilters from '@/components/store/StoreFilters';
import StoreCard from '@/components/store/StoreCard';
import { Grid, Typography, Box, Stack, Chip, Skeleton } from '@mui/material';
import StoreCardSkeleton from '@/components/store/StoreCardSkeleton'
import SearchBar from '@/components/shared/SearchBar';
import { Pagination } from '@mui/material';
import BottomSheet from '@/components/shared/BottomSheet'
import { getCategories } from '@/lib/actions/store.action'

const getStores = async (id: string, locale: string, page: number = 1, limit: number = 10, search?: string,filter?:string) => {
    const res = await axios.get(
        `${apiUrl}/stores?categoryId=${id}&lang=${locale}${search ? `&search=${search}` : ''}&page=${page}&limit=${limit}${filter ? `&filter=${filter}` : ''}`
    );
    return res.data;
}

const getServices = async (id: string, locale: string, type: string, page: number = 1, limit: number = 10, search?: string) => {
    const res = await axios.get(
        `${apiUrl}/services?categoryId=${id}&lang=${locale}&type=${type}${search ? `&search=${search}` : ''}&page=${page}&limit=${limit}`
    );
    return res.data;
}

const CategoryPage = ({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) => {
    const { id } = params;
    const { type, type2 } = searchParams;
    const t = useTranslations();
    const router = useRouter();
    const { locale } = useStore();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [search, setSearch] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>('');
    const [showAll, setShowAll] = useState<boolean>(false);
    let { data: services, isLoading: isLoadingServices, refetch: refetchServices } = useQuery({
        queryKey: ['services', id, page, limit, search],
        queryFn: () => getServices(id, locale, type as string, page, limit, search)
    });

    const { data: stores, isLoading, refetch } = useQuery({
        queryKey: ['stores', id, activeFilter, page, limit, search],
        queryFn: () => getStores(id, locale, page, limit, search,activeFilter),
        enabled: type === 'delivery' && type2 === 'products'
    });

    const { addItem } = useCart();

    const handleAddToCart = (service: any) => {
        addItem({
            id: service.id,
            type: service.type as 'service' | 'delivery',
            quantity: 1
        })
        // setShowCart(true)
        service && router.push('/checkout')
    }

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        setPage(1); // إعادة تعيين الصفحة عند البحث
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        refetch();
    }, [locale, activeFilter, page, limit, search]);

    if (isLoadingServices) {
        return <Loading />
    }

    if (type2 !== 'products') {
        return <div>
            <div className="mb-4">
                <SearchBar setSearch={setSearch} placeholder={t('search.services_placeholder')} />
            </div>
            <h1 className='text-2xl font-bold'>{services?.data[0]?.category?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {services?.data?.map((service: any) => (
                    <div
                        key={service.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center gap-4 p-4">
                            {service.imageUrl && (
                                <img
                                    src={service.imageUrl}
                                    alt={service.name}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-lg max-sm:text-sm">{service.name}</h3>
                                        {service.warranty && (
                                            <span className="text-green-600 text-sm">
                                                {t('services.warranty_days', { days: service.warranty })}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-lg max-sm:text-sm text-nowrap">{service.price} {t('home_service_details_view.price')}</span>
                                </div>
                                {service.description && (
                                    <p className="text-gray-600 text-sm mt-2">{service.description.slice(0, 50)}...</p>
                                )}
                                {service.installmentAvailable && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <img src="/imgs/tabby.png" alt="Tabby" className="h-4" />
                                        <img src="/imgs/tamara.png" alt="tamara" className="h-4" />
                                        <span className="text-sm text-gray-600">
                                            {t('services.monthly_installment', { amount: service.monthlyInstallment })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex border-t">
                            <button
                                onClick={() => handleAddToCart(service)}
                                className="flex-1 bg-primary text-white py-3 font-medium hover:bg-primary-600 transition-colors"
                            >
                                {t('services.order_now')}
                            </button>
                            <button
                                onClick={() => router.push(`/service-parameters/${service.id}`)}
                                className="flex-1 bg-gray-50 text-gray-700 py-3 font-medium hover:bg-gray-100 transition-colors"
                            >
                                {t('services.show_details')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil((services?.total || 0) / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </div>;
    }
    return (
        <Box sx={{ p: 2 }} className='max-w-[99vw]'>
            <Typography variant="h4" sx={{ mb: 3 }}>
                {t('stores.available_stores')}
            </Typography>

            <Box sx={{ mb: 3 }}>
                <SearchBar setSearch={setSearch} placeholder={t('search.stores_placeholder')} />
            </Box>

            <StoreFilters categoryId={id} onFilterChange={setActiveFilter} selectedFilter={activeFilter} showAll={showAll} setShowAll={setShowAll} />

            <Grid container spacing={3}>
                {isLoading ? [1, 2, 3, 4, 5, 6, 7].map(e =>
                    <Grid item xs={12} sm={6} md={4} key={e}>
                        <StoreCardSkeleton key={e} />
                    </Grid>
                ) : stores?.data?.stores.map((store: any) => (
                    <Grid item xs={12} sm={6} md={4} key={store.id}>
                        <StoreCard store={store} />
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={Math.ceil((stores?.total || 0) / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
            {showAll && <BottomSheet isOpen={showAll} onClose={() => setShowAll(false)} >
                <div>
                    <ShowAllCategories locale={locale} onFilterChange={setActiveFilter} selectedFilter={activeFilter} categoryId={id} />
                </div>
            </BottomSheet>}
        </Box>
    )
}

export default CategoryPage

let ShowAllCategories = ({ locale, onFilterChange, selectedFilter, categoryId }: { locale: string, onFilterChange: (filter: string) => void, selectedFilter: string, categoryId: string }) => {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(14);
    const [search, setSearch] = useState<string>('');
    const t = useTranslations();
    let { data: categories, isLoading } = useQuery({
        queryKey: ['categories', page, limit, search,categoryId],
        queryFn: () => getCategories(locale, limit, page, search,categoryId)
    })
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <Box sx={{ p: 2 }} className='max-w-[99vw]'>
            <SearchBar setSearch={setSearch} placeholder={t('all_stores_categories')} />
            <Stack
                direction="row"
                gridColumn={3}
                spacing={2}
                sx={{
                    pb: 2,
                    width: '100%',
                    mt: 2,
                    maxWidth: '99vw',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0,
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    '-ms-overflow-style': 'none',
                    'scrollbarWidth': 'none',
                    '& .MuiChip-root': {
                        flexShrink: 0,
                        direction: locale === 'ar' ? 'rtl' : 'ltr',
                        '& .MuiChip-icon': {
                            marginLeft: locale === 'ar' ? 0 : '5px',
                            marginRight: locale === 'ar' ? '5px' : 0
                        },
                        '& .MuiChip-label': {
                            paddingLeft: locale === 'ar' ? '12px' : '8px',
                            paddingRight: locale === 'ar' ? '8px' : '12px'
                        }
                    }
                }}
            >

                {isLoading ? Array(7).map(e => <Skeleton key={e} width={100} height={30} variant="rounded" />) : [
                    ...categories?.data?.categories.map((category: any, index: number) => (
                        <Chip
                            key={category.id}
                            icon={
                                <img src={category.image} alt={category.name} width={20} height={20} />
                            }
                            sx={{
                                direction: locale === 'ar' ? 'rtl' : 'ltr',
                                marginRight: locale === 'ar' ? index === 0 ? 0 : "16px !important" : 0,
                                marginLeft: locale === 'ar' ? index === 0 ? 0 : "16px !important" : 0,
                                '& .MuiChip-icon': {
                                    marginLeft: locale === 'ar' ? 0 : '5px',
                                    marginRight: locale === 'ar' ? '5px' : 0
                                },
                                '& .MuiChip-label': {
                                    paddingLeft: locale === 'ar' ? '12px' : '8px',
                                    paddingRight: locale === 'ar' ? '8px' : '12px'
                                }
                            }}
                            label={category.name}
                            onClick={() => onFilterChange(category.id)}
                            color={selectedFilter === category.id ? 'primary' : 'default'}
                            variant="outlined"
                            clickable
                        />
                    ))

                ]}
                <Pagination
                    count={Math.ceil((categories?.total || 0) / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2
                    }}
                />
            </Stack>
        </Box>
    )
}