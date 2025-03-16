"use client"
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip } from '@mui/material';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Store } from '@/interfaces';
import { useLocationStore } from '@/store/useLocationStore';
import { useMemo } from 'react';
import StoreCardSkeleton from './StoreCardSkeleton';
import { useRouter } from 'next/navigation';

interface StoreCardProps {
    store: Store;
    isLoading?: boolean;
}

const StoreCard = ({ store, isLoading = false }: StoreCardProps) => {
    const t = useTranslations();
    const calculateDistance = useLocationStore((state) => state.calculateDistance);
    const router = useRouter();
    // حساب المسافة للفرع الأقرب
    const nearestLocation = useMemo(() => {
        if (!store.locations || store.locations.length === 0) return null;

        return store.locations.reduce((nearest, location) => {
            const distance = calculateDistance({
                latitude: location.latitude,
                longitude: location.longitude
            });

            if (!nearest || distance < nearest.distance) {
                return { ...location, distance };
            }
            return nearest;
        }, null as (typeof store.locations[0] & { distance: number }) | null);
    }, [store.locations, calculateDistance]);

    // التحقق من حالة المتجر وساعات العمل
    const isOpen = useMemo(() => {
        if (store.status !== 'active') return false;

        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 للأحد، 1 للاثنين، إلخ
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const todayHours = store.workingHours?.find(hours => hours.dayOfWeek === dayOfWeek);

        if (!todayHours || !todayHours.isOpen) return false;

        return currentTime.localeCompare(todayHours.openTime) >= 0 && currentTime.localeCompare(todayHours.closeTime) < 0;
    }, [store.status, store.workingHours]);

    // الحصول على وقت الفتح القادم
    const nextOpenTime = useMemo(() => {
        if (isOpen) return null;

        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const todayHours = store.workingHours?.find(hours => hours.dayOfWeek === dayOfWeek);

        if (todayHours && todayHours.isOpen && currentTime < todayHours.openTime) {
            return todayHours.openTime;
        }

        // البحث عن اليوم التالي المفتوح
        for (let i = 1; i <= 7; i++) {
            const nextDay = (dayOfWeek + i) % 7;
            const nextDayHours = store.workingHours?.find(hours => hours.dayOfWeek === nextDay);

            if (nextDayHours?.isOpen) {
                return nextDayHours.openTime;
            }
        }

        return null;
    }, [isOpen, store.workingHours]);

    // التحقق من وجود خصومات نشطة
    const hasActiveDiscounts = useMemo(() => {
        const now = new Date();
        return store.Discount?.some(discount =>
            discount.isActive &&
            new Date(discount.startDate) <= now &&
            new Date(discount.endDate) >= now
        ) || false;
    }, [store.Discount]);

    // في حالة التحميل، نعرض مكون الـ Skeleton
    if (isLoading) {
        return <StoreCardSkeleton />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.2s ease-in-out'
                    },
                    cursor: isOpen ? "pointer" : "ne-resize"
                }}
                onClick={() => {
                    router.push(`/stores/${store.id}`)
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={store.coverImage || '/placeholder-cover.jpg'}
                        alt={store.name}
                        sx={{
                            filter: !isOpen ? 'grayscale(100%)' : 'none',
                            opacity: !isOpen ? 0.7 : 1
                        }}
                    />
                    <Box
                        component="img"
                        src={store.logo || '/placeholder-logo.jpg'}
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            position: 'absolute',
                            bottom: -30,
                            left: 20,
                            border: '3px solid #fff',
                            backgroundColor: '#fff'
                        }}
                    />
                    {!isOpen && nextOpenTime && (
                        <Chip
                            label={t('stores.opens_at', { time: nextOpenTime })}
                            color="primary"
                            sx={{
                                position: 'absolute',
                                bottom: 10,
                                right: 10
                            }}
                        />
                    )}
                </Box>
                <CardContent sx={{ pt: 4 }}>
                    <Typography variant="h6" component="div">
                        {store.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating value={store.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                            ({store.reviewsCount})
                        </Typography>
                    </Box>
                    {nearestLocation && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <IconMapPin size={16} />
                            <Typography variant="body2" color="text.secondary">
                                {nearestLocation.distance} {t('stores.km_away')}
                            </Typography>
                        </Box>
                    )}
                    {hasActiveDiscounts && (
                        <Chip
                            label={t('stores.discounts_available')}
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StoreCard; 