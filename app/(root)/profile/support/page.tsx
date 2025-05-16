"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, TextField, CircularProgress, Grid, IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconPhone, IconMail, IconMessage, IconBrandWhatsapp } from '@tabler/icons-react';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';
import { useState } from 'react';

interface SupportMessage {
    name: string;
    email: string;
    message: string;
}

export default function SupportPage() {
    const t = useTranslations();
    const [supportMessage, setSupportMessage] = useState<SupportMessage>({
        name: '',
        email: '',
        message: ''
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (data: SupportMessage) => {
            const res = await axios.post(API_ENDPOINTS.support.contact(data));
            return res.data;
        },
        onSuccess: () => {
            setSupportMessage({ name: '', email: '', message: '' });
            // يمكن إضافة رسالة نجاح هنا
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessageMutation.mutate(supportMessage);
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h5" sx={{ mb: 4 }}>
                    {t('profile_tab.support')}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                height: '100%',
                                background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                                color: 'white'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                {t('support.contact_info')}
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <IconPhone size={24} style={{ marginRight: 16 }} />
                                    <Typography>
                                        +20 123 456 7890
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <IconMail size={24} style={{ marginRight: 16 }} />
                                    <Typography>
                                        support@manfaz.com
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <IconBrandWhatsapp size={24} style={{ marginRight: 16 }} />
                                    <Typography>
                                        +20 123 456 7890
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {t('support.working_hours')}
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                {t('support.send_message')}
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label={t('support.name')}
                                    value={supportMessage.name}
                                    onChange={(e) => setSupportMessage({ ...supportMessage, name: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label={t('support.email')}
                                    type="email"
                                    value={supportMessage.email}
                                    onChange={(e) => setSupportMessage({ ...supportMessage, email: e.target.value })}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    label={t('support.message')}
                                    multiline
                                    rows={4}
                                    value={supportMessage.message}
                                    onChange={(e) => setSupportMessage({ ...supportMessage, message: e.target.value })}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<IconMessage size={20} />}
                                    disabled={!supportMessage.name || !supportMessage.email || !supportMessage.message}
                                >
                                    {t('support.send')}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </motion.div>
        </Box>
    );
} 