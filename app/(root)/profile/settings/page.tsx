"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import {
    IconUserEdit,
    IconLanguage,
    IconFileText,
    IconShieldLock,
    IconInfoCircle,
    IconTrash
} from '@tabler/icons-react';
import Link from 'next/link';

const settingsItems = [
    {
        id: 'edit-profile',
        title: 'profile_tab.edit_profile',
        icon: IconUserEdit,
        href: '/profile/settings/edit-profile'
    },
    {
        id: 'language',
        title: 'profile_tab.language',
        icon: IconLanguage,
        href: '/profile/settings/language'
    },
    {
        id: 'terms',
        title: 'profile_tab.terms',
        icon: IconFileText,
        href: '/profile/settings/terms'
    },
    {
        id: 'privacy',
        title: 'profile_tab.privacy',
        icon: IconShieldLock,
        href: '/profile/settings/privacy'
    },
    {
        id: 'about',
        title: 'profile_tab.about',
        icon: IconInfoCircle,
        href: '/profile/settings/about'
    },
    {
        id: 'delete-account',
        title: 'profile_tab.delete_account',
        icon: IconTrash,
        href: '/profile/settings/delete-account',
        color: 'error.main'
    }
];

export default function SettingsPage() {
    const t = useTranslations();

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h5" sx={{ mb: 4 }}>
                    {t('profile_tab.settings')}
                </Typography>

                <Paper
                    elevation={2}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    <List>
                        {settingsItems.map((item, index) => (
                            <Box key={item.id}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        sx={{
                                            py: 2,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <item.icon
                                                size={24}
                                                color={item.color || 'inherit'}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t(item.title)}
                                            primaryTypographyProps={{
                                                color: item.color || 'text.primary'
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < settingsItems.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            </motion.div>
        </Box>
    );
} 