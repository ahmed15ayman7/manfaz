"use client"
import { Button, Chip, Skeleton, Stack } from '@mui/material';
import { IconDiscount, IconGift, IconTicket } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '@/constant';
import useStore from '@/store/useLanguageStore';
import { useEffect } from 'react';
let getCategories = async (locale: string) => {
    let res = await axios.get(`${apiUrl}/stores/categories/all?lang=${locale}`)
    return res.data
}
const StoreFilters = ({ onFilterChange, selectedFilter }: { onFilterChange: (filter: string) => void, selectedFilter: string }) => {
    const t = useTranslations();
    let { locale } = useStore();
    let { data: categories, isLoading: isLoadingCategories, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(locale)
    })
    useEffect(() => {
        refetch()
    }, [locale])

    return (
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
            {isLoadingCategories ? [1, 2, 3, 4, 5, 6, 7].map(e => <Skeleton key={e} width={100} height={30} variant="rounded" />) : [
                <Chip
                    key={0}
                    icon={<IconDiscount size={20} />}
                    label={t('all')}
                    onClick={() => onFilterChange('')}
                    color={selectedFilter === '' ? 'primary' : 'default'}
                />, ...categories?.data?.map((category: any) => (
                    <Chip
                        key={category.id}
                        icon={<IconDiscount size={20} />}
                        label={category.name}
                        onClick={() => onFilterChange(category.id)}
                        color={selectedFilter === category.id ? 'primary' : 'default'}
                        variant="outlined"
                        clickable
                    />
                ))
            ]}
        </Stack>
    );
};

export default StoreFilters; 