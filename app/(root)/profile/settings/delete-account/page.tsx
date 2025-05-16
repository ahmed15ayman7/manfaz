"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { IconTrash, IconAlertTriangle, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import API_ENDPOINTS from '@/lib/apis';
import axios from '@/lib/axios';

export default function DeleteAccountPage() {
    const t = useTranslations();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [reason, setReason] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState('');

    const deleteAccountMutation = useMutation({
        mutationFn: async (data: { password: string; reason: string }) => {
            const res = await axios.post(API_ENDPOINTS.auth.deleteAccount(data));
            return res.data;
        },
        onSuccess: () => {
            setIsDialogOpen(false);
            router.push('/');
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || t('delete_account.error'));
        }
    });

    const handleDeleteAccount = () => {
        if (!password || !reason || !confirmDelete) {
            setError(t('delete_account.fill_all_fields'));
            return;
        }
        deleteAccountMutation.mutate({ password, reason });
    };

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <IconTrash size={32} style={{ marginRight: 16 }} color="error" />
                    <Typography variant="h5" color="error">
                        {t('profile_tab.delete_account')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'error.main',
                        background: 'linear-gradient(45deg, #fff5f5 30%, #fff 90%)'
                    }}
                >
                    <Box display="flex" alignItems="center" mb={3}>
                        <IconAlertTriangle size={24} color="error" style={{ marginRight: 16 }} />
                        <Typography variant="h6" color="error">
                            {t('delete_account.warning')}
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph>
                        {t('delete_account.description')}
                    </Typography>

                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setIsDialogOpen(true)}
                            startIcon={<IconTrash size={20} />}
                        >
                            {t('delete_account.confirm')}
                        </Button>
                    </Box>
                </Paper>

                <Dialog
                    open={isDialogOpen}
                    onClose={() => {
                        setIsDialogOpen(false);
                        setError('');
                        setPassword('');
                        setReason('');
                        setConfirmDelete(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <IconAlertTriangle size={24} color="error" style={{ marginRight: 16 }} />
                            {t('delete_account.confirm_title')}
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="body1" paragraph>
                            {t('delete_account.confirm_description')}
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            label={t('delete_account.password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <IconLock size={20} style={{ marginRight: 8, color: 'text.secondary' }} />
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label={t('delete_account.reason')}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={confirmDelete}
                                    onChange={(e) => setConfirmDelete(e.target.checked)}
                                    color="error"
                                />
                            }
                            label={t('delete_account.confirm_checkbox')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setIsDialogOpen(false);
                                setError('');
                                setPassword('');
                                setReason('');
                                setConfirmDelete(false);
                            }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteAccount}
                            disabled={!password || !reason || !confirmDelete || deleteAccountMutation.isPending}
                            startIcon={deleteAccountMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <IconTrash size={20} />}
                        >
                            {deleteAccountMutation.isPending ? t('common.processing') : t('delete_account.delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </Box>
    );
} 