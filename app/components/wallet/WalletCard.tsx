'use client';
import { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, useTheme } from '@mui/material';
import { IconWallet, IconPlus, IconMinus } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import DepositDialog from './DepositDialog';
import WithdrawDialog from './WithdrawDialog';

interface WalletCardProps {
  balance: number;
  onDeposit: (amount: number) => Promise<void>;
  onWithdraw: (amount: number) => Promise<void>;
}

const WalletCard = ({ balance, onDeposit, onWithdraw }: WalletCardProps) => {
  const t = useTranslations('wallet');
  const theme = useTheme();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <IconWallet size={32} color={theme.palette.primary.main} />
            <Typography variant="h5" ml={1}>
              {t('title')}
            </Typography>
          </Box>

          <Typography variant="h3" component="div" gutterBottom>
            <motion.span
              key={balance}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: 'SAR',
              }).format(balance)}
            </motion.span>
          </Typography>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              className='flex items-center justify-center gap-2'
              onClick={() => setIsDepositOpen(true)}
              fullWidth
              >
              {t('deposit')}
            </Button>
            <Button
              variant="outlined"
              className='flex items-center justify-center gap-2'
              startIcon={<IconMinus />}
              onClick={() => setIsWithdrawOpen(true)}
              fullWidth
            >
              {t('withdraw')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <DepositDialog
        open={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={onDeposit}
      />

      <WithdrawDialog
        open={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={onWithdraw}
        maxAmount={balance}
      />
    </motion.div>
  );
};

export default WalletCard; 