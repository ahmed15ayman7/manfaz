"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, TextField, CircularProgress, Chip } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconTicket } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';
import { useState } from 'react';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    expires_at: string;
    is_used: boolean;
}

export default function CouponsPage() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const [couponCode, setCouponCode] = useState('');

    const { data: coupons, isLoading } = useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.coupons.getAll({}));
            return res.data.data as Coupon[];
        }
    });

    const addCouponMutation = useMutation({
        mutationFn: async (code: string) => {
            const res = await axios.post(API_ENDPOINTS.coupons.apply({ code }), { code });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
            setCouponCode('');
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
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">
                        {t('profile_tab.coupons')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" alignItems="center" mb={2}>
                        <IconTicket size={32} style={{ marginRight: 16 }} />
                        <Typography variant="h6">
                            {t('coupons.apply_coupon')}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={2}>
                        <TextField
                            fullWidth
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={t('coupons.enter_code')}
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 1,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'transparent' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => addCouponMutation.mutate(couponCode)}
                            disabled={!couponCode.trim()}
                            sx={{
                                bgcolor: 'white',
                                color: '#4CAF50',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            {t('coupons.apply')}
                        </Button>
                    </Box>
                </Paper>

                <Box>
                    {(coupons ?? []).map((coupon, index) => (
                        <motion.div
                            key={coupon.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: 100,
                                        height: 100,
                                        background: 'linear-gradient(45deg, transparent 50%, rgba(0,0,0,0.05) 50%)',
                                        transform: 'rotate(45deg) translate(30%, -30%)'
                                    }}
                                />
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {coupon.code}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount} جنيه`}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Chip
                                            label={coupon.is_used ? t('coupons.used') : t('coupons.active')}
                                            color={coupon.is_used ? 'default' : 'success'}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {t('coupons.expires')}: {new Date(coupon.expires_at).toLocaleDateString('ar-EG')}
                                </Typography>
                            </Paper>
                        </motion.div>
                    ))}
                </Box>
            </motion.div>
        </Box>
    );
} 