'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Typography, Button, Grid, Paper, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from '@/lib/apis';
import { StoreOffer, Product, Store } from '@/interfaces';
import useCartStore from '@/store/useCartStore';
import { useTranslations } from 'next-intl';
import { Store as StoreIcon, LocalOffer, AccessTime, ShoppingCart, Close } from '@mui/icons-material';
import LoadingComponent from "@/components/shared/LoadingComponent";
const OfferDetails = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [offer, setOffer] = useState<StoreOffer | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore((state) => state.addItem);
    const t = useTranslations();

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.offers.findOne(id as string, {}));
                setOffer(response.data.data);
                if (response.data.data.store) {
                    setStore(response.data.data.store);
                }
            } catch (error) {
                console.error('Error fetching offer:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffer();
    }, [id]);

    const handleAddToCart = () => {
        if (offer && store?.isActive) {
            addToCart({
                id: offer.id.toString(),
                type: 'offer',
                quantity: 1,
                offer: offer,
            });
        }
    };

    const calculateTotalPrice = () => {
        if (!offer?.products) return { original: 0, discounted: 0 };
        const original = offer.products.reduce((sum, item) => sum + (item.product?.price || 0), 0);
        const discountValue = Number(offer.discount) || 0;
        const discounted = original * (1 - discountValue / 100);
        return { original, discounted, discountValue };
    };

    if (loading) {
        return (
            <LoadingComponent/>
        );
    }

    if (!offer) {
        return (
            <Container>
                <Typography>Offer not found</Typography>
            </Container>
        );
    }

    const { original, discounted, discountValue } = calculateTotalPrice();

    return (
        <Container maxWidth="lg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ my: 4 }}>
                    {/* معلومات المتجر */}
                    {store && (
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <StoreIcon color="primary" sx={{ fontSize: 40 }} />
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h5">{store.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {store.address}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Chip
                                    style={{padding:"0 10px 0 0"}}
                                        label={store.isActive ? t('stores.store_details.store_status.open') : t('stores.store_details.store_status.closed')}
                                        color={store.isActive ? 'success' : 'error'}
                                        icon={store.isActive ? <AccessTime /> : <Close />}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                {offer.image && (
                                    <motion.img
                                        src={offer.image.toString()}
                                        alt={offer.name.toString()}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocalOffer color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h4">{offer.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    {offer.discount && (
                                        <Chip
                                        style={{padding:"0 10px 0 0"}}
                                            label={`${t('stores.store_details.off')} ${discountValue}%`}
                                            color="primary"
                                            icon={<LocalOffer />}
                                        />
                                    )}
                                    {offer.endDate && (
                                        <Chip
                                        style={{padding:"0 10px 0 0"}}
                                            label={`${t('stores.store_details.valid_until')} ${new Date(offer.endDate).toLocaleDateString()}`}
                                            color="secondary"
                                            icon={<AccessTime />}
                                        />
                                    )}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography paragraph>{offer.description}</Typography>

                                {/* المنتجات المضمنة في العرض */}
                                {offer.products && offer.products.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {t('offers.included_products')}
                                        </Typography>
                                        <AnimatePresence>
                                            {offer.products.map((item, index) => (
                                                <motion.div
                                                    key={item.product?.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Paper
                                                        elevation={1}
                                                        sx={{
                                                            p: 2,
                                                            mb: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap:"9px" }}>
                                                            {item.product?.images?.[0] && (
                                                                <Box
                                                                    component="img"
                                                                    src={item.product.images[0].toString()}
                                                                    alt={item.product.name.toString()}
                                                                    sx={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        borderRadius: 1,
                                                                        objectFit: 'cover',
                                                                        mr: 2,
                                                                    }}
                                                                />
                                                            )}
                                                            <Box>
                                                                <Typography variant="subtitle1">
                                                                    {item.product?.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {item.product?.description}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Typography variant="subtitle1" color="primary">
                                                            {item.product?.price} {t('home_service_details_view.price')}
                                                        </Typography>
                                                    </Paper>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {/* ملخص الأسعار */}
                                        <Paper elevation={2} sx={{ p: 2, mt: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography>{t('offers.original_price')}</Typography>
                                                <Typography sx={{ textDecoration: 'line-through' }}>
                                                    {original} {t('home_service_details_view.price')}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography color="primary">
                                                    {t('offers.discount')} ({discountValue}%)
                                                </Typography>
                                                <Typography color="primary">
                                                    -{original - discounted} {t('home_service_details_view.price')}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="h6">{t('offers.final_price')}</Typography>
                                                <Typography variant="h6" color="primary">
                                                    {discounted} {t('home_service_details_view.price')}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}

                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    className={"flex gap-4"}
                                    onClick={handleAddToCart}
                                    disabled={!store?.isActive}
                                    startIcon={<ShoppingCart />}
                                    sx={{ mt: 3 }}
                                >
                                    {store?.isActive
                                        ? t('offers.addToCart')
                                        : t('stores.store_details.store_status.closed')}
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </motion.div>
        </Container>
    );
};

export default OfferDetails; 