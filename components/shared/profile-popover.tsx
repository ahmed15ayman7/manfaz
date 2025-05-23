'use client';

import {
  Box,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';

import {
  IconUser,
  IconSettings,
  IconLogout,
  IconBuildingStore,
  IconTruck,
  IconWallet,
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { alpha } from '@mui/material/styles';
import { User } from '@/interfaces';

interface ProfilePopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  user?:User
}

const menuItems = [
  {
    title: 'الملف الشخصي',
    path: '/profile?id=:id',
    icon: IconUser,
    roles: ['user'],
  },
  {
    title: 'الملف الشخصي',
    path: '/worker/profile/:id',
    icon: IconUser,
    roles: ['worker'],
  },
  {
    title: 'متجري',
    path: '/my-store',
    icon: IconBuildingStore,
    roles: ['store'],
  },
  {
    title: 'طلباتي',
    path: '/orders',
    icon: IconTruck,
    roles: ['user', 'store'],
  },
  {
    title: 'طلباتي',
    path: '/worker/orders',
    icon: IconTruck,
    roles: ['worker'],
  },
  {
    title: 'محفظتي',
    path: '/worker/wallet',
    icon: IconWallet,
    roles: ['worker'],
  },
  {
    title: 'محفظتي',
    path: '/wallet',
    icon: IconWallet,
    roles: ['user', 'store',],
  },
  {
    title: 'الإعدادات',
    path: '/worker/settings',
    icon: IconSettings,
    roles: [ 'worker'],
  },
];

export function ProfilePopover({ open, anchorEl, onClose, user }: ProfilePopoverProps) {
  const handleLogout = () => {
    signOut();
    onClose();
  };

  const filteredMenuItems = menuItems.filter(
    item => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const getItemIcon = (Icon: typeof IconUser) => (
    <Icon
      size={20}
      color={`${(theme: any) => alpha(theme.palette.primary.main || 'var(--primary)', 0.1) as any}`}
      style={{
        padding: '8px',
        borderRadius: '50%',
        backgroundColor: `${(theme: any) => alpha(theme.palette.primary.main || 'var(--primary)', 0.1) as any}`,
      }}
    />
  );

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            width: 280,
            overflow: 'hidden',
            boxShadow: (theme) => `0 0 24px ${alpha(theme.palette.primary.main, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(8px)',
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
          },
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2,
          }}
        >
          <Avatar
            src={user?.imageUrl}
            alt={user?.name}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.dark',
              border: '2px solid',
              borderColor: 'primary.light',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {user?.name?.[0]}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              {user?.name || 'مستخدم'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
      <List
        sx={{
          p: 1,
          maxHeight: 320,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'divider',
            borderRadius: '3px',
          },
        }}
      >
        {filteredMenuItems.map((item) =>{
          item.path=item.path.replace(':id', user?.id||"")
           return (
          <ListItem
            key={item.path}
            component={Link}
            href={item.path}
            onClick={onClose}
            sx={{
              borderRadius: 1,
              py: 1,
              px: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(-4px)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getItemIcon(item.icon)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  {item.title}
                </Typography>
              }
            />
          </ListItem>
)})}
        <ListItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            py: 1,
            px: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
              transform: 'translateX(-4px)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {getItemIcon(IconLogout)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'error.main',
                  fontWeight: 500,
                }}
              >
                تسجيل الخروج
              </Typography>
            }
          />
        </ListItem>
      </List>
    </Popover>
  );
} 