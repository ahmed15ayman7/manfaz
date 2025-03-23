'use client';
import { Container, Grid, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from '@/lib/apis';
import WalletCard from '@/app/components/wallet/WalletCard';
import TransactionsTable from '@/app/components/wallet/TransactionsTable';

const WalletPage = () => {
  const t = useTranslations('wallet');
  const queryClient = useQueryClient();

  // استعلام لجلب بيانات المحفظة
  const { data: walletData, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.wallets.getById('current',{},false));
      return response.data;
    },
  });

  // استعلام لجلب المعاملات
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.payments.wallet.getTransactions('current',{},false)
      );
      return response.data;
    },
  });

  // تنفيذ عملية الإيداع
  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      await axiosInstance.post(API_ENDPOINTS.payments.wallet.deposit({},false), {
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['wallet']});
      queryClient.invalidateQueries({queryKey:['wallet-transactions']});
    },
  });

  // تنفيذ عملية السحب
  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      await axiosInstance.post(API_ENDPOINTS.payments.wallet.withdraw({},false), {
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['wallet']});
      queryClient.invalidateQueries({queryKey:['wallet-transactions']});
    },
  });

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <WalletCard
              balance={walletData?.balance || 0}
              onDeposit={(amount) => depositMutation.mutateAsync(amount)}
              onWithdraw={(amount) => withdrawMutation.mutateAsync(amount)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {t('transactions')}
            </Typography>
            <TransactionsTable
              transactions={transactions || []}
              isLoading={isLoadingTransactions}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default WalletPage; 