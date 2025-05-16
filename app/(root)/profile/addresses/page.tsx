"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconMapPin, IconEdit, IconTrash } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';

interface Address {
    id: string;
    title: string;
    address: string;
    phone: string;
}

export default function AddressesPage() {
    const t = useTranslations();
    const userId = 'USER_ID'; // سيتم استبداله بالمعرف الفعلي للمستخدم

    const { data: addresses, isLoading } = useQuery({
        queryKey: ['addresses', userId],
        queryFn: async () => {
            const res = await axios.get(API_ENDPOINTS.userLocations.getAll(userId, {}));
            return res.data.data as Address[];
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
                        {t('profile_tab.addresses')}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<IconMapPin size={20} />}
                    >
                        {t('addresses.add_new')}
                    </Button>
                </Box>

                <List>
                    {(addresses ?? []).map((address) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    '&:hover': {
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <IconButton edge="end" aria-label="edit">
                                                <IconEdit size={20} />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete">
                                                <IconTrash size={20} />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={address.title}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {address.address}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {address.phone}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        </motion.div>
                    ))}
                </List>
            </motion.div>
        </Box>
    );
} 