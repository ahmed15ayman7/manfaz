'use client';
import { Container, Grid, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import API_ENDPOINTS from '@/lib/apis';
import {useUser} from '@/hooks/useUser';
import WalletCard from '@/app/components/wallet/WalletCard';
import TransactionsTable from '@/app/components/wallet/TransactionsTable';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { toast } from 'react-toastify';

const WalletPage = () => {
  let {user,status}=useUser()
  const t = useTranslations('wallet');
  const queryClient = useQueryClient();
  let locale = useLocale();

  // حالة حوار إنشاء المحفظة
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [walletData, setWalletData] = useState({
    userId: user?.id || "",
    balance: 0
  });

  // استعلام لجلب بيانات المحفظة
  const { data: wallet, isLoading: isLoadingWallet,refetch: refetchWallet } = useQuery({
    queryKey: ['wallet',user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(API_ENDPOINTS.wallets.getByUserId(user?.id || "",{},false));
      return response.data.data;
    },
  });

  // استعلام لجلب المعاملات
  const { data: transactions, isLoading: isLoadingTransactions,refetch: refetchTransactions } = useQuery({
    queryKey: ['wallet-transactions',user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        API_ENDPOINTS.payments.wallet.getTransactions(wallet?.id || "",{},false)
      );
      return response.data;
    },
  });

  // تنفيذ عملية الإيداع
  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await axiosInstance.post(API_ENDPOINTS.payments.wallet.deposit({},false), {
        amount,
        userId: user?.id || "",
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({queryKey:['wallet']});
      queryClient.invalidateQueries({queryKey:['wallet-transactions']});
      // toast.success(t('messages.deposit_success'));
      console.log(data)
      if (data.payment.transaction.url) {
        window.location.href = data.payment.transaction.url;
      }

    },
    onError: () => {
      toast.error(t('messages.deposit_failed'));
    }
  });

  // تنفيذ عملية السحب
  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
     let res= await axiosInstance.post(API_ENDPOINTS.payments.wallet.withdraw({},false), {
        amount,
        userId:user?.id || "",
      });
      return res.data.data
    },
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey:['wallet']});
      queryClient.invalidateQueries({queryKey:['wallet-transactions']});
      console.log(data)
      if (data.payment.transaction.url) {
        window.location.href = data.payment.transaction.url;
      }

      toast.success(t('messages.withdraw_success'));
    },
    onError: () => {
      toast.error(t('messages.withdraw_failed'));
    }
  });

  // إنشاء محفظة جديدة
  const createWalletMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(API_ENDPOINTS.wallets.create({}, false), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['wallet']});
      handleCreateDialogClose();
      refetchWallet();
      refetchTransactions();
      toast.success(t('messages.create_success'));
    },
    onError: () => {
      toast.error(t('messages.create_failed'));
    }
  });

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
    setCreateError("");
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
    setCreateError("");
    setWalletData({
      userId: user?.id || "",
      balance: 0
    });
  };

  const handleCreateWallet = async () => {
    try {
      setCreateLoading(true);
      setCreateError("");

      if (!walletData.userId) {
        setCreateError(t('validation.user_required'));
        toast.error(t('validation.user_required'));
        return;
      }

      if (walletData.balance < 0) {
        setCreateError(t('validation.balance_positive'));
        toast.error(t('validation.balance_positive'));
        return;
      }

      await createWalletMutation.mutateAsync(walletData);
    } catch (error: any) {
      setCreateError(error.message || t('messages.create_failed'));
      toast.error(error.message || t('messages.create_failed'));
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(()=>{
    refetchWallet()
    refetchTransactions()
    setWalletData({
      userId: user?.id || "",
      balance: 0
    })
  },[locale,user?.id,status])

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} className="flex justify-between items-center">
            <Typography variant="h4" gutterBottom>
              {t('title')}
            </Typography>
            {!wallet && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateDialogOpen}
              >
                {t('create_wallet')}
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            {wallet ? (
              <WalletCard
                balance={wallet?.balance || 0}
                onDeposit={(amount) => depositMutation.mutateAsync(amount)}
                onWithdraw={(amount) => withdrawMutation.mutateAsync(amount)}
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                {t('no_wallet')}
              </Typography>
            )}
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

      {/* حوار إنشاء محفظة جديدة */}
      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('create_wallet')}</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            {createError && (
              <Typography color="error" className="mb-4">
                {createError}
              </Typography>
            )}
            <TextField
              fullWidth
              type="number"
              label={t('initial_balance')}
              disabled
              value={walletData.balance}
              onChange={(e) => setWalletData({ ...walletData, balance: parseFloat(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose} disabled={createLoading}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleCreateWallet}
            variant="contained"
            color="primary"
            disabled={createLoading}
          >
            {createLoading ? (
              <CircularProgress size={24} />
            ) : (
              t('confirm')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletPage; 