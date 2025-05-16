"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, CircularProgress, Divider } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconWallet } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';

export default function DeliveryBalancePage() {
    const t = useTranslations();
    const userId = 'USER_ID'; // سيتم استبداله بالمعرف الفعلي للمستخدم

    const { data, isLoading } = useQuery({
        queryKey: ['delivery-balance', userId],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.wallets.getByUserId(userId, {}));
            return res.data.data;
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
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" alignItems="center" mb={2}>
                        <IconWallet size={32} />
                        <Typography variant="h5" sx={{ ml: 2 }}>
                            {t('profile_tab.delivery_balance')}
                        </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                        {data?.balance ?? 0} جنيه
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'white',
                            color: '#2196F3',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.9)'
                            }
                        }}
                    >
                        {t('wallet.withdraw')}
                    </Button>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t('wallet.transactions')}
                    </Typography>
                    <List>
                        {(data?.transactions ?? []).map((tx: any, index: number) => (
                            <Box key={tx.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={tx.type}
                                        secondary={new Date(tx.created_at).toLocaleDateString('ar-EG')}
                                    />
                                    <Typography
                                        variant="body1"
                                        color={tx.amount > 0 ? 'success.main' : 'error.main'}
                                    >
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} جنيه
                                    </Typography>
                                </ListItem>
                                {index < (data?.transactions?.length ?? 0) - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            </motion.div>
        </Box>
    );
} 