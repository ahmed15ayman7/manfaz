import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
} from '@mui/material';
import { IconCurrencyRiyal } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من صفر'),
});
type schemaType = z.infer<typeof schema>;
interface DepositDialogProps {
  open: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
}

const DepositDialog = ({ open, onClose, onDeposit }: DepositDialogProps) => {
  const t = useTranslations('wallet');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data:schemaType) => {
    setIsLoading(true);
    try {
      await onDeposit(data.amount);
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component={motion.div}
      sx={{
        opacity: 0,
        y: -20,
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3 }
        }
      }}
      
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('deposit')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box py={2}>
            <TextField
              {...register('amount', { valueAsNumber: true })}
              label={t('amount')}
              type="number"
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message?.toString()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconCurrencyRiyal />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DepositDialog; 