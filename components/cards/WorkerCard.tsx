import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Card, CardContent, Typography, Chip, Button, Stack, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { IconMapPin, IconStar, IconTrophy, IconWallet } from '@tabler/icons-react';
import { Worker } from '@/interfaces';
import { useTranslations } from 'next-intl'



export default function WorkerCard({ worker, onShowProfile, onOrderNow, distance,isRow }: { worker: Worker, onShowProfile?: (id: string) => void, onOrderNow?: (id: string) => void, distance?: number,isRow?:boolean }) {
    const t = useTranslations('workers')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      
    >
     <Card sx={{ 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.100',
        ...(isRow && { flexDirection: 'row', alignItems: 'center',display: 'flex' })
      }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: isRow ? '50%' : '',
            height: '12rem',
            filter: !worker.isAvailable ? 'grayscale(100%)' : 'none',
            '& img': {
                width: '100%',
                borderRadius: isRow ? '50%' : '',
              height: '100%',
              objectFit: 'cover',
            }
          }}
        >
          <img
            src={worker.user?.imageUrl || '/imgs/default-avatar.png'}
            alt={worker.user?.name || ''}
          />
        </Box>
        {worker?.isAvailable && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 12,
              height: 12,
              bgcolor: 'success.main',
              borderRadius: '50%'
            }}
          />
        )}
      </Box>

      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="h6" component="h3">
              {worker.user?.name}
            </Typography>
            <Typography color="text.secondary">
              {worker.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconStar size={20} style={{ color: '#EAB308' }} />
            <Typography variant="body2" sx={{ mx: 0.5, fontWeight: 500 }}>
              {worker.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({worker.reviewsCount})
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {worker.description}
        </Typography>

        {worker.user?.locations?.[0] && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <IconMapPin size={16} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {worker.user.locations[0].city}
              {distance && ` (${distance.toFixed(1)} km)`}
            </Typography>
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {worker.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            />
          ))}
        </Stack>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            typography: 'body2',
            color: 'text.secondary'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconTrophy size={16} style={{ color: '#059669' }} />
            <Typography component="span" sx={{ color: 'success.main', fontWeight: 500 }}>
              {worker.jobSuccessRate}%
            </Typography>
            {t('success_rate')}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconWallet size={16} />
            <Typography component="span" sx={{ fontWeight: 500 }}>
              ${worker.totalEarned}
            </Typography>
            {t('earned')}
          </Box>
        </Box>

       {onShowProfile && onOrderNow && <Stack direction="row" spacing={1}>
          <Button
            
            variant="outlined"
            fullWidth
            onClick={() => onShowProfile&&onShowProfile(worker.id)}
            sx={{ bgcolor: 'grey.100', color: 'text.primary', '&:hover': { bgcolor: 'grey.200' } }}
          >
            {t('show_profile')}
          </Button>
          <Button
            
            variant="contained"
            fullWidth
            onClick={() => onOrderNow&&onOrderNow(worker.id)}
            disabled={!worker.isAvailable}
            sx={{
              bgcolor: worker.isAvailable ? 'primary.main' : 'grey.300',
              color: worker.isAvailable ? 'white' : 'text.disabled',
              '&:hover': {
                bgcolor: worker.isAvailable ? 'primary.600' : 'grey.300',
              },
            }}
          >
            {t('order_now')}
          </Button>
        </Stack>}
      </CardContent>
    </Card>
    </motion.div>
  );
}
