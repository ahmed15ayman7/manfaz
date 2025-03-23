'use client';
import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  IconWallet,
  IconCurrencyRiyal,
  IconMail,
  IconCheck,
  IconX,
  IconLoader,
  IconHomeDot,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from '@/lib/apis';

const schema = z.object({
  amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من صفر'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

type Schema = z.infer<typeof schema>;

const WorkerPayoutPage = () => {
  const t = useTranslations('wallet');
  const queryClient = useQueryClient();
  const [payoutId, setPayoutId] = useState<string | null>(null);

  // استعلام لجلب بيانات المحفظة
  const { data: walletData } = useQuery({
    queryKey: ['worker-wallet'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.wallets.getById('current',{},false));
      return response.data;
    },
  });

  // استعلام لجلب حالة السحب
  const { data: payoutStatus } = useQuery({
    queryKey: ['payout-status', payoutId],
    queryFn: async () => {
      if (!payoutId) return null;
      const response = await axiosInstance.get(
        API_ENDPOINTS.payments.worker.checkPayoutStatus(payoutId,{},false)
      );
      return response.data.data;
    },
    enabled: !!payoutId,
    refetchInterval: (data:any) => (!data || data?.status === 'pending' ? 5000 : false),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  // تنفيذ عملية السحب
  const payoutMutation = useMutation({
    mutationFn: async (data: { amount: number; email: string }) => {
      const response = await axiosInstance.post(API_ENDPOINTS.payments.worker.payout({},false), data);
      return response.data;
    },
    onSuccess: (data) => {
      setPayoutId(data.id);
      queryClient.invalidateQueries({queryKey: ['worker-wallet']});
    },
  });

  const onSubmit = (data: Schema) => {
    payoutMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <IconLoader size={16} />;
      case 'completed':
        return <IconCheck size={16} />;
      case 'failed':
        return <IconX size={16} />;
      default:
        return <IconHomeDot size={16} />;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box py={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <IconWallet size={32} />
                <Typography variant="h5" ml={1}>
                  {t('withdraw')}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                {t('balance')}:{' '}
                {new Intl.NumberFormat('ar-SA', {
                  style: 'currency',
                  currency: 'SAR',
                }).format(walletData?.balance || 0)}
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      {...register('amount', { valueAsNumber: true })}
                      label={t('amount')}
                      type="number"
                      fullWidth
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconCurrencyRiyal />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('email')}
                      label={t('email')}
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconMail />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  {payoutStatus && (
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center">
                        <Chip
                          icon={getStatusIcon(payoutStatus.status)}
                          label={t(`status.${payoutStatus.status}`)}
                          color={getStatusColor(payoutStatus.status)}
                        />
                      </Box>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={payoutMutation.isPending}
                      startIcon={
                        payoutMutation.isPending ? (
                          <CircularProgress size={20} />
                        ) : null
                      }
                    >
                      {t('confirm')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default WorkerPayoutPage; 