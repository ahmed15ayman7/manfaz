"use client"
import React, { use, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from '@/lib/config'
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

const getStores = async (locale: string, page: number = 1, limit: number = 10, search?: string, filter?: string) => {
    const res = await axios.get(
        `${BASE_URL}/stores?lang=${locale}${search ? `&search=${search}` : ''}&page=${page}&limit=${limit}${filter ? `&filter=${filter}` : ''}`
    );
    return res.data;
}

const CategoryPage = () => {
    const t = useTranslations();
    const router = useRouter();
    const { locale } = useStore();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [search, setSearch] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<string>('');
    const [showAll, setShowAll] = useState<boolean>(false);


    const { data: stores, isLoading, refetch } = useQuery({
        queryKey: ['stores', activeFilter, page, limit, search],
        queryFn: () => getStores(locale, page, limit, search, activeFilter),

    });

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


    return (
        <Box sx={{ p: 2 }} className='max-w-[99vw]'>
            {/* <Typography variant="h4" sx={{ mb: 3 }}>
                {t('stores.available_stores')}
            </Typography> */}

            <Box sx={{ mb: 3 }}>
                <SearchBar setSearch={handleSearch} placeholder={t('search.stores_placeholder')} />
            </Box>

            <StoreFilters onFilterChange={setActiveFilter} selectedFilter={activeFilter} showAll={showAll} setShowAll={setShowAll} />

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
                    <ShowAllCategories locale={locale} onFilterChange={setActiveFilter} selectedFilter={activeFilter} />
                </div>
            </BottomSheet>}
        </Box>
    )
}

export default CategoryPage

let ShowAllCategories = ({ locale, onFilterChange, selectedFilter, categoryId }: { locale: string, onFilterChange: (filter: string) => void, selectedFilter: string, categoryId?: string }) => {
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(14);
    const [search, setSearch] = useState<string>('');
    const t = useTranslations();
    let { data: categories, isLoading } = useQuery({
        queryKey: ['categories', page, limit, search, categoryId],
        queryFn: () => getCategories(locale, limit, page, search, categoryId)
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