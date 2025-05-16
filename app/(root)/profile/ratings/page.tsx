"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Rating, Avatar, CircularProgress, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconStar } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';

interface RatingItem {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        name: string;
        avatar: string;
    };
    service: {
        name: string;
        image: string;
    };
}

export default function RatingsPage() {
    const t = useTranslations();
    const userId = 'USER_ID'; // سيتم استبداله بالمعرف الفعلي للمستخدم

    const { data: ratings, isLoading } = useQuery<any[]>({
        queryKey: ['ratings', userId],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.ratings.getAll({}));
            return res.data.data as RatingItem[];
        }
    });

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    const averageRating = ratings?.reduce((acc, curr) => acc + curr.rating, 0) / (ratings?.length || 1);

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 2,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                        color: 'white'
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t('profile_tab.ratings')}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                        <IconStar size={32} style={{ marginRight: 8 }} />
                        <Typography variant="h3">
                            {averageRating.toFixed(1)}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {ratings?.length} {t('ratings.total_ratings')}
                    </Typography>
                </Paper>

                <Box>
                    {(ratings ?? []).map((rating, index) => (
                        <motion.div
                            key={rating.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src={rating.user.avatar}
                                        alt={rating.user.name}
                                        sx={{ width: 48, height: 48, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {rating.user.name}
                                        </Typography>
                                        <Rating value={rating.rating} readOnly size="small" />
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {rating.comment}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Box display="flex" alignItems="center">
                                    <Avatar
                                        src={rating.service.image}
                                        alt={rating.service.name}
                                        sx={{ width: 32, height: 32, mr: 1 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {rating.service.name}
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    ))}
                </Box>
            </motion.div>
        </Box>
    );
} 