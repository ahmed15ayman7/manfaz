import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
  useTheme,
  TablePagination,
} from '@mui/material';
import {
  IconArrowUpRight,
  IconArrowDownLeft,
  IconLoader,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  totalCount?: number;
}

const TransactionsTable = ({
  transactions,
  isLoading,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
}: TransactionsTableProps) => {
  const t = useTranslations('wallet');
  const theme = useTheme();

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <IconLoader size={16} />;
      case 'completed':
        return <IconCheck size={16} />;
      case 'failed':
        return <IconX size={16} />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <IconLoader size={32} color={theme.palette.primary.main} />
        </motion.div>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="textSecondary">
          {t('no_transactions')}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('types.type')}</TableCell>
              <TableCell>{t('amount')}</TableCell>
              <TableCell>{t('status.title')}</TableCell>
              <TableCell>{t('date')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'table-row' }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {transaction.type === 'deposit' ? (
                      <IconArrowUpRight
                        size={20}
                        color={theme.palette.success.main}
                      />
                    ) : (
                      <IconArrowDownLeft
                        size={20}
                        color={theme.palette.error.main}
                      />
                    )}
                    {t(`types.${transaction.type}`)}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'SAR',
                  }).format(transaction.amount)}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(transaction.status)}
                    label={t(`status.${transaction.status}`)}
                    color={getStatusColor(transaction.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.createdAt), 'PPpp', {
                    locale: ar,
                  })}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && onRowsPerPageChange && totalCount && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage={t('rows_per_page')}
          labelDisplayedRows={({ from, to, count }) =>
            t('displayed_rows', { from, to, count })
          }
        />
      )}
    </Paper>
  );
};

export default TransactionsTable; 