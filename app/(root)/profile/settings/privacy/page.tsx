"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Tabs, Tab, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { IconShieldLock, IconEye, IconDatabase, IconCookie, IconUser } from '@tabler/icons-react';
import { useState } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`privacy-tabpanel-${index}`}
            aria-labelledby={`privacy-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function PrivacyPage() {
    const t = useTranslations();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const privacyItems = [
        {
            icon: IconEye,
            title: 'privacy.data_collection.title',
            description: 'privacy.data_collection.description'
        },
        {
            icon: IconDatabase,
            title: 'privacy.data_storage.title',
            description: 'privacy.data_storage.description'
        },
        {
            icon: IconCookie,
            title: 'privacy.cookies.title',
            description: 'privacy.cookies.description'
        },
        {
            icon: IconUser,
            title: 'privacy.user_rights.title',
            description: 'privacy.user_rights.description'
        }
    ];

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <IconShieldLock size={32} style={{ marginRight: 16 }} />
                    <Typography variant="h5">
                        {t('profile_tab.privacy')}
                    </Typography>
                </Box>

                <Paper
                    elevation={2}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTab-root': {
                                    minHeight: 64
                                }
                            }}
                        >
                            <Tab label={t('privacy.overview')} />
                            <Tab label={t('privacy.data_collection')} />
                            <Tab label={t('privacy.cookies')} />
                            <Tab label={t('privacy.rights')} />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <TabPanel value={value} index={0}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                                {t('privacy.title')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('privacy.introduction')}
                            </Typography>
                            <Divider sx={{ my: 3 }} />
                            <List>
                                {privacyItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <ListItem sx={{ py: 2 }}>
                                            <ListItemIcon>
                                                <item.icon size={24} color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t(item.title)}
                                                secondary={t(item.description)}
                                                primaryTypographyProps={{ fontWeight: 'bold' }}
                                            />
                                        </ListItem>
                                        {index < privacyItems.length - 1 && <Divider />}
                                    </motion.div>
                                ))}
                            </List>
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                                {t('privacy.data_collection.title')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('privacy.data_collection.content')}
                            </Typography>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                                {t('privacy.cookies.title')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('privacy.cookies.content')}
                            </Typography>
                        </TabPanel>

                        <TabPanel value={value} index={3}>
                            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                                {t('privacy.rights.title')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('privacy.rights.content')}
                            </Typography>
                        </TabPanel>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: 'info.light' }}>
                        <Typography variant="body2" color="info.contrastText">
                            {t('privacy.last_updated')}: {new Date().toLocaleDateString('ar-EG')}
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
} 