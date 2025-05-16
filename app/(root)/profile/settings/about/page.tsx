"use client";
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Grid, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { IconInfoCircle, IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from '@tabler/icons-react';

export default function AboutPage() {
    const t = useTranslations();

    return (
        <Box sx={{ py: 4, px: 2 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <IconInfoCircle size={32} style={{ marginRight: 16 }} />
                    <Typography variant="h5">
                        {t('profile_tab.about')}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                {t('about.title')}
                            </Typography>

                            <Typography variant="body1" paragraph>
                                {t('about.description')}
                            </Typography>

                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {t('about.version')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                1.0.0
                            </Typography>

                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {t('about.contact')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                support@manfaz.com
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                {t('about.team')}
                            </Typography>

                            <Grid container spacing={2}>
                                {[1, 2, 3].map((member) => (
                                    <Grid item xs={12} key={member}>
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                src={`/team/member${member}.jpg`}
                                                alt={`Team Member ${member}`}
                                                sx={{ width: 56, height: 56, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="subtitle1">
                                                    {t(`about.team_member${member}.name`)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {t(`about.team_member${member}.role`)}
                                                </Typography>
                                                <Box display="flex" gap={1} mt={1}>
                                                    <IconBrandGithub size={20} style={{ cursor: 'pointer' }} />
                                                    <IconBrandTwitter size={20} style={{ cursor: 'pointer' }} />
                                                    <IconBrandLinkedin size={20} style={{ cursor: 'pointer' }} />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </motion.div>
        </Box>
    );
} 