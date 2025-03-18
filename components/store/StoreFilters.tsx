"use client"
import { Button, Chip, Skeleton, Stack } from '@mui/material';
import { IconDiscount, IconGift, IconTicket } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import useStore from '@/store/useLanguageStore';
import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/actions/store.action';

const StoreFilters = ({ onFilterChange, selectedFilter, showAll, setShowAll,categoryId }: { onFilterChange: (filter: string) => void, selectedFilter: string, showAll: boolean, setShowAll: (showAll: boolean) => void,categoryId:string }) => {
    const t = useTranslations();
    let { locale } = useStore();
    let { data: categories, isLoading: isLoadingCategories, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(locale,10,1,'',categoryId)
    })
    useEffect(() => {
        refetch()
    }, [locale,categoryId])
    const handleShowAll = () => {
        setShowAll(!showAll)
    }
    return (
        <Stack
            direction="row"
            spacing={2}
            sx={{
                overflowX: 'auto',
                pb: 2,
                width: '100%',
                maxWidth: '99vw',
                flexWrap: 'nowrap',
                minWidth: 0,
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
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

            {isLoadingCategories ? Array(8).map(e => <Skeleton key={e} width={100} height={30} variant="rounded" />) : [
                <Chip
                    key={1000}
                    icon={<IconDiscount size={20} />}
                    label={t('all')}
                    sx={{
                        direction: locale === 'ar' ? 'rtl' : 'ltr',
                        marginLeft: locale === 'ar' ? '16px !important' : '0px !important',
                    }}
                    clickable
                    onClick={() => onFilterChange('')}
                    color={selectedFilter === '' ? 'primary' : 'default'}
                />, ...categories?.data?.map((category: any) => (
                    <Chip
                        key={category.id}
                        icon={
                            <img src={category.image} alt={category.name} width={20} height={20} />
                        }
                        sx={{
                            direction: locale === 'ar' ? 'rtl' : 'ltr',
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
                ,categories?.data?.length > 5 && !showAll ? <Chip
                    key={1000000}
                    icon={<IconDiscount size={20} />}
                    label={t('home.see_all')}
                    sx={{
                        direction: locale === 'ar' ? 'rtl' : 'ltr',
                        marginLeft: locale === 'ar' ? '16px !important' : '0px !important',
                    }}
                    clickable
                    onClick={handleShowAll}
                    color={showAll ? 'primary' : 'default'}
                />:undefined]}
        </Stack>
    );
};

export default StoreFilters;