"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, CircularProgress, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconDiscount } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';
import { StoreOffer } from '@/interfaces';
import { formatDate } from '@/lib/utils';
import useStore from '@/store/useLanguageStore';


export default function OffersPage() {
    const t = useTranslations();
    const { locale } = useStore();
    const { data: offers, isLoading } = useQuery({
        queryKey: ['offers'],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.offers.getAll({}));
            return res.data.data as StoreOffer[];
        }
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5">
                        {t('profile_tab.offers')}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {(offers ?? []).map((offer, index) => (
                        <Grid item xs={12} sm={6} md={4} key={offer.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            transition: 'transform 0.3s ease-in-out'
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            zIndex: 1
                                        }}
                                    >
                                        <Chip
                                            icon={<IconDiscount size={16} />}
                                            label={offer.type === 'percentage' ? `${offer.discount}%` : `${offer.discount} جنيه`}
                                            color="primary"
                                        />
                                    </Box>

                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={offer.image}
                                        alt={offer.name}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Box
                                                component="img"
                                                src={offer.store.logo}
                                                alt={offer.store.name}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    mr: 1
                                                }}
                                            />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {offer.store.name}
                                            </Typography>
                                        </Box>

                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {offer.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {offer.description}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            {t('offers.expires')}: {formatDate(offer.endDate || new Date(), locale)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Box>
    );
} 